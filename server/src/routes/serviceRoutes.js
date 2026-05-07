import express from "express";
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
  purgeOrphanedDocuments,
  uploadBlogImageFile,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getAllSubCategories,
  createSubCategory,
  updateSubCategory,
  deleteSubCategory,
} from "../controllers/serviceController.js";
import { adminProtect } from "../middleware/authMiddleware.js";
import { uploadBlogImage, uploadServiceDocuments } from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Apply admin protection to all routes
router.use(adminProtect);

// Service routes
router.get("/", getAllServices);
router.post("/", uploadServiceDocuments, createService);
router.put("/:id", uploadServiceDocuments, updateService);
router.delete("/:id", deleteService);

// Maintenance
router.delete("/maintenance/purge-orphaned-documents", purgeOrphanedDocuments);
router.post("/upload-blog-image", uploadBlogImage, uploadBlogImageFile);

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
