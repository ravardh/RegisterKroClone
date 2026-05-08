import express from "express";
import {
  getAllLeads,
  getRm,
  createRm,
  deleteRm,
  updateRm,
  getAllContacts,
  deleteContact,
  assignLeadToRM,
  getAllFeedbacks,
  approveFeedback,
  rejectFeedback,
} from "../controllers/adminController.js";
import {
  createBlog,
  getAdminBlogs,
  updateBlog,
  updateBlogVisibility,
} from "../controllers/blogController.js";
import { adminProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply admin protection to all routes
router.use(adminProtect);

router.get("/leads", getAllLeads);
router.put("/leads/:serviceId/assign", assignLeadToRM);
router.get("/rm", getRm);
router.post("/create-rm", createRm);
router.delete("/delete-rm/:id", deleteRm);
router.put("/update-rm/:id", updateRm);

// Contact routes
router.get("/contacts", getAllContacts);
router.delete("/contacts/:id", deleteContact);

// Feedback routes
router.get("/feedbacks", getAllFeedbacks);
router.patch("/feedbacks/:id/approve", approveFeedback);
router.delete("/feedbacks/:id", rejectFeedback);

// Blog routes
router.get("/blogs", getAdminBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.patch("/blogs/:id/visibility", updateBlogVisibility);

// Service routes
// service/category/subcategory routes moved to serviceRoutes

export default router;
