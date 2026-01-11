import Leads from "../models/leadsModel.js";

export const AssignedLeads = async (req, res, next) => {
  try {
    const rmId = req.user._id; // Get the logged-in RM's ID from auth middleware

    // Fetch leads assigned to this RM
    const leads = await Leads.find({ assignedTo: rmId })
      .populate("assignedTo", "fullName email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Assigned leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateLeadStatus = async (req, res, next) => {
  try {
    const { leadId } = req.params;
    const { leadStatus, closeRemarks } = req.body;

    if (!leadStatus) {
      const error = new Error("Lead status is required");
      error.statusCode = 400;
      return next(error);
    }

    const validStatuses = ["new", "contacted", "converted", "closed"];
    if (!validStatuses.includes(leadStatus)) {
      const error = new Error("Invalid lead status");
      error.statusCode = 400;
      return next(error);
    }

    const updatedLead = await Leads.findByIdAndUpdate(
      leadId,
      {
        leadStatus,
        closeRemarks: closeRemarks || "",
      },
      { new: true }
    ).populate("assignedTo", "fullName email phone role");

    if (!updatedLead) {
      const error = new Error("Lead not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Lead status updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};
