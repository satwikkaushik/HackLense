import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, "Name is required."],
        trim: true,
    },
    username: {
        type: String,
        required: [true, "Username is required."],
        unique: true,
        trim: true,
        minlength: [3, "Username must be at least 3 characters long."],
        maxlength: [30, "Username must not exceed 30 characters."],
    },
    email: {
        type: String,
        required: [true, "Email is required."],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Invalid email format."],
    },
    password: {
        type: String,
        required: [true, "Password is required."],
        minlength: [6, "Password must be at least 6 characters long."],
    },
    role: {
        type: String,
        enum: {
            values: ["user", "teacher", "admin"],
            message: "Role must be one of: user, teacher, or admin.",
        },
        default: "user",
    },
    department: {
        type: String,
        trim: true,
        maxlength: [100, "Department name must not exceed 100 characters."],
    },
    designation: {
        type: String,
        trim: true,
        maxlength: [100, "Designation name must not exceed 100 characters."],
    },
    access: {
        type: [String],
        enum: {
            values: ["admin", "editor", "viewer"],
            message: "Access type must be one of: admin, editor, or viewer.",
        },
        required: [true, "Access level is required."],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const User = mongoose.model("users", UserSchema);

export default User;
