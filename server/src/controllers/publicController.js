import Contact from "../models/contactModel.js";
import Category from "../models/categoryModel.js";

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
export const LeadCapture = (req, res) => {
  res.send("Lead Capture endpoint");
};
export const TrackService = (req, res) => {
  res.send("Track Service endpoint");
};
export const PostFeedback = (req, res) => {
  res.send("Post Feedback endpoint");
};
export const getAllFeedback = (req, res) => {
  res.send("Get All Feedback endpoint");
};
export const getFeedbackByserviceId = (req, res) => {
  res.send("Get Feedback By Service ID endpoint");
};
