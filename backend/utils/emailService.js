import nodemailer from 'nodemailer'

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
})

// Send booking notification to doctor
const sendBookingNotification = async (doctorEmail, doctorName, patientName, appointmentDetails) => {
  const consultationType = appointmentDetails.consultationType || 'onsite'
  const isOnline = consultationType === 'online'
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: isOnline ? 'New Online Consultation Booking' : 'New Appointment Booking',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #2563eb;">New Patient Booking</h2>
        <p>Hello ${doctorName},</p>
        <p>A new patient has booked an ${isOnline ? 'online video consultation' : 'appointment'} with you.</p>
        
        <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Appointment Details</h3>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p><strong>Type:</strong> ${isOnline ? 'Online Video Consultation' : 'On-site Consultation'}</p>
          ${isOnline && appointmentDetails.meetingId ? `<p><strong>Meeting ID:</strong> ${appointmentDetails.meetingId}</p>` : ''}
        </div>
        
        ${isOnline ? `<div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #2563eb;">
          <p style="margin: 0;"><strong>Note:</strong> This is an online consultation. Please join the video call through your dashboard at the scheduled time.</p>
        </div>` : ''}
        
        <p>Please check your dashboard for more details.</p>
        <br/>
        <p style="color: #6b7280; font-size: 12px;">CuraLink Medical System</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Booking email sent to ${doctorName}`)
    return true
  } catch (error) {
    console.error('Email send failed:', error)
    return false
  }
}

// Send cancellation notification to doctor
const sendCancellationNotification = async (doctorEmail, doctorName, patientName, appointmentDetails) => {
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: doctorEmail,
    subject: 'Appointment Cancelled by Patient',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Hello ${doctorName},</p>
        <p>A patient has cancelled their appointment with you.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca;">
          <h3 style="margin-top: 0; color: #dc2626;">Cancelled Appointment Details</h3>
          <p><strong>Patient:</strong> ${patientName}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
        </div>
        
        <p>The time slot has been released and is now available for other bookings.</p>
        <br/>
        <p style="color: #6b7280; font-size: 12px;">CuraLink Medical System</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Cancellation email sent to ${doctorName}`)
    return true
  } catch (error) {
    console.error('Cancellation email failed:', error)
    return false
  }
}

// Send appointment completed notification to patient
const sendAppointmentCompletedNotification = async (patientEmail, patientName, doctorName, appointmentDetails) => {
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: 'Appointment Completed - Thank You for Visiting',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #16a34a;">Appointment Completed</h2>
        <p>Hello ${patientName},</p>
        <p>Your appointment with <strong>${doctorName}</strong> has been marked as completed.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
          <h3 style="margin-top: 0; color: #16a34a;">Appointment Summary</h3>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p><strong>Status:</strong> <span style="color: #16a34a; font-weight: bold;">Completed</span></p>
        </div>
        
        <p>Thank you for choosing CuraLink for your healthcare needs. We hope you had a great experience.</p>
        <p>If you need to book another appointment, please visit your dashboard.</p>
        <br/>
        <p style="color: #6b7280; font-size: 12px;">CuraLink Medical System</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Completion email sent to ${patientName}`)
    return true
  } catch (error) {
    console.error('Completion email failed:', error)
    return false
  }
}

// Send doctor cancellation notification to patient (with reason)
const sendDoctorCancellationNotification = async (patientEmail, patientName, doctorName, appointmentDetails, cancellationReason) => {
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: 'Appointment Cancelled by Doctor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc2626;">Appointment Cancelled</h2>
        <p>Hello ${patientName},</p>
        <p>We regret to inform you that your appointment has been cancelled by <strong>${doctorName}</strong>.</p>
        
        <div style="background: #fef2f2; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #fecaca;">
          <h3 style="margin-top: 0; color: #dc2626;">Cancelled Appointment Details</h3>
          <p><strong>Doctor:</strong> ${doctorName}</p>
          <p><strong>Date:</strong> ${appointmentDetails.date}</p>
          <p><strong>Time:</strong> ${appointmentDetails.time}</p>
          <p><strong>Status:</strong> <span style="color: #dc2626; font-weight: bold;">Cancelled</span></p>
        </div>
        
        <div style="background: #ffedd5; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
          <p style="margin: 0;"><strong>Reason for Cancellation:</strong></p>
          <p style="margin: 5px 0 0 0; color: #9a3412;">${cancellationReason || 'No reason provided'}</p>
        </div>
        
        <p>We sincerely apologize for any inconvenience this may have caused. You can book a new appointment through your dashboard at any time.</p>
        <p>If you have any concerns, please contact our support team.</p>
        <br/>
        <p style="color: #6b7280; font-size: 12px;">CuraLink Medical System</p>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Doctor cancellation email sent to ${patientName}`)
    return true
  } catch (error) {
    console.error('Doctor cancellation email failed:', error)
    return false
  }
}

