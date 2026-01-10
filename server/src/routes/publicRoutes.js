import express from "express";
import { ContactUs, LeadCapture, TrackService } from "../controllers/publicController.js";

const router = express.Router();

router.post("/contact", ContactUs);
router.post("/lead", LeadCapture);
router.get("/track", TrackService);

export default router;
