import mongoose, { Schema } from "mongoose";

const FileSchema = new Schema({
    fileName: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxlength: 200
    },
    fileType: {
        type: String,
        required: true,
        enum: ["audio", "video", "text", "code"],
        default: "text"
    },
    fileSize: {
        type: Number,
        required: true
    },
    fileURL: {
        type: String,
        required: true,
        trim: true
    },
    uploadedBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

const File = mongoose.model("files", FileSchema);

export default File;
