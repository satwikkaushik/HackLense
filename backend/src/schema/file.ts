import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema({
    fileName: {
        type: String,
        required: [true, "File name is required."],
        trim: true,
        minlength: [3, "File name must be at least 3 characters long."],
        maxlength: [200, "File name must not exceed 200 characters."],
    },
    fileType: {
        type: String,
        required: [true, "File type is required."],
        enum: {
            values: ["audio", "video", "text", "code"],
            message: "File type must be one of: audio, video, text, or code."
        },
        default: "text",
    },
    fileSize: {
        type: Number,
        required: [true, "File size is required."],
        min: [1, "File size must be greater than 0."]
    },
    fileURL: {
        type: String,
        required: [true, "File URL is required."],
        trim: true,
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: [true, "Uploader reference is required."]
    },
    uploadedAt: {
        type: Date,
        default: Date.now,
    }
});

const File = mongoose.model("files", FileSchema);

export default File;
