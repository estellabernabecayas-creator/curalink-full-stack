import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost:27017/curalink')

const doctorModel = mongoose.models.doctor || mongoose.model('doctor', new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}, { timestamps: true }))

const resetPassword = async () => {
    try {
        const doctor = await doctorModel.findOne({ name: "Joshua Mendoza" })
        
        if (doctor) {
            // Set new password to "doctor123"
            const hashedPassword = await bcrypt.hash("doctor123", 10)
            await doctorModel.updateOne(
                { _id: doctor._id },
                { password: hashedPassword }
            )
            console.log('✅ Password reset successfully!')
            console.log('📧 Email:', doctor.email)
            console.log('🔑 New Password: doctor123')
        } else {
            console.log('❌ Doctor not found')
        }
        
        process.exit(0)
    } catch (error) {
        console.error('❌ Error:', error)
        process.exit(1)
    }
}

resetPassword()
