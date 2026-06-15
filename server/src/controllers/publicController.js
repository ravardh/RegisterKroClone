import Contact from "../models/contactModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import Service from "../models/ServiceModel.js";
import Feedback from "../models/feedbackModel.js";
import Leads from "../models/leadsModel.js";
import User from "../models/userModel.js";
import Visitor from "../models/Visitor.js";
import Career from "../models/Career.js";
import { sendContactFormEmail, sendLeadCreationEmail } from "../config/emailService.js";

const formatDatePart = (date = new Date()) => {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = String(date.getFullYear()).slice(-2);
  return `${day}${month}${year}`;
};

const sanitizePhoneForId = (phoneNumber) => String(phoneNumber || "").replace(/\D/g, "");

const getNextDailySequence = async (datePart) => {
  const todaysIds = await Leads.find({
    $or: [
      { serviceID: { $regex: `^SERVICE_${datePart}_` } },
      { leadID: { $regex: `^SERVICE_${datePart}_` } },
    ],
  })
    .select("serviceID leadID -_id")
    .lean();

  let maxSequence = 10000;

  for (const lead of todaysIds) {
    const idValue = lead.serviceID || lead.leadID;
    const matched = idValue?.match(/(\d{5})$/);
    if (matched) {
      const sequence = Number(matched[1]);
      if (sequence > maxSequence) {
        maxSequence = sequence;
      }
    }
  }

  const nextSequence = maxSequence + 1;
  if (nextSequence > 99999) {
    const error = new Error("Daily service ID limit reached. Please try again tomorrow.");
    error.statusCode = 429;
    throw error;
  }

  return String(nextSequence);
};

const generateServiceId = async (phoneNumber) => {
  const datePart = formatDatePart();
  const phonePart = sanitizePhoneForId(phoneNumber);
  const nextSequence = await getNextDailySequence(datePart);
  return `SERVICE_${datePart}_${phonePart}_${nextSequence}`;
};

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

    // Send email to admin
    try {
      await sendContactFormEmail({
        name: fullName,
        email: email,
        phone: phone,
        subject: "Website Inquiry",
        message: message,
      });
    } catch (emailError) {
      console.error("Failed to send contact form email:", emailError);
      // Don't fail the request if email fails, just log it
    }

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
    const categories = await Category.find({ isActive: true }).sort({ headerOrder: 1, name: 1 });
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
    const { fullName, email, phoneNumber, interestedService, selectedPackage, state } = req.body;

    if (!fullName || !email || !phoneNumber || !interestedService || !selectedPackage || !state) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // Get the first admin user (superAdmin or admin)
    const admin = await User.findOne({
      role: { $in: ["superAdmin", "admin"] }
    });

    if (!admin) {
      const error = new Error("No admin found to assign lead");
      error.statusCode = 500;
      return next(error);
    }

    let newLead = null;
    let serviceId = "";

    // Retry on duplicate ID collisions caused by concurrent requests.
    for (let attempt = 0; attempt < 5; attempt += 1) {
      serviceId = await generateServiceId(phoneNumber);

      try {
        newLead = await Leads.create({
          serviceID: serviceId,
          clientName: fullName,
          clientEmail: email,
          clientPhone: phoneNumber,
          interestedService,
          selectedPackage,
          state,
          assignedTo: admin._id,
          closeRemarks: "",
          leadStages: [
            {
              stageName: "new",
              updatedby: admin._id,
              updatedAt: new Date(),
            },
          ],
        });
        break;
      } catch (createError) {
        if (createError?.code !== 11000) {
          throw createError;
        }
      }
    }

    if (!newLead) {
      const error = new Error("Unable to generate a unique service ID. Please try again.");
      error.statusCode = 503;
      return next(error);
    }

    // Send lead creation confirmation email to client
    try {
      await sendLeadCreationEmail({
        clientName: fullName,
        clientEmail: email,
        serviceName: interestedService,
        serviceId,
        createdDate: new Date(),
      });
    } catch (emailError) {
      console.error("Failed to send lead creation email:", emailError);
      // Don't fail the request if email fails, just log it
    }

    res.status(201).json({
      message: "Service request created successfully",
      serviceId,
      data: newLead,
    });
  } catch (error) {
    next(error);
  }
};
export const TrackService = async (req, res, next) => {
  try {
    const serviceId = req.params.serviceId || req.params.leadId;

    if (!serviceId) {
      const error = new Error("Service ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const lead = await Leads.findOne({
      $or: [{ serviceID: serviceId }, { leadID: serviceId }],
    })
      .select("serviceID leadID clientName clientEmail clientPhone interestedService state leadStages")
      .populate("leadStages.updatedby", "fullName role");

    if (!lead) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    // Map stages to stage names for display
    const stages = lead.leadStages.map((stage) => ({
      stageName: stage.stageName,
      updatedAt: stage.updatedAt,
      updatedby: stage.updatedby?.fullName || "System",
    }));

    res.status(200).json({
      message: "Service tracking information fetched successfully",
      data: {
        serviceId: lead.serviceID || lead.leadID,
        leadId: lead.leadID || lead.serviceID,
        clientName: lead.clientName,
        clientEmail: lead.clientEmail,
        clientPhone: lead.clientPhone,
        interestedService: lead.interestedService,
        state: lead.state,
        stages: stages,
        currentStage: stages.length > 0 ? stages[stages.length - 1].stageName : "new",
      },
    });
  } catch (error) {
    next(error);
  }
};

