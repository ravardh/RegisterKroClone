import express from "express";
import {
  ContactUs,
  LeadCapture,
  TrackService,
  PostFeedback,
  getAllFeedback,
  getFeedbackByserviceId,
  getPublicCategories,
  getPublicServices,
  getPublicSubCategories,
  getPublicServicesBySubCategory,
  getServiceById,
  getFeaturedServices,
  getAllSubCategoriesGrouped,
  getAllServicesGrouped,
} from "../controllers/publicController.js";

const router = express.Router();

router.post("/contact", ContactUs);
router.post("/lead", LeadCapture);
router.get("/track/:leadId", TrackService);
router.post("/feedback", PostFeedback);
router.get("/feedback", getAllFeedback);
router.get("/feedback/:id", getFeedbackByserviceId);
router.get("/categories", getPublicCategories);
router.get("/subcategories-grouped", getAllSubCategoriesGrouped);
router.get("/services-grouped", getAllServicesGrouped);
router.get("/categories/:categoryId/subcategories", getPublicSubCategories);
router.get("/subcategories/:subCategoryId/services", getPublicServicesBySubCategory);
router.get("/services", getPublicServices);
router.get("/services/featured", getFeaturedServices);
router.get("/service/:serviceId", getServiceById);

export default router;
