import mongoose, { Schema } from "mongoose";

const ExtractedContentSchema = new Schema({
    content: {
        type: String,
        required: [true, "Content is required."],
        trim: true,
    },
    context: {
        type: String,
        required: [true, "Context is required."],
        trim: true,
    },
    extractedFrom: {
        type: Schema.Types.ObjectId,
        ref: "files",
        required: [true, "Reference to the source file is required."],
    },
    keywords: [
        {
            word: {
                type: String,
                required: [true, "Keyword word is required."],
                trim: true,
            },
            frequency: {
                type: Number,
                required: [true, "Keyword frequency is required."],
                min: [1, "Keyword frequency must be at least 1."],
            },
            relevance: {
                type: Number,
                required: [true, "Relevance score is required."],
                min: [0, "Relevance must be at least 0."],
                max: [1, "Relevance must not exceed 1."],
                set: (v: number) => Math.floor(v * 100) / 100, // Rounds to 2 decimal places
            },
        },
    ],
    extractedAt: {
        type: Date,
        default: Date.now,
    },
});

const ExtractedContent = mongoose.model("extractedContents", ExtractedContentSchema);

export default ExtractedContent;