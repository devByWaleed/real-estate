import express from 'express';
import connectDB from './config/mongodb.js'


const app = express();

connectDB()

// app.use(express.json());

// app.use(cookieParser());

app.listen(3000, () => {
  console.log('Server is running on port 3000!!!');
});