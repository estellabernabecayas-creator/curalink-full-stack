import mongoose from "mongoose"

const appointmentSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    docId: { type: String, required: true },
    slotDate: { type: String, required: true },
    slotTime: { type: String, required: true },
    userData: { type: Object, required: true },
    docData: { type: Object, required: true },
    amount: { type: Number, required: true },
    platformFee: { type: Number, default: 0 }, // 20% platform commission
    doctorEarnings: { type: Number, default: 0 }, // 80% doctor earnings
    date: { type: Number, required: true },
    cancelled: { type: Boolean, default: false },
    cancellationReason: { type: String, default: '' }, // Reason for cancellation (from doctor)
    payment: { type: Boolean, default: false },
    paymentMethod: { type: String, default: '' }, // 'online' or 'cash'
    cashReceiptId: { type: String, default: '' }, // Unique receipt ID for cash payments
    isCompleted: { type: Boolean, default: false },
    consultationType: { type: String, default: 'onsite' }, // 'onsite' or 'online'
    meetingId: { type: String, default: '' } // Jitsi Meet room ID for online consultations
})

const appointmentModel = mongoose.models.appointment || mongoose.model("appointment", appointmentSchema)
export default appointmentModel