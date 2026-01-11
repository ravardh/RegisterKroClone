import mongoose from "mongoose";

const leadsSchema = mongoose.Schema(
  {
    leadID: {
      type: String,
      required: true,
      unique: true,
    },
    clientName: {
      type: String,
      required: true,
    },
    clientEmail: {
      type: String,
      required: true,
    },
    clientPhone: {
      type: String,
      required: true,
    },
    interestedService: {
      type: String,
      required: true,
    },
    leadStages: [
      {
        stageName: {
          type: String,
          enum: [
            "new",
            "contacted",
            "proposal sent",
            "negotiation",
            "document collected",
            "Application done",
            "In Progress",
            "Completed",
          ],
          required: true,
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
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    closeRemarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
const Leads = mongoose.model("Leads", leadsSchema);
export default Leads;
