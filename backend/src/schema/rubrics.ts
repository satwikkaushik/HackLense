import mongoose, { Schema } from "mongoose";

const RubricSchema = new Schema({
    title: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 200,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        minLength: 3,
        maxlength: 500
    },
    parameters: [{
        type: Schema.Types.ObjectId,
        ref: "parameters"
    }],
    keywords: [{
        type: Schema.Types.ObjectId,
        ref: "keywords"
    }],
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Rubric = mongoose.model("rubrics", RubricSchema);

export default Rubric;
