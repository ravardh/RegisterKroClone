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
    leadStatus: {
      type: String,
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
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
