import express from "express";
import {
  getAllLeads,
  getRm,
  createRm,
  deleteRm,
  updateRm,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/leads", getAllLeads);
router.get("/rm", getRm);
router.post("/create-rm", createRm);
router.delete("/delete-rm/:id", deleteRm);
router.put("/update-rm/:id", updateRm);

export default router;
