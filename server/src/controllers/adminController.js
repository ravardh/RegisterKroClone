import User from "../models/User.js";

export const getAllLeads = (req, res) => {
  res.send("Get All Leads endpoint");
};
export const createRm = async (req, res, next) => {
  try {
    const { fullName, email, phone } = req.body;

    if (!fullName || !email || !phone) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const newRm = await User.create({
      fullName,
      email,
      phone,
      role: "rm",
    });

    res.status(201).json({
      message: "Relationship Manager created successfully"
    });
  }
  catch (error) {
    next(error)
  }
};
export const deleteRm = (req, res) => {
  res.send("Delete RM endpoint");
};
export const updateRm = (req, res) => {
  res.send("Update RM endpoint");
};
