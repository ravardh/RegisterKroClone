import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    designation: { type: String, required: true, trim: true },
    bio: { type: String, default: "", trim: true },
    image: { type: String, default: "" },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

teamMemberSchema.index({ isActive: 1, order: 1 });

const TeamMember =
  mongoose.models.TeamMember || mongoose.model("TeamMember", teamMemberSchema);

export default TeamMember;
