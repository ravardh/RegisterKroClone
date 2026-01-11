import Contact from "../models/contactModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Service from "../models/ServiceModel.js";
import Feedback from "../models/feedbackModel.js";
import Leads from "../models/leadsModel.js";
import User from "../models/userModel.js";

export const ContactUs = async (req, res, next) => {
  try {
    const { fullName, email, phone, message } = req.body;

    if (!fullName || !email || !phone || !message) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const newContact = await Contact.create({
      fullName,
      email,
      phone,
      message,
    });

    res.status(201).json({
      message: "Contact form submitted successfully",
      data: newContact,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};
export const LeadCapture = async (req, res, next) => {
  try {
    const { fullName, email, phoneNumber, interestedService } = req.body;

    if (!fullName || !email || !phoneNumber || !interestedService) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // Get the first admin user (SuperAdmin or admin)
    const admin = await User.findOne({
      role: { $in: ["SuperAdmin", "admin"] }
    });

    if (!admin) {
      const error = new Error("No admin found to assign lead");
      error.statusCode = 500;
      return next(error);
    }

    // Generate unique lead ID
    const leadID = `LEAD-${Date.now()}`;

    // Create new lead assigned to admin by default
    const newLead = await Leads.create({
      leadID,
      clientName: fullName,
      clientEmail: email,
      clientPhone: phoneNumber,
      interestedService,
      leadStatus: "new",
      assignedTo: admin._id,
      closeRemarks: "",
    });

    res.status(201).json({
      message: "Lead created successfully",
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};
export const TrackService = (req, res) => {
  res.send("Track Service endpoint");
};

export const PostFeedback = async (req, res, next) => {
  try {
    const { fullName, email, serviceAvailed, message, starRating } = req.body;

    if (!fullName || !email || !serviceAvailed || !message || !starRating) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const service = await Service.findOne({ serviceName: serviceAvailed });
    
    if (!service) {
      const error = new Error("Invalid service selected");
      error.statusCode = 400;
      return next(error);
    }

    const newFeedback = await Feedback.create({
      fullName,
      email,
      serviceAvailed: service._id,
      message,
      starRating,
    });

    res.status(201).json({
      message: "Feedback submitted successfully",
      data: newFeedback,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllFeedback = async (req, res, next) => {
  try {
    const feedbacks = await Feedback.find({ starRating: { $gte: 4 } })
      .populate("serviceAvailed", "serviceName")
      .sort({ starRating: -1, createdAt: -1 })
      .limit(20);

    res.status(200).json({
      message: "Feedbacks fetched successfully",
      data: feedbacks,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeedbackByserviceId = (req, res) => {
  res.send("Get Feedback By Service ID endpoint");
};

export const getPublicServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("serviceName category subCategory")
      .sort({ serviceName: 1 });
    
    res.status(200).json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicSubCategories = async (req, res, next) => {
  try {
    const { categoryId } = req.params;
    
    if (!categoryId) {
      const error = new Error("Category ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const subCategories = await SubCategory.find({ 
      category: categoryId, 
      isActive: true 
    }).sort({ name: 1 });
    
    res.status(200).json({
      message: "Subcategories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublicServicesBySubCategory = async (req, res, next) => {
  try {
    const { subCategoryId } = req.params;
    
    if (!subCategoryId) {
      const error = new Error("SubCategory ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const services = await Service.find({ 
      subCategory: subCategoryId, 
      isActive: true 
    })
      .select("serviceName shortDescription")
      .sort({ serviceName: 1 });
    
    res.status(200).json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getServiceById = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    
    if (!serviceId) {
      const error = new Error("Service ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const service = await Service.findById(serviceId)
      .populate("category", "name")
      .populate("subCategory", "name");
    
    if (!service) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!service.isActive) {
      const error = new Error("Service is not available");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Service details fetched successfully",
      data: service,
    });
  } catch (error) {
    next(error);
  }
};
