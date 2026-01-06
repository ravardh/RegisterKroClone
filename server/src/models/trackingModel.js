import mongoose from "mongoose";

const trackingSchema = mongoose.Schema(
  {
    leadID: {
      type: String,
      required: true,
      unique: true,
    },
    ServiceName: {
      type: String,
      required: true,
    },
    stages: [
      {
        stageName: {
          type: String,
          required: true,
        },
        status: {
          type: String,
          enum: ["pending", "in-progress", "completed"],
          default: "pending",
        },
        updatedby: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        updatedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Tracking = mongoose.model("Tracking", trackingSchema);

export default Tracking;
