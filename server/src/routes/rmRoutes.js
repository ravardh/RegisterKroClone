import express from "express";
import { AssignedLeads, UpdateLeadStatus } from "../controllers/rmController.js";

const router = express.Router();

router.get("/leads", AssignedLeads);
router.post("/update-status", UpdateLeadStatus);

export default router;
