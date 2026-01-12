import UserModel from "../models/Users.js"
import { errorHandler } from "../utils/error.js"
import bcrypt from "bcryptjs"

export const test = async (req, res) => {
  res.send("hello")
}


export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only update your own account!"))

  try {

    // Password update handling
    if (req.body.password && req.body.password.trim() !== "") {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updatedUser = await UserModel.findByIdAndUpdate(req.params.id, {
      $set: {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        avatar: req.body.avatar,
      }
    }, { new: true })

    const { password, ...rest } = updatedUser._doc

    res.status(200).json(rest)
  } catch (error) {
    next(error)
  }
}



export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) return next(errorHandler(401, "You can only delete your own account!"))

  try {
    await UserModel.findByIdAndDelete(req.params.id)
    res.clearCookie("token");
    res.status(200).json("User has been deleted!")
  } catch (error) {
    next(error)
  }
}