import Blog from "../models/blogModel.js";

const stripHtml = (html = "") => String(html).replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

const createUniqueSlug = async (title, excludedBlogId = null) => {
  const base = slugify(title) || "blog-post";
  let slug = base;
  let count = 1;

  const slugExists = async (candidate) => {
    const query = { slug: candidate };
    if (excludedBlogId) {
      query._id = { $ne: excludedBlogId };
    }

    return Blog.exists(query);
  };

  while (await slugExists(slug)) {
    slug = `${base}-${count}`;
    count += 1;
  }

  return slug;
};

export const createBlog = async (req, res, next) => {
  try {
    const { title, category = "", subcategory = "", author, summary = "", content } = req.body;
    const plainText = stripHtml(content);

    if (!title?.trim() || !author?.trim() || !plainText || plainText.length < 20) {
      const error = new Error("Title, author and content (minimum 20 characters) are required");
      error.statusCode = 400;
      return next(error);
    }

    const slug = await createUniqueSlug(title);

    const created = await Blog.create({
      title: title.trim(),
      slug,
      category: category.trim(),
      subcategory: subcategory.trim(),
      author: author.trim(),
      summary: summary.trim(),
      content,
      createdBy: req.user._id,
      isPublished: true,
    });

    res.status(201).json({
      message: "Blog created successfully",
      data: created,
    });
  } catch (error) {
    next(error);
  }
};

export const getAdminBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find()
      .select("title slug category subcategory author summary content isPublished createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, category = "", subcategory = "", author, summary = "", content } = req.body;
    const plainText = stripHtml(content);

    if (!title?.trim() || !author?.trim() || !plainText || plainText.length < 20) {
      const error = new Error("Title, author and content (minimum 20 characters) are required");
      error.statusCode = 400;
      return next(error);
    }

    const blog = await Blog.findById(id);

    if (!blog) {
      const error = new Error("Blog not found");
      error.statusCode = 404;
      return next(error);
    }

    blog.title = title.trim();
    blog.slug = await createUniqueSlug(title, blog._id);
    blog.category = category.trim();
    blog.subcategory = subcategory.trim();
    blog.author = author.trim();
    blog.summary = summary.trim();
    blog.content = content;
    if (typeof req.body.isPublished === "boolean") {
      blog.isPublished = req.body.isPublished;
    }

    const updated = await blog.save();

    res.status(200).json({
      message: "Blog updated successfully",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlogVisibility = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { isPublished } = req.body;

    if (typeof isPublished !== "boolean") {
      const error = new Error("Blog visibility must be true or false");
      error.statusCode = 400;
      return next(error);
    }

    const updated = await Blog.findByIdAndUpdate(
      id,
      { isPublished },
      { new: true, runValidators: true },
    ).select("title slug category subcategory author summary content isPublished createdAt updatedAt");

    if (!updated) {
      const error = new Error("Blog not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: isPublished ? "Blog is now visible" : "Blog is now hidden",
      data: updated,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedBlogs = async (req, res, next) => {
  try {
    const blogs = await Blog.find({ isPublished: true })
      .select("title slug category subcategory author summary content createdAt updatedAt")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Blogs fetched successfully",
      data: blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getPublishedBlogBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;

    if (!slug) {
      const error = new Error("Blog slug is required");
      error.statusCode = 400;
      return next(error);
    }

    const blog = await Blog.findOne({ slug, isPublished: true }).select(
      "title slug category subcategory author summary content createdAt updatedAt",
    );

    if (!blog) {
      const error = new Error("Blog not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Blog fetched successfully",
      data: blog,
    });
  } catch (error) {
    next(error);
  }
};
