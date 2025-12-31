import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"
import UserModel from "../models/Users.js";




// User registration controller function
export const register = async (req, res, next) => {
    
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
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

        const user = new UserModel({ username, email, password: hashedPassword })
        await user.save();

        // const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        // res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: process.env.NODE_ENV === "production" ? "none" : "strict", maxAge: 7 * 24 * 3600 * 1000 })




        return res.json({ success: true })
    }

    catch (error) {
        next(error)
        // return res.json({ success: false, message: error.message })
    }
}
