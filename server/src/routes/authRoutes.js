import express from "express";
import { Login, Register, Logout } from "../controllers/authController.js";

const router = express.Router();

// Example auth route
router.post("/login", Login);
router.post("/register", Register);
router.post("/logout", Logout);

export default router;
