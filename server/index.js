import express from 'express';
// import connectDB from './config/mongodb.js'
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import dotenv from "dotenv";
dotenv.config();
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';



mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
  console.log("Database Connected");
  
}).catch((error) => {
  console.log(error);
  
})


const app = express();

app.use(express.json());

app.use(cookieParser())

app.use('/api/user', userRouter)
app.use('/api/auth', authRouter)
// connectDB()


app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  const message = err.message || "Internal Server Error"
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message
  })
})





app.listen(3000, () => {
  console.log('Server is running on port 3000!!!');
});