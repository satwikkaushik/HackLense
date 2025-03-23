import mongoose, { Schema } from "mongoose";

const ExtractedContentSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        trim: true
    },
    context: {
        type: String,
        required: true,
        trim: true
    },
    extractedFrom: {
        type: Schema.Types.ObjectId,
        ref: "files",
        required: true,
    },
    keywords: [
        {
            word: {
                type: String,
                required: true,
                trim: true
            },
            frequency: {
                type: Number,
                required: true,
                min: 1
            },
            relevance: {
                type: Number,
                required: true,
                min: 0,
                max: 1,
                set: (v: number) => Math.floor(v * 100) / 100
            }
        }
    ],
    extractedAt: {
        type: Date,
        default: Date.now
    }
});

const ExtractedContent = mongoose.model("extractedContents", ExtractedContentSchema);

export default ExtractedContent;