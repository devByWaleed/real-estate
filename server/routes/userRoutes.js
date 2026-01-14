import express from "express"
import { deleteUser, getUser, test, updateUser } from "../controllers/userController.js";
import { verifyToken } from "../utils/verifyUser.js";
import { getUserListing } from "../controllers/listingController.js";

const userRouter = express.Router();

userRouter.get('/test', test)
userRouter.post('/update/:id', verifyToken, updateUser)
userRouter.delete('/delete/:id', verifyToken, deleteUser)
userRouter.get('/listing/:id', verifyToken, getUserListing)
userRouter.get('/:id', verifyToken, getUser)

export default userRouter