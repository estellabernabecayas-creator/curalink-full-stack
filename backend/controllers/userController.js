import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import axios from 'axios';
import nodemailer from 'nodemailer';
import { sendBookingNotification, sendCancellationNotification, sendPatientBookingConfirmation, sendWelcomeEmail } from '../utils/emailService.js';

// Gateway Initialize
const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY)

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password, countryCode, phoneNumber } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
            phone: phoneNumber ? `${countryCode}${phoneNumber}` : undefined,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // Send welcome email to new user (non-blocking)
        sendWelcomeEmail(user.email, user.name).catch(err => console.log('Welcome email error (non-blocking):', err.message))

        res.json({ success: true, token, userData: { name: user.name, email: user.email, phone: user.phone } })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        // Parse address
        const parsedAddress = JSON.parse(address)

        // Check if profile is complete (all required fields filled and address has content)
        const isProfileComplete = Boolean(
            name && phone && dob && gender && 
            gender !== 'Not Selected' && dob !== 'Not Selected' &&
            parsedAddress && (parsedAddress.line1 || parsedAddress.line2)
        )

        await userModel.findByIdAndUpdate(userId, { 
            name, 
            phone, 
            address: parsedAddress, 
            dob, 
            gender,
            profileCompleted: isProfileComplete 
        })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated', profileCompleted: isProfileComplete })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime, consultationType } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        // Generate meeting ID for online consultations
        const isOnline = consultationType === 'online'
        const meetingId = isOnline ? `CuraLink-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}` : ''

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now(),
            consultationType: consultationType || 'onsite',
            meetingId
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Send email notification to doctor (non-blocking)
        sendBookingNotification(
            docData.email,
            docData.name,
            userData.name,
            { date: slotDate, time: slotTime, consultationType, meetingId }
        ).catch(err => console.log('Email error (non-blocking):', err.message))

        // Send booking confirmation to patient (non-blocking)
        sendPatientBookingConfirmation(
            userData.email,
            userData.name,
            docData.name,
            { date: slotDate, time: slotTime, consultationType, meetingId }
        ).catch(err => console.log('Patient confirmation email error (non-blocking):', err.message))

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        // Send cancellation notification to doctor (non-blocking)
        const userData = await userModel.findById(userId).select("-password")
        sendCancellationNotification(
            doctorData.email,
            doctorData.name,
            userData.name,
            { date: slotDate, time: slotTime }
        ).catch(err => console.log('Cancel email error (non-blocking):', err.message))

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get a single appointment by ID
const getAppointment = async (req, res) => {
    try {
        const { userId } = req.body
        const { appointmentId } = req.body

        const appointment = await appointmentModel.findById(appointmentId)

        if (!appointment) {
            return res.json({ success: false, message: 'Appointment not found' })
        }

        // Verify user owns this appointment
        if (appointment.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized access' })
        }

        res.json({ success: true, appointment })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using PayMongo
const paymentPayMongo = async (req, res) => {
try {
    const { appointmentId } = req.body
    const { origin } = req.headers

    const appointmentData = await appointmentModel.findById(appointmentId)
        .populate('userData', 'name')
        .populate('docData', 'name')
            .populate('userData', 'name')
            .populate('docData', 'name')

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // PayMongo expects amount in centavos (multiply by 100)
        const amountInCentavos = appointmentData.amount * 100

        const options = {
            method: 'POST',
            url: 'https://api.paymongo.com/v1/checkout_sessions',
            headers: {
                accept: 'application/json',
                'content-type': 'application/json',
                authorization: `Basic ${Buffer.from(process.env.PAYMONGO_SECRET_KEY).toString('base64')}`
            },
            data: {
                data: {
                    attributes: {
                        line_items: [
                            {
                                name: `Appointment with Dr. ${appointmentData.docData.name}`,
                                quantity: 1,
                                amount: amountInCentavos,
                                currency: 'PHP'
                            }
                        ],
                        payment_method_types: ['card', 'gcash', 'paymaya'],
                        success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
                        cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
                        description: `Payment for appointment with Dr. ${appointmentData.docData.name}`,
                        metadata: {
                            appointmentId: appointmentData._id.toString(),
                            patientName: appointmentData.userData.name,
                            doctorName: appointmentData.docData.name,
                            amount: appointmentData.amount
                        }
                    }
                }
            }
        }

        const response = await axios(options)
        
        res.json({
            success: true,
            checkout_url: response.data.data.attributes.checkout_url,
            session_id: response.data.data.id
        })

    } catch (error) {
        console.log('PayMongo Error:', error.response?.data || error.message)
        res.json({ success: false, message: error.response?.data?.errors?.[0]?.detail || error.message })
    }
}

// API to make payment of appointment using Stripe
const paymentStripe = async (req, res) => {
    try {

        const { appointmentId } = req.body
        const { origin } = req.headers

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        const currency = process.env.CURRENCY.toLocaleLowerCase()

        const line_items = [{
            price_data: {
                currency,
                product_data: {
                    name: "Appointment Fees"
                },
                unit_amount: appointmentData.amount * 100
            },
            quantity: 1
        }]

        const session = await stripeInstance.checkout.sessions.create({
            success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
            cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
            line_items: line_items,
            mode: 'payment',
        })

        res.json({ success: true, session_url: session.url });

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const verifyStripe = async (req, res) => {
    try {

        const { appointmentId, success } = req.body

        if (success === "true") {
            const appointmentData = await appointmentModel.findById(appointmentId)
            
            // Calculate 80/20 split
            const amount = appointmentData.amount
            const platformFee = Math.round(amount * 0.20) // 20% platform commission
            const doctorEarnings = amount - platformFee // 80% to doctor
            
            await appointmentModel.findByIdAndUpdate(appointmentId, { 
                payment: true,
                platformFee: platformFee,
                doctorEarnings: doctorEarnings
            })
            return res.json({ success: true, message: 'Payment Successful' })
        }

        res.json({ success: false, message: 'Payment Failed' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to generate cash receipt preview (does NOT mark as paid yet)
const paymentCash = async (req, res) => {
    try {
        const { appointmentId } = req.body
        const { userId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // Verify user owns this appointment
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        // Generate unique receipt ID (CASH-YYYYMMDD-XXXXX)
        const date = new Date()
        const dateStr = date.getFullYear().toString() + 
                       String(date.getMonth() + 1).padStart(2, '0') + 
                       String(date.getDate()).padStart(2, '0')
        const randomStr = Math.random().toString(36).substring(2, 7).toUpperCase()
        const receiptId = `CASH-${dateStr}-${randomStr}`

        // Store receipt ID temporarily but DO NOT mark as paid yet
        await appointmentModel.findByIdAndUpdate(appointmentId, { 
            cashReceiptId: receiptId
            // payment: false (still pending)
            // paymentMethod: '' (not set yet)
        })

        res.json({ 
            success: true, 
            message: 'Receipt generated',
            receiptId: receiptId,
            appointment: appointmentData
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to confirm cash payment after user downloads receipt
const confirmCashPayment = async (req, res) => {
    try {
        const { appointmentId, receiptId } = req.body
        const { userId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: 'Appointment Cancelled or not found' })
        }

        // Verify user owns this appointment
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        // Verify receipt ID matches
        if (appointmentData.cashReceiptId !== receiptId) {
            return res.json({ success: false, message: 'Invalid receipt' })
        }

        // Calculate 80/20 split
        const amount = appointmentData.amount
        const platformFee = Math.round(amount * 0.20) // 20% platform commission
        const doctorEarnings = amount - platformFee // 80% to doctor
        
        // Now mark as paid
        await appointmentModel.findByIdAndUpdate(appointmentId, { 
            payment: true,
            paymentMethod: 'cash',
            platformFee: platformFee,
            doctorEarnings: doctorEarnings
        })

        res.json({ 
            success: true, 
            message: 'Cash payment confirmed',
            appointment: appointmentData
        })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to change user password
const changePassword = async (req, res) => {
    try {
        const { userId, currentPassword, newPassword } = req.body

        if (!currentPassword || !newPassword) {
            return res.json({ success: false, message: 'Missing password data' })
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'New password must be at least 8 characters' })
        }

        // Get user from database
        const user = await userModel.findById(userId)

        if (!user) {
            return res.json({ success: false, message: 'User not found' })
        }

        // Verify current password
        const isMatch = await bcrypt.compare(currentPassword, user.password)

        if (!isMatch) {
            return res.json({ success: false, message: 'Current password is incorrect' })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Update password in database
        await userModel.findByIdAndUpdate(userId, { password: hashedPassword })

        res.json({ success: true, message: 'Password updated successfully' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body

        console.log('Forgot password request for email:', email)

        if (!email) {
            return res.json({ success: false, message: 'Email is required' })
        }

        // Check if user exists
        const user = await userModel.findOne({ email })

        if (!user) {
            console.log('User not found in database:', email)
            // Don't reveal if email exists for security
            return res.json({ success: true, message: 'The password reset link has been sent.' })
        }

        console.log('User found:', user.email, user.name)

        // Generate reset token (expires in 1 hour)
        const resetToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' })
        console.log('Reset token generated')

        // Store reset token in user document
        await userModel.findByIdAndUpdate(user._id, { resetToken })
        console.log('Reset token stored in database')

        // Send email using nodemailer
        console.log('Creating email transporter...')
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`
        console.log('Reset URL:', resetUrl)

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset - CuraLink',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h2 style="color: #2563eb;">Password Reset Request</h2>
                    <p>Hello ${user.name},</p>
                    <p>We received a request to reset your password for your CuraLink account.</p>
                    <p>Click the button below to reset your password:</p>
                    <a href="${resetUrl}" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
                    <p>Or copy and paste this link into your browser:</p>
                    <p style="word-break: break-all; color: #666;">${resetUrl}</p>
                    <p>This link will expire in 1 hour.</p>
                    <p>If you didn't request this password reset, please ignore this email.</p>
                    <p>Best regards,<br>CuraLink Team</p>
                </div>
            `
        }

        console.log('Sending email to:', email)
        const info = await transporter.sendMail(mailOptions)
        console.log('Email sent successfully:', info.messageId)

        res.json({ success: true, message: 'Link sent.' })

    } catch (error) {
        console.error('Forgot password error:', error)
        console.error('Error details:', error.code, error.message)
        res.json({ success: false, message: error.message })
    }
}

const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body

        console.log('Reset password request received')
        console.log('Token provided:', token ? 'Yes (first 20 chars): ' + token.substring(0, 20) + '...' : 'No')
        console.log('New password provided:', newPassword ? 'Yes' : 'No')

        if (!token || !newPassword) {
            return res.json({ success: false, message: 'Missing required fields' })
        }

        // Validate new password strength
        if (newPassword.length < 8) {
            return res.json({ success: false, message: 'New password must be at least 8 characters' })
        }

        // Verify token
        let decoded
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET)
            console.log('Token decoded successfully, userId:', decoded.userId)
        } catch (jwtError) {
            console.log('JWT verification failed:', jwtError.message)
            return res.json({ success: false, message: 'Invalid or expired reset token' })
        }
        
        const userId = decoded.userId

        // Find user with matching reset token
        const user = await userModel.findOne({ _id: userId, resetToken: token })
        
        console.log('Looking for user with ID:', userId)
        console.log('User found:', user ? 'Yes' : 'No')
        
        if (!user) {
            // Check if user exists without token match
            const userWithoutToken = await userModel.findById(userId)
            console.log('User exists without token check:', userWithoutToken ? 'Yes' : 'No')
            if (userWithoutToken) {
                console.log('Stored resetToken:', userWithoutToken.resetToken ? 'Exists' : 'Missing')
                console.log('Token match:', userWithoutToken.resetToken === token ? 'Yes' : 'No')
            }
            return res.json({ success: false, message: 'Invalid or expired reset token' })
        }

        // Hash new password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(newPassword, salt)

        // Update password and clear reset token
        await userModel.findByIdAndUpdate(userId, { 
            password: hashedPassword,
            resetToken: null 
        })

        res.json({ success: true, message: 'Password reset successfully' })

    } catch (error) {
        console.log('Reset password error:', error)
        if (error.name === 'TokenExpiredError') {
            return res.json({ success: false, message: 'Reset token has expired. Please request a new one.' })
        }
        res.json({ success: false, message: error.message })
    }
}

export {
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    getAppointment,
    cancelAppointment,
    paymentPayMongo,
    paymentStripe,
    verifyStripe,
    paymentCash,
    confirmCashPayment,
    changePassword,
    forgotPassword,
    resetPassword
}