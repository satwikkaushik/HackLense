import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ["user", "teacher", "admin"],
        default: "user"
    },
    department: {
        type: String,
        trim: true,
        maxlength: 100
    },
    designation: {
        type: String,
        trim: true,
        maxlength: 100
    },
    access: {
        type: [String],
        enum: ["admin", "editor", "viewer"],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model("users", UserSchema);

export default User;
