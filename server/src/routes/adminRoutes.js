import express from "express";
import {
  getAllLeads,
  getRm,
  createRm,
  deleteRm,
  updateRm,
  getAllServices,
  getCategories,
  getSubCategories,
  createService,
  updateService,
  deleteService,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/leads", getAllLeads);
router.get("/rm", getRm);
router.post("/create-rm", createRm);
router.delete("/delete-rm/:id", deleteRm);
router.put("/update-rm/:id", updateRm);

// Service routes
router.get("/services", getAllServices);
router.get("/categories", getCategories);
router.get("/subcategories", getSubCategories);
router.post("/services", createService);
router.put("/services/:id", updateService);
router.delete("/services/:id", deleteService);

// Category CRUD routes
router.get("/categories-list", getAllCategories);
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

// SubCategory CRUD routes
router.get("/subcategories-list", getAllSubCategories);
router.post("/subcategories", createSubCategory);
router.put("/subcategories/:id", updateSubCategory);
router.delete("/subcategories/:id", deleteSubCategory);

export default router;
