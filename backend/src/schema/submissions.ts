import mongoose, { Schema } from "mongoose";

const SubmissionSchema = new Schema({
  student: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: [true, "Student reference is required."],
  },
  fileType: {
    type: String,
    required: [true, "File type is required."],
    trim: true,
  },
  fileLanguage: {
    type: String,
    required: true,
    trim: true,
  },
  fileURL: {
    type: String,
    required: [true, "File URL is required."],
    trim: true,
  },
  extractedContent: {
    type: String,
    trim: true,
  },
  event: {
    type: Schema.Types.ObjectId,
    ref: "events",
    required: [true, "Event reference is required."],
  },
  // scores: [
  //   {
  //     parameter: {
  //       type: Schema.Types.ObjectId,
  //       ref: "parameters",
  //       required: [true, "Score parameter reference is required."],
  //     },
  //     score: {
  //       type: Number,
  //       required: [true, "Score is required."],
  //       min: [0, "Score must be at least 0."],
  //       max: [10, "Score must not exceed 10."],
  //     },
  //   },
  // ],
  finalScore: {
    type: Number,
    min: [0, "Final score must be at least 0."],
    max: [10, "Final score must not exceed 10."],
  },
  summary: {
    type: String,
    default: "",
    trim: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
});

const Submission = mongoose.model("submissions", SubmissionSchema);

export default Submission;
