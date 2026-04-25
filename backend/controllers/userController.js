import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import stripe from "stripe";
import axios from 'axios';
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
    confirmCashPayment
}