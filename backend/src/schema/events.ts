import mongoose, { Schema } from "mongoose";

const EventSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [3, "Title must be at least 3 characters long"],
    maxlength: [200, "Title must not exceed 200 characters"],
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, "Description must not exceed 500 characters"],
  },
  topic: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: [true, "Subject is required"],
  },
  startDate: {
    type: Date,
    required: [true, "Start date is required"],
  },
  endDate: {
    type: Date,
    required: [true, "End date is required"],
  },
  parameters: [
    {
      name: {
        type: String,
        required: [true, "Parameter name is required"],
      },
      priority: {
        type: Number,
        required: [true, "Priority is required"],
        min: [1, "Priority must be at least 1"],
        max: [10, "Priority must not exceed 10"],
      },
    },
  ],
  keywords: {
    type: [String],
    default: [],
  },
  submissions: {
    type: Number,
    default: 0,
    min: [0, "Submissions cannot be negative"],
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  testCases: {
    type: [
      {
        input: mongoose.Schema.Types.Mixed,
        output: mongoose.Schema.Types.Mixed,
      },
    ],
  },
});

const Event = mongoose.model("events", EventSchema);

export default Event;
