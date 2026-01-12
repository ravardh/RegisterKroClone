import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    serviceAvailed: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    starRating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
