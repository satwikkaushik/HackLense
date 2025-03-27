import mongoose, { Schema } from "mongoose";

const EmailLogSchema = new Schema({
  userEmail: {
    type: String,
    required: [true, "User email is required."],
    trim: true,
  },
  subject: {
    type: String,
    required: [true, "Email subject is required."],
    trim: true,
  },
  text: {
    type: String,
    required: [true, "Email text cannot be empty."],
  },
  status: {
    type: String,
    enum: ["sent", "failed"],
    required: true,
  },
  error: {
    type: String,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const EmailLog = mongoose.model("EmailLog", EmailLogSchema);

export default EmailLog;
