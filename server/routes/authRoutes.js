import express from "express"
import { google, login, register, signOut } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/signup', register)
authRouter.post('/signin', login)
authRouter.post('/google', google)
authRouter.get('/signout', signOut)

export default authRouter