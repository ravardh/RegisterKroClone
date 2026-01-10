import express from "express";
import { getAllLeads, getRm, createRm, deleteRm, updateRm } from "../controllers/adminController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply admin protection to all routes
router.use(adminProtect);

router.get("/leads", getAllLeads);
router.get("/rm", getRm);
router.post("/create-rm", createRm);
router.delete("/delete-rm/:id", deleteRm);
router.put("/update-rm/:id", updateRm);

// Service routes
// service/category/subcategory routes moved to serviceRoutes

export default router;
