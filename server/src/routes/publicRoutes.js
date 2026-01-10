import express from "express";
import {
  ContactUs,
  LeadCapture,
  TrackService,
  PostFeedback,
  getAllFeedback,
  getFeedbackByserviceId,
} from "../controllers/publicController.js";

const router = express.Router();

router.post("/contact", ContactUs);
router.post("/lead", LeadCapture);
router.get("/track", TrackService);
router.post("/feedback", PostFeedback);
router.get("/feedback", getAllFeedback);
router.get("/feedback/:id", getFeedbackByserviceId);

export default router;
