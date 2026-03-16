import Leads from "../models/leadsModel.js";
import { sendLeadUpdateEmail, sendAdminUpdateNotification } from "../config/emailService.js";

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

export const UpdateLeadStage = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId || req.params.leadId;
    const { stageName } = req.body;
    const rmId = req.user._id;

    if (!stageName) {
      const error = new Error("Stage name is required");
      error.statusCode = 400;
      return next(error);
    }

    const validStages = [
      "new",
      "contacted",
      "proposal sent",
      "negotiation",
      "document collected",
      "Application done",
      "In Progress",
      "Completed",
    ];

    if (!validStages.includes(stageName)) {
      const error = new Error("Invalid stage name");
      error.statusCode = 400;
      return next(error);
    }

    // Add the new stage to the leadStages array
    const updatedLead = await Leads.findByIdAndUpdate(
      serviceId,
      {
        $push: {
          leadStages: {
            stageName,
            updatedby: rmId,
            updatedAt: new Date(),
          },
        },
      },
      { new: true }
    ).populate("assignedTo", "fullName email phone role");

    if (!updatedLead) {
      const error = new Error("Lead not found");
      error.statusCode = 404;
      return next(error);
    }

    // Calculate progress percentage based on stage
    const stageProgress = {
      "new": 10,
      "contacted": 20,
      "proposal sent": 30,
      "negotiation": 40,
      "document collected": 60,
      "Application done": 80,
      "In Progress": 90,
      "Completed": 100,
    };

    const progressPercentage = stageProgress[stageName] || 10;

    // Send progress update email to client (only if stage is significant)
    if (["contacted", "proposal sent", "negotiation", "In Progress"].includes(stageName)) {
      try {
        await sendLeadUpdateEmail({
          clientName: updatedLead.clientName,
          clientEmail: updatedLead.clientEmail,
          serviceId: updatedLead.serviceID || updatedLead.leadID,
          serviceName: updatedLead.interestedService,
          updateTitle: `Service ${stageName}`,
          updateDescription: `Your service request has been ${stageName}. Our team is working on it.`,
          status: "in_progress",
          progressPercentage: progressPercentage,
        });
      } catch (emailError) {
        console.error("Failed to send lead update email:", emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    // Send admin notification
    try {
      await sendAdminUpdateNotification({
        clientName: updatedLead.clientName,
        serviceId: updatedLead.serviceID || updatedLead.leadID,
        serviceName: updatedLead.interestedService,
        updateTitle: `Service Stage Updated to ${stageName}`,
        updateDescription: `Client ${updatedLead.clientName} (${updatedLead.clientEmail}) has been moved to stage: ${stageName}`,
      });
    } catch (emailError) {
      console.error("Failed to send admin notification:", emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(200).json({
      message: "Lead stage updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};

export const UpdateLeadStatus = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId || req.params.leadId;
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
      serviceId,
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