export const PostFeedback = async (req, res, next) => {
  try {
    const { fullName, email, serviceAvailedId, message, starRating } = req.body;

    if (!fullName || !email || !serviceAvailedId || !message || !starRating) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    // Verify that the service exists
    const service = await Service.findById(serviceAvailedId);
    
    if (!service) {
      const error = new Error("Invalid service selected");
      error.statusCode = 400;
      return next(error);
    }

    const newFeedback = await Feedback.create({
      fullName,
      email,
      serviceAvailed: serviceAvailedId,
      message,
      starRating,
      status: "pending",
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
    const feedbacks = await Feedback.find({ 
      starRating: { $gte: 4 },
      status: "approved"
    })
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
    const services = await Service.find({ isActive: true, isVisible: true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("serviceName category subCategory sequence")
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
      isActive: true,
      isVisible: true,
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
      .populate("subCategory", "name")
      .select("serviceName OneLinner priceTag shortDescription topPointers description faqs isActive isVisible Featured packages offer documents category subCategory createdAt updatedAt");
    
    if (!service) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    if (!service.isActive || !service.isVisible) {
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

export const getRelatedServices = async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    
    if (!serviceId) {
      const error = new Error("Service ID is required");
      error.statusCode = 400;
      return next(error);
    }

    // Get the current service to retrieve its category
    const currentService = await Service.findById(serviceId).populate("category");
    
    if (!currentService) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    const categoryId = currentService.category?._id;
    
    if (!categoryId) {
      // If no category, return empty array
      return res.status(200).json({
        message: "Related services fetched successfully",
        data: [],
      });
    }

    // Fetch other active services in the same category (excluding current service)
    const relatedServices = await Service.find({
      category: categoryId,
      _id: { $ne: serviceId }, // Exclude current service
      isActive: true,
      isVisible: true,
    })
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("_id serviceName shortDescription offer priceTag")
      .limit(6);

    res.status(200).json({
      message: "Related services fetched successfully",
      data: relatedServices,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isActive: true, isVisible: true, "Featured.isFeatured": true })
      .populate("category", "name")
      .populate("subCategory", "name")
      .select("serviceName shortDescription category subCategory Featured offer")
      .sort({ "Featured.featureOrder": 1, serviceName: 1 });
    
    res.status(200).json({
      message: "Featured services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllSubCategoriesGrouped = async (req, res, next) => {
  try {
    // Fetch all subcategories with their category info
    const subCategories = await SubCategory.find({ isActive: true })
      .populate("category", "_id name")
      .select("_id name category sequence")
      .sort({ name: 1 });
    
    // Group by category ID
    const groupedData = {};
    subCategories.forEach((subCat) => {
      const categoryId = subCat.category?._id.toString();
      if (categoryId) {
        if (!groupedData[categoryId]) {
          groupedData[categoryId] = [];
        }
        groupedData[categoryId].push(subCat);
      }
    });

    res.status(200).json({
      message: "All subcategories fetched successfully",
      data: groupedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllServicesGrouped = async (req, res, next) => {
  try {
    // Fetch all active services with subcategory info
    const services = await Service.find({ isActive: true, isVisible: true })
      .populate("subCategory", "_id")
      .select("_id serviceName shortDescription subCategory sequence")
      .sort({ serviceName: 1 });
    
    // Group by subcategory ID
    const groupedData = {};
    services.forEach((service) => {
      const subCatId = service.subCategory?._id.toString();
      if (subCatId) {
        if (!groupedData[subCatId]) {
          groupedData[subCatId] = [];
        }
        groupedData[subCatId].push(service);
      }
    });

    res.status(200).json({
      message: "All services fetched successfully",
      data: groupedData,
    });
  } catch (error) {
    next(error);
  }
};

export const getVisitorCount = async (req, res, next) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 0 });
    }
    res.status(200).json({
      message: "Visitor count fetched successfully",
      count: visitor.count,
    });
  } catch (error) {
    next(error);
  }
};

export const incrementVisitorCount = async (req, res, next) => {
  try {
    let visitor = await Visitor.findOne();
    if (!visitor) {
      visitor = await Visitor.create({ count: 1 });
    } else {
      visitor.count += 1;
      await visitor.save();
    }
    res.status(200).json({
      message: "Visitor count incremented successfully",
      count: visitor.count,
    });
  } catch (error) {
    next(error);
  }
};

// Career Application
export const applyForJob = async (req, res) => {
  try {
    const { fullName, mobile, designation } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "Resume file is required" });
    }

    const newApplication = new Career({
      fullName,
      mobile,
      designation,
      resume: req.file.filename,
    });

    await newApplication.save();

    res.status(201).json({
      success: true,
      message: "Application submitted successfully!",
      data: newApplication,
    });
  } catch (error) {
    console.error("Career Application Error:", error);
    res.status(500).json({ success: false, message: "Error submitting application" });
  }
};