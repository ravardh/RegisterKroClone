import bcrypt from "bcrypt";
import User from "../models/userModel.js";
import { genUserToken } from "../config/auth.js";

export const Register = async (req, res, next) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !email || !phone || !password) {
      const error = new Error("All fields are required");
      error.statusCode = 400;
      return next(error);
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      const error = new Error("User already exists with this email");
      error.statusCode = 409;
      return next(error);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      phone,
      password: hashedPassword,
    });

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    next(error);
  }
};

export const Login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      const error = new Error("Email and password are required");
      error.statusCode = 400;
      return next(error);
    }

    const user = await User.findOne({ email });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      return next(error);
    }

    const isVerified = await bcrypt.compare(password, user.password);

    if (!isVerified) {
      const error = new Error("Invalid credentials");
      error.statusCode = 401;
      return next(error);
    }

    await genUserToken(user, res);

    res.status(200).json({ message: "Login successful", data: user });
  } catch (error) {
    next(error);
  }
};

export const Logout = (req, res, next) => {
  try {
    // Clear auth cookie to invalidate session/token
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Lax",
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    next(error);
  }
};
