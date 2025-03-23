import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 200
    },
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    rubric: {
        type: Schema.Types.ObjectId,
        ref: "rubrics",
        required: true
    },
    participants: [{
        type: Schema.Types.ObjectId,
        ref: "users"
    }],
    submissions: [{
        type: Schema.Types.ObjectId,
        ref: "submissions"
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

const Event = mongoose.model("events", EventSchema);

export default Event;
