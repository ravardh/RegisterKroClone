import mongoose from "mongoose";

const leadsSchema = mongoose.Schema(
  {
    serviceID: {
      type: String,
      required: true,
      unique: true,
      sparse: true,
    },
    leadID: {
      type: String,
      unique: true,
      sparse: true,
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
    selectedPackage: {
      type: String,
      required: true,
    },
    state: {
      type: String,
      required: true,
      enum: [
        "Andhra Pradesh",
        "Arunachal Pradesh",
        "Assam",
        "Bihar",
        "Chhattisgarh",
        "Goa",
        "Gujarat",
        "Haryana",
        "Himachal Pradesh",
        "Jharkhand",
        "Karnataka",
        "Kerala",
        "Madhya Pradesh",
        "Maharashtra",
        "Manipur",
        "Meghalaya",
        "Mizoram",
        "Nagaland",
        "Odisha",
        "Punjab",
        "Rajasthan",
        "Sikkim",
        "Tamil Nadu",
        "Telangana",
        "Tripura",
        "Uttar Pradesh",
        "Uttarakhand",
        "West Bengal",
        "Chandigarh",
        "Dadra and Nagar Haveli and Daman and Diu",
        "Lakshadweep",
        "Puducherry",
        "Delhi",
        "Ladakh",
        "Jammu and Kashmir",
      ],
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

// Keep legacy leadID and new serviceID in sync during transition.
leadsSchema.pre("validate", function syncServiceAndLeadId() {
  if (!this.serviceID && this.leadID) {
    this.serviceID = this.leadID;
  }
  if (!this.leadID && this.serviceID) {
    this.leadID = this.serviceID;
  }
});

const Leads = mongoose.model("Leads", leadsSchema);
export default Leads;
