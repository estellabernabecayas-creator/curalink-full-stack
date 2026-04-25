import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, getAppointment, cancelAppointment, paymentPayMongo, paymentStripe, verifyStripe, paymentCash, confirmCashPayment } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/get-appointment", authUser, getAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
userRouter.post("/payment-paymongo", authUser, paymentPayMongo)
userRouter.post("/payment-stripe", authUser, paymentStripe)
userRouter.post("/payment-cash", authUser, paymentCash)
userRouter.post("/confirm-cash-payment", authUser, confirmCashPayment)
userRouter.post("/verifyStripe", authUser, verifyStripe)

export default userRouter;