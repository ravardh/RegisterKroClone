import express from "express";
import {
  createBlog,
  getAdminBlogs,
  updateBlog,
  updateBlogVisibility,
} from "../controllers/blogController.js";
import { bloggerProtect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Apply blogger protection to all routes (bloger, admin, superAdmin)
router.use(bloggerProtect);

// Blog routes for blogger dashboard
router.get("/blogs", getAdminBlogs);
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.patch("/blogs/:id/visibility", updateBlogVisibility);

export default router;
