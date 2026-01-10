import express from "express";
import { AssignedLeads, UpdateLeadStatus } from "../controllers/rmController.js";
import { rmProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply RM protection to all routes
router.use(rmProtect);

router.get("/leads", AssignedLeads);
router.post("/update-status", UpdateLeadStatus);

export default router;
