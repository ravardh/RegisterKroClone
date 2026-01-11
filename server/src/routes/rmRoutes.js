import express from "express";
import { AssignedLeads, UpdateLeadStage, UpdateLeadStatus } from "../controllers/rmController.js";
import { rmProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply RM protection to all routes
router.use(rmProtect);

router.get("/leads", AssignedLeads);
router.put("/update-stage/:leadId", UpdateLeadStage);
router.put("/update-status/:leadId", UpdateLeadStatus);

export default router;
