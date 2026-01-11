import Contact from "../models/contactModel.js";
import Service from "../models/ServiceModel.js";
import Feedback from "../models/feedbackModel.js";

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
export const LeadCapture = (req, res) => {
  res.send("Lead Capture endpoint");
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
      .select("serviceName")
      .sort({ serviceName: 1 });
    
    res.status(200).json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};
