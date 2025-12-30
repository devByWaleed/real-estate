import express from 'express';
// import connectDB from './config/mongodb.js'
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import userRouter from './routes/userRoutes.js';

mongoose.connect(`${process.env.MONGODB_URI}`).then(() => {
  console.log("Database Connected");
  
}).catch((error) => {
  console.log(error);
  
})


const app = express();


app.use('/api/user', userRouter)
// connectDB()

// app.use(express.json());

// app.use(cookieParser());





app.listen(3000, () => {
  console.log('Server is running on port 3000!!!');
});