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
  getRelatedServices,
  getFeaturedServices,
  getAllSubCategoriesGrouped,
  getAllServicesGrouped,
  getVisitorCount,
  incrementVisitorCount,
  applyForJob,
} from "../controllers/publicController.js";
import { getPublicTeamMembers } from "../controllers/teamController.js";
import { getPublicSpecialOffer } from "../controllers/offerController.js";
import { uploadResume } from "../middleware/uploadMiddleware.js";
import { getPublishedBlogBySlug, getPublishedBlogs } from "../controllers/blogController.js";

const router = express.Router();

router.post("/contact", ContactUs);
router.post("/lead", LeadCapture);
router.get("/track/:serviceId", TrackService);
router.post("/feedback", PostFeedback);
router.get("/feedback", getAllFeedback);
router.get("/team", getPublicTeamMembers);
router.get("/special-offer", getPublicSpecialOffer);
router.get("/feedback/:id", getFeedbackByserviceId);
router.get("/categories", getPublicCategories);
router.get("/subcategories-grouped", getAllSubCategoriesGrouped);
router.get("/services-grouped", getAllServicesGrouped);
router.get("/categories/:categoryId/subcategories", getPublicSubCategories);
router.get("/subcategories/:subCategoryId/services", getPublicServicesBySubCategory);
router.get("/services", getPublicServices);
router.get("/services/featured", getFeaturedServices);
router.get("/service/:serviceId", getServiceById);
router.get("/service/:serviceId/related", getRelatedServices);
router.get("/blogs", getPublishedBlogs);
router.get("/blogs/:slug", getPublishedBlogBySlug);
router.get("/visitor-count", getVisitorCount);
router.post("/visitor-count/increment", incrementVisitorCount);
router.post("/apply-career", uploadResume, applyForJob);

export default router;
