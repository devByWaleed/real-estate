import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import UserModel from "../models/Users.js";
import { errorHandler } from "../utils/error.js";



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


        return res.json({ success: true })
    }

    catch (error) {
        next(error)
        // return res.json({ success: false, message: error.message })
    }
}



export const login = async (req, res, next) => {

    const { email, password } = req.body;

    try {
        const validUser = await UserModel.findOne({ email })

        if (!validUser) {
            return res.json({
                success: false,
                message: "User not found!!"
            })
        }

        const validPassword = bcrypt.compareSync(password, validUser.password)

        if (!validPassword) return next(errorHandler(401, "Wrong credentials"))

        const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })

        const { password: pass, ...rest } = validUser._doc

        res.cookie("token", token, { httpOnly: true }).status(200).json(rest)


    } catch (error) {
        next(error)
    }
}



export const google = async (req, res, next) => {
    try {
        const user = await UserModel.findOne({ email: req.body.email })

        if (user) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

            const { password: pass, ...rest } = user._doc

            res.cookie('token', token, { httpOnly: true }).status(200).json(rest)
        }

        else {
            const generatedPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8)

            const hashedPassword = await bcrypt.hash(generatedPassword, 10);

            const newUser = new UserModel({ username: req.body.name.split(" ").join("").toLowerCase() + Math.random().toString(36).slice(-4), email: req.body.email, password: hashedPassword, avatar: req.body.photo })

            await newUser.save()

            const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET)

            const { password: pass, ...rest } = newUser._doc

            res.cookie("token", token, { httpOnly: true }).status(200).json(rest)
        }


    } catch (error) {
        next(error)
    }
}