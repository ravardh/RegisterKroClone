import User from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import Leads from "../models/leadsModel.js";
import Feedback from "../models/feedbackModel.js";
import Service from "../models/ServiceModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Blog from "../models/blogModel.js";
import bcrypt from "bcrypt";
import { sendRmAssignmentEmail } from "../config/emailService.js";
import fs from "fs";
import path from "path";

export const backupDatabase = async (req, res, next) => {
  try {
    const [
      users,
      contacts,
      leads,
      feedbacks,
      services,
      categories,
      subcategories,
      blogs
    ] = await Promise.all([
      User.find().select("-password"),
      Contact.find(),
      Leads.find(),
      Feedback.find(),
      Service.find(),
      Category.find(),
      SubCategory.find(),
      Blog.find()
    ]);

    const backupData = {
      users,
      contacts,
      leads,
      feedbacks,
      services,
      categories,
      subcategories,
      blogs,
      timestamp: new Date().toISOString(),
      version: "1.0.0"
    };

    const jsonBackup = JSON.stringify(backupData, null, 2);
    
    // For now, we'll send it as a JSON file. 
    // The client expects a .zip, but a .json is also acceptable for now 
    // unless they strictly need zip compression.
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename=db_backup_${new Date().toISOString().split('T')[0]}.json`);
    res.status(200).send(jsonBackup);
  } catch (error) {
    next(error);
  }
};

export const getAllLeads = async (req, res, next) => {
  try {
    // Admin can view all leads
    const leads = await Leads.find()
      .populate("assignedTo", "fullName email phone role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Leads fetched successfully",
      data: leads,
    });
  } catch (error) {
    next(error);
  }
};

export const assignLeadToRM = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId || req.params.leadId;
    const { rmId, stageName } = req.body;
    const adminId = req.user._id;

    if (!rmId && !stageName) {
      const error = new Error("Either RM ID or stage name is required");
      error.statusCode = 400;
      return next(error);
    }

    const updateData = {};
    
    if (rmId) {
      updateData.assignedTo = rmId;
    }
    
    if (stageName) {
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
      // Push new stage to leadStages array
      updateData.$push = {
        leadStages: {
          stageName,
          updatedby: adminId,
          updatedAt: new Date(),
        },
      };
    }

    const updatedLead = await Leads.findByIdAndUpdate(
      serviceId,
      updateData,
      { new: true }
    ).populate("assignedTo", "fullName email phone role");

    if (!updatedLead) {
      const error = new Error("Lead not found");
      error.statusCode = 404;
      return next(error);
    }

    // Send RM assignment email if RM was assigned
    if (rmId && updatedLead.assignedTo) {
      try {
        await sendRmAssignmentEmail({
          clientName: updatedLead.clientName,
          clientEmail: updatedLead.clientEmail,
          rmName: updatedLead.assignedTo.fullName,
          rmEmail: updatedLead.assignedTo.email,
          rmPhone: updatedLead.assignedTo.phone,
          serviceId: updatedLead.serviceID || updatedLead.leadID,
          serviceName: updatedLead.interestedService,
        });
      } catch (emailError) {
        console.error("Failed to send RM assignment email:", emailError);
        // Don't fail the request if email fails, just log it
      }
    }

    res.status(200).json({
      message: "Lead updated successfully",
      data: updatedLead,
    });
  } catch (error) {
    next(error);
  }
};


export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.status(200).json({
      message: "Contacts fetched successfully",
      data: contacts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteContact = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Contact ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    if (!deletedContact) {
      const error = new Error("Contact not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Contact deleted successfully",
      data: deletedContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getRm = async (req, res, next) => {
  try {
    const rms = await User.find({ role: "rm" }).select("-password");
    res.status(200).json({
      message: "Relationship Managers fetched successfully",
      data: rms,
    });
  } catch (error) {
    next(error);
  }
};
export const createRm = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      const error = new Error("User with this email already exists");
      error.statusCode = 400;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newRm = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
      role: "rm",
    });

    console.log("New RM created:", newRm);

    res.status(201).json({
      message: "Relationship Manager created successfully",
      data: newRm,
    });
  } catch (error) {
    next(error);
  }
};
export const deleteRm = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("RM ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const deletedRm = await User.findByIdAndDelete(id);

    if (!deletedRm) {
      const error = new Error("Relationship Manager not found");
      error.statusCode = 404;
      return next(error);
    }

    console.log("RM deleted:", deletedRm);

    res.status(200).json({
      message: "Relationship Manager deleted successfully",
      data: deletedRm,
    });
  } catch (error) {
    next(error);
  }
};
export const updateRm = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { fullName, email, phone, password } = req.body;

    if (!id) {
      const error = new Error("RM ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      const error = new Error("Relationship Manager not found");
      error.statusCode = 404;
      return next(error);
    }

    existingUser.fullName = fullName || existingUser.fullName;
    existingUser.email = email || existingUser.email;
    existingUser.phone = phone || existingUser.phone;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      existingUser.password = hashedPassword;
    }

    await existingUser.save();

    res.status(200).json({
      message: "Relationship Manager updated successfully",
      data: existingUser,
    });
  } catch (error) {
    next(error);
  }
};

// Admin feedback management
export const getAllFeedbacks = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find()
      .populate("serviceAvailed", "serviceName")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

export const approveFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Feedback ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const updated = await Feedback.findByIdAndUpdate(
      id,
      { status: "approved" },
      { new: true }
    ).populate("serviceAvailed", "serviceName");

    if (!updated) {
      const error = new Error("Feedback not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Feedback approved",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const rejectFeedback = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Feedback ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const deleted = await Feedback.findByIdAndDelete(id);

    if (!deleted) {
      const error = new Error("Feedback not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Feedback rejected and removed",
      data: deleted,
    });
  } catch (error) {
    next(error);
  }
};