// Send booking confirmation to patient
const sendPatientBookingConfirmation = async (patientEmail, patientName, doctorName, appointmentDetails) => {
  const consultationType = appointmentDetails.consultationType || 'onsite'
  const isOnline = consultationType === 'online'
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: patientEmail,
    subject: isOnline ? 'Online Consultation Booked - CuraLink' : 'Appointment Booked - CuraLink',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #16a34a, #15803d); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">${isOnline ? 'Online Consultation Booked!' : 'Appointment Booked!'}</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hello ${patientName},</p>
          
          <p style="font-size: 16px; color: #374151;">Your ${isOnline ? 'online video consultation' : 'appointment'} has been successfully booked with <strong>${doctorName}</strong>.</p>
          
          <div style="background: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #16a34a;">
            <h3 style="margin-top: 0; color: #15803d;">Appointment Details</h3>
            <p style="margin: 5px 0;"><strong>Doctor:</strong> ${doctorName}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${appointmentDetails.date}</p>
            <p style="margin: 5px 0;"><strong>Time:</strong> ${appointmentDetails.time}</p>
            <p style="margin: 5px 0;"><strong>Type:</strong> ${isOnline ? 'Online Video Consultation' : 'On-site Consultation'}</p>
            ${isOnline && appointmentDetails.meetingId ? `<p style="margin: 5px 0;"><strong>Meeting ID:</strong> ${appointmentDetails.meetingId}</p>` : ''}
          </div>
          
          ${isOnline ? `<div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1d4ed8;">Video Call Instructions</h3>
            <p style="font-size: 14px; color: #374151; margin: 5px 0;">1. Click the "Join Video Call" button in your dashboard at the scheduled time</p>
            <p style="font-size: 14px; color: #374151; margin: 5px 0;">2. Allow camera and microphone access when prompted</p>
            <p style="font-size: 14px; color: #374151; margin: 5px 0;">3. Wait for the doctor to join the consultation</p>
          </div>
          <p style="font-size: 16px; color: #374151;">Please test your camera and microphone before the call. If you need to cancel or reschedule, you can do so through your dashboard.</p>` : `<p style="font-size: 16px; color: #374151;">Please arrive 10-15 minutes early for your appointment. If you need to cancel or reschedule, you can do so through your dashboard.</p>`}
          
          <p style="font-size: 16px; color: #374151;">Thank you for choosing CuraLink!</p>
          
          <br/>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br/><strong>The CuraLink Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">CuraLink Medical System - Your Health, Our Priority</p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Booking confirmation sent to ${patientName} at ${patientEmail}`)
    return true
  } catch (error) {
    console.error('Patient booking confirmation failed:', error)
    return false
  }
}

// Send welcome email to new user after registration
const sendWelcomeEmail = async (userEmail, userName) => {
  const mailOptions = {
    from: `"CuraLink" <${process.env.EMAIL_USER}>`,
    to: userEmail,
    subject: 'Welcome to CuraLink - Thank You for Signing Up!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #2563eb, #1d4ed8); padding: 30px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0;">Welcome to CuraLink!</h1>
        </div>
        
        <div style="background: #ffffff; padding: 30px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb;">
          <p style="font-size: 16px; color: #374151;">Hello ${userName},</p>
          
          <p style="font-size: 16px; color: #374151;">Thank you for signing up with <strong>CuraLink</strong>! We're excited to have you as part of our healthcare community.</p>
          
          <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #2563eb;">
            <h3 style="margin-top: 0; color: #1d4ed8;">What's Next?</h3>
            <ul style="color: #374151; padding-left: 20px;">
              <li>Complete your profile to get personalized recommendations</li>
              <li>Browse our network of qualified doctors</li>
              <li>Book appointments seamlessly online</li>
            </ul>
          </div>
          
          <p style="font-size: 16px; color: #374151;">If you have any questions or need assistance, feel free to reach out to our support team, just go to our contact details.</p>
          
          <p style="font-size: 16px; color: #374151;">We're here to help you take control of your health!</p>
          
          <br/>
          <p style="color: #6b7280; font-size: 14px;">Best regards,<br/><strong>The CuraLink Team</strong></p>
          
          <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;"/>
          <p style="color: #9ca3af; font-size: 12px; text-align: center;">CuraLink Medical System - Your Health, Our Priority</p>
        </div>
      </div>
    `
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Welcome email sent to ${userName} at ${userEmail}`)
    return true
  } catch (error) {
    console.error('Welcome email failed:', error)
    return false
  }
}

export { sendBookingNotification, sendCancellationNotification, sendAppointmentCompletedNotification, sendDoctorCancellationNotification, sendPatientBookingConfirmation, sendWelcomeEmail }
