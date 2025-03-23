import mongoose, { Schema } from "mongoose";

const KeywordSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    weight: {
        type: Number,
        required: true,
        min: 0,
        max: 10
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Keyword = mongoose.model("keywords", KeywordSchema);

export default Keyword;