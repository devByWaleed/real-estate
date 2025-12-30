// register
// login
// logout
// reset password 

import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/Users.js";
import transporter from "../config/nodeMailer.js";




// User registration controller function
export const register = async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.json({
            success: false,
            message: "Missing Details"
        })
    }

    try {
        const existingUser = await UserModel.findOne({ email })

        if (existingUser) {
            return res.json({
                success: false,
                message: "User already existed"
            })
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new UserModel({ name, email, password: hashedPassword })
        await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000 })

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: email,
            subject: "Welcome to GreatStack",
            text: `Welcome to GreatStack. Your account has been created successfully with email id ${email}`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// User login controller function
export const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.json({
            success: false,
            message: "Email and Password are required"
        })
    }

    try {
        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "Invalid Email"
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.json({
                success: false,
                message: "Invalid Password"
            })
        }

        // await user.save();

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000 })

        return res.json({ success: true })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// User logout controller function
export const logout = async (req, res) => {

    try {
        res.clearCookie("token", {
            httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict"
        })

        return res.json({ success: true, message: "Logged Out" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}




// User OTP Verification controller function
export const sendVerifyOTP = async (req, res) => {

    try {
        // const { userID } = req.body;
        const userID = req.userID;

        const user = await UserModel.findById(userID)

        if (user.isAccountVerified) {
            return res.json({ success: true, message: "Account Already Verified" })
        }

        // Generating OTP
        const otp = String(Math.floor(100000 + Math.random() * 90000))

        user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 3600 * 1000

        await user.save();

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Account Verification OTP",
            text: `Your OTP Is ${otp}. Verify your account using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "Verification OTP sent on Email" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// User Email verification controller function
export const verifyEmail = async (req, res) => {
    // const { userID, otp } = req.body;
    const { otp } = req.body;
    const userID = req.userID;

    if (!userID || !otp) {
        return res.json({ success: false, message: "Missing Details" })
    }

    try {

        const user = await UserModel.findById(userID)

        if (!user) {
            return res.json({ success: false, message: "User not found" })
        }

        if (user.verifyOTP === "" || user.verifyOTP !== otp) {
            return res.json({ success: false, message: "Invalid OTP" })
        }

        if (user.verifyOTPExpireAt < Date.now()) {
            return res.json({ success: false, message: "OTP Expired" })
        }

        user.isAccountVerified = true;
        user.verifyOTP = "";
        user.verifyOTPExpireAt = 0;

        await user.save();

        return res.json({ success: true, message: "Email verified successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// Check User is Authenticated
export const isAuthenticated = async (req, res) => {

    try {
        return res.json({ success: true })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// Password reset OTP
export const sendResetOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.json({
            success: false,
            message: "Email is required"
        })
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        // Generating OTP
        const otp = String(Math.floor(100000 + Math.random() * 90000))

        user.resetOTP = otp;
        user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000

        await user.save()

        // Sending welcome email
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: "Password Reset OTP",
            text: `Your OTP Is ${otp}. Reset your password using this OTP.`
        }

        await transporter.sendMail(mailOptions);

        return res.json({ success: true, message: "OTP send to your email" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}





// Reset user password 
export const resetPassword = async (req, res) => {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
        return res.json({
            success: false,
            message: "Email,OTP, new password is required"
        })
    }

    try {

        const user = await UserModel.findOne({ email })

        if (!user) {
            return res.json({
                success: false,
                message: "User not found"
            })
        }

        if (user.resetOTP === "" || user.resetOTP !== otp) {
            return res.json({
                success: false,
                message: "Invalid otp"
            })
        }

        if (user.resetOTPExpireAt < Date.now()) {
            return res.json({
                success: false,
                message: "OTP Expired"
            })
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        user.password = hashedPassword
        user.resetOTP = ""
        user.resetOTPExpireAt = 0

        await user.save();


        return res.json({ success: true, message: "Password has been reset successfully" })
    }

    catch (error) {
        return res.json({ success: false, message: error.message })
    }
}
