import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,  
            required: true,
            unique: true,
            lowercase: true
        },
        password: {
            type: String,
            required: true,
            minlength: 8,
            select: false
        },
        role: {
            type: String,
            default: "user"
        },
        token: {
            type: Number,
            default: 5
        }
    },
    {timestamps: true}
);

export default mongoose.model("User", userSchema);