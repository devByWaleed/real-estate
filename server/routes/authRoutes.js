import express from "express"
import { google, login, register } from "../controllers/authController.js";

const authRouter = express.Router();

authRouter.post('/signup', register)
authRouter.post('/signin', login)
authRouter.post('/google', google)

export default authRouter