import mongoose from "mongoose"

// Creating user schema
const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });


// .model gets collection name & schema
const UserModel = mongoose.model("user", UserSchema,)
// const UserModel = mongoose.models.user || mongoose.model("user", UserSchema, "listings")


// Exporting the model
export default UserModel