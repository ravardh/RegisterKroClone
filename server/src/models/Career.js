import mongoose from "mongoose";

const careerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
    },
    mobile: {
      type: String,
      required: [true, "Mobile number is required"],
    },
    designation: {
      type: String,
      required: [true, "Designation is required"],
    },
    resume: {
      type: String,
      required: [true, "Resume is required"],
    },
    status: {
      type: String,
      enum: ["pending", "reviewed", "rejected", "shortlisted"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Career = mongoose.model("Career", careerSchema);
export default Career;
