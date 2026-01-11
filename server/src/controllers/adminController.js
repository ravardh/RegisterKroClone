import User from "../models/userModel.js";
import Contact from "../models/contactModel.js";
import bcrypt from "bcrypt";

export const getAllLeads = (req, res) => {
  res.send("Get All Leads endpoint");
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

