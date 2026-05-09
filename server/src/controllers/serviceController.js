import Service from "../models/ServiceModel.js";
import Category from "../models/categoryModel.js";
import SubCategory from "../models/subCategoryModel.js";
import fs from "fs";
import path from "path";

const parseMaybeJson = (value, fallback) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value !== "string") {
    return value;
  }
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
};

const parseBoolean = (value, fallback = false) => {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  return Boolean(value);
};

const mapUploadedDocuments = (files = []) =>
  files.map((file) => ({
    displayName: file.originalname,
    filename: file.filename,
    url: `/uploads/service-documents/${file.filename}`,
  }));

const sanitizeFaqs = (faqs) => {
  if (!Array.isArray(faqs)) {
    return [];
  }

  return faqs
    .map((faq) => ({
      question: faq.question?.trim(),
      answer: faq.answer?.trim(),
    }))
    .filter((faq) => faq.question && faq.answer);
};

// Service Management
export const getAllServices = async (req, res, next) => {
  try {
    const services = await Service.find()
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("lastEditedBy", "fullName email");
    res.status(200).json({
      message: "Services fetched successfully",
      data: services,
    });
  } catch (error) {
    next(error);
  }
};

export const createService = async (req, res, next) => {
  try {
    const { category, subCategory, serviceName, OneLinner, priceTag, shortDescription, offer, sequence } = req.body;
    const topPointers = parseMaybeJson(req.body.topPointers, []);
    const description = parseMaybeJson(req.body.description, []);
    const faqs = parseMaybeJson(req.body.faqs, []);
    const packages = parseMaybeJson(req.body.packages, []);
    const Featured = parseMaybeJson(req.body.Featured, { isFeatured: false });
    const isActive = parseBoolean(req.body.isActive, true);
    const isVisible = parseBoolean(req.body.isVisible, true);
    const uploadedDocuments = mapUploadedDocuments(req.files);

    if (
      !category ||
      !subCategory ||
      !serviceName ||
      !OneLinner ||
      !priceTag ||
      !shortDescription ||
      !description ||
      !Array.isArray(description) ||
      description.length === 0
    ) {
      const error = new Error("All required fields must be provided");
      error.statusCode = 400;
      return next(error);
    }

    // Validate Featured structure if isFeatured is true
    if (Featured?.isFeatured && !Featured?.featureOrder) {
      const error = new Error("featureOrder is required when service is featured");
      error.statusCode = 400;
      return next(error);
    }

    const existingService = await Service.findOne({ serviceName });
    if (existingService) {
      const error = new Error("Service with this name already exists");
      error.statusCode = 400;
      return next(error);
    }

    const categoryDoc = await Category.findById(category);
    if (!categoryDoc) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    const subCategoryDoc = await SubCategory.findById(subCategory);
    if (!subCategoryDoc) {
      const error = new Error("Sub-category not found");
      error.statusCode = 404;
      return next(error);
    }

    const sanitizedFaqs = sanitizeFaqs(faqs);

    const newService = await Service.create({
      category: categoryDoc._id,
      subCategory: subCategoryDoc._id,
      serviceName,
      OneLinner,
      priceTag,
      shortDescription,
      topPointers: topPointers || [],
      description,
      faqs: sanitizedFaqs,
      packages: packages || [],
      isActive,
      isVisible,
      Featured: Featured || { isFeatured: false },
      offer: offer || null,
      documents: uploadedDocuments,
      sequence: sequence || null,
      lastEditedBy: req.user._id,
    });

    const populatedService = await Service.findById(newService._id)
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("lastEditedBy", "fullName email");

    res.status(201).json({
      message: "Service created successfully",
      data: populatedService,
    });
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { category, subCategory, serviceName, OneLinner, priceTag, shortDescription, offer, sequence } = req.body;
    const topPointers = parseMaybeJson(req.body.topPointers, undefined);
    const description = parseMaybeJson(req.body.description, undefined);
    const faqs = parseMaybeJson(req.body.faqs, undefined);
    const packages = parseMaybeJson(req.body.packages, undefined);
    const Featured = parseMaybeJson(req.body.Featured, undefined);
    const documents = parseMaybeJson(req.body.documents, undefined);
    const hasIsActive = req.body.isActive !== undefined;
    const hasIsVisible = req.body.isVisible !== undefined;
    const uploadedDocuments = mapUploadedDocuments(req.files);

    if (!id) {
      const error = new Error("Service ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingService = await Service.findById(id);
    if (!existingService) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if serviceName is being changed and if it's already taken
    if (serviceName && serviceName !== existingService.serviceName) {
      const duplicateService = await Service.findOne({ serviceName });
      if (duplicateService) {
        const error = new Error("Service with this name already exists");
        error.statusCode = 400;
        return next(error);
      }
    }

    // Validate packages limit
    if (Array.isArray(packages) && packages.length > 3) {
      const error = new Error("Maximum 3 packages allowed per service");
      error.statusCode = 400;
      return next(error);
    }

    // Validate Featured structure if isFeatured is true
    if (Featured?.isFeatured && !Featured?.featureOrder) {
      const error = new Error("featureOrder is required when service is featured");
      error.statusCode = 400;
      return next(error);
    }

    const sanitizedFaqs = faqs !== undefined ? sanitizeFaqs(faqs) : existingService.faqs;
    const parsedIsActive = parseBoolean(req.body.isActive, existingService.isActive);
    const parsedIsVisible = parseBoolean(req.body.isVisible, existingService.isVisible);
    const finalDocuments = documents !== undefined
      ? [...documents, ...uploadedDocuments]
      : [...(existingService.documents || []), ...uploadedDocuments];

    const updatedService = await Service.findByIdAndUpdate(
      id,
      {
        category: category || existingService.category,
        subCategory: subCategory || existingService.subCategory,
        serviceName: serviceName || existingService.serviceName,
        OneLinner: OneLinner || existingService.OneLinner,
        priceTag: priceTag || existingService.priceTag,
        shortDescription: shortDescription || existingService.shortDescription,
        topPointers: topPointers !== undefined ? topPointers : existingService.topPointers,
        description: description !== undefined ? description : existingService.description,
        faqs: sanitizedFaqs,
        packages: packages !== undefined ? packages : existingService.packages,
        isActive: hasIsActive ? parsedIsActive : existingService.isActive,
        isVisible: hasIsVisible ? parsedIsVisible : existingService.isVisible,
        Featured: Featured || existingService.Featured,
        offer: offer !== undefined ? offer : existingService.offer,
        sequence: sequence !== undefined ? sequence : existingService.sequence,
        documents: finalDocuments,
        lastEditedBy: req.user.id,
      },
      { new: true, runValidators: true }
    )
      .populate("category", "name")
      .populate("subCategory", "name")
      .populate("lastEditedBy", "fullName email");

    res.status(200).json({
      message: "Service updated successfully",
      data: updatedService,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Service ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const deletedService = await Service.findByIdAndDelete(id);

    if (!deletedService) {
      const error = new Error("Service not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      message: "Service deleted successfully",
      data: deletedService,
    });
  } catch (error) {
    next(error);
  }
};

// Category Management
export const getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.status(200).json({
      message: "Categories fetched successfully",
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, shortDescription, headerOrder } = req.body;

    if (!name) {
      const error = new Error("Category name is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingCategory = await Category.findOne({ name });
    if (existingCategory) {
      const error = new Error("Category with this name already exists");
      error.statusCode = 400;
      return next(error);
    }

    const newCategory = await Category.create({
      name,
      shortDescription: shortDescription || "",
      headerOrder: headerOrder || '100',
      isActive: true,
    });

    res.status(201).json({
      message: "Category created successfully",
      data: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, shortDescription, isActive, headerOrder } = req.body;

    if (!id) {
      const error = new Error("Category ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingCategory = await Category.findById(id);
    if (!existingCategory) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if name is being changed and if it's already taken
    if (name && name !== existingCategory.name) {
      const duplicateCategory = await Category.findOne({ name });
      if (duplicateCategory) {
        const error = new Error("Category with this name already exists");
        error.statusCode = 400;
        return next(error);
      }
    }

    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      {
        name: name || existingCategory.name,
        shortDescription:
          shortDescription !== undefined
            ? shortDescription
            : existingCategory.shortDescription,
        headerOrder: headerOrder !== undefined ? headerOrder : existingCategory.headerOrder,
        isActive: isActive !== undefined ? isActive : existingCategory.isActive,
      },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Category updated successfully",
      data: updatedCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Category ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const category = await Category.findById(id);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if category has subcategories
    const subCategoriesCount = await SubCategory.countDocuments({
      category: id,
    });
    if (subCategoriesCount > 0) {
      const error = new Error(
        `Cannot delete category. It has ${subCategoriesCount} subcategories. Please delete them first.`
      );
      error.statusCode = 400;
      return next(error);
    }

    // Check if category has services
    const servicesCount = await Service.countDocuments({
      category: id,
    });
    if (servicesCount > 0) {
      const error = new Error(
        `Cannot delete category. It has ${servicesCount} services. Please delete or reassign them first.`
      );
      error.statusCode = 400;
      return next(error);
    }

    await Category.findByIdAndDelete(id);

    res.status(200).json({
      message: "Category deleted successfully",
      data: category,
    });
  } catch (error) {
    next(error);
  }
};

// SubCategory Management
export const getAllSubCategories = async (req, res, next) => {
  try {
    const { categoryId } = req.query;
    let query = {};

    if (categoryId) {
      query.category = categoryId;
    }

    const subCategories = await SubCategory.find(query)
      .populate("category", "name")
      .sort({ name: 1 });

    res.status(200).json({
      message: "Sub-categories fetched successfully",
      data: subCategories,
    });
  } catch (error) {
    next(error);
  }
};

export const createSubCategory = async (req, res, next) => {
  try {
    const { name, categoryId, shortDescription, sequence } = req.body;

    if (!name || !categoryId) {
      const error = new Error("Sub-category name and category are required");
      error.statusCode = 400;
      return next(error);
    }

    const category = await Category.findById(categoryId);
    if (!category) {
      const error = new Error("Category not found");
      error.statusCode = 404;
      return next(error);
    }

    const existingSubCategory = await SubCategory.findOne({
      name,
      category: categoryId,
    });
    if (existingSubCategory) {
      const error = new Error(
        "Sub-category with this name already exists in this category"
      );
      error.statusCode = 400;
      return next(error);
    }

    const newSubCategory = await SubCategory.create({
      name,
      category: categoryId,
      shortDescription: shortDescription || "",
      sequence: sequence || null,
      isActive: true,
    });

    const populatedSubCategory = await SubCategory.findById(
      newSubCategory._id
    ).populate("category", "name");

    res.status(201).json({
      message: "Sub-category created successfully",
      data: populatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const updateSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, categoryId, shortDescription, isActive, sequence } = req.body;

    if (!id) {
      const error = new Error("Sub-category ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const existingSubCategory = await SubCategory.findById(id);
    if (!existingSubCategory) {
      const error = new Error("Sub-category not found");
      error.statusCode = 404;
      return next(error);
    }

    // If category is being changed, verify it exists
    if (categoryId && categoryId !== existingSubCategory.category.toString()) {
      const category = await Category.findById(categoryId);
      if (!category) {
        const error = new Error("Category not found");
        error.statusCode = 404;
        return next(error);
      }
    }

    // Check if name is being changed and if it's already taken in the category
    if (name && name !== existingSubCategory.name) {
      const duplicateSubCategory = await SubCategory.findOne({
        name,
        category: categoryId || existingSubCategory.category,
      });
      if (duplicateSubCategory) {
        const error = new Error(
          "Sub-category with this name already exists in this category"
        );
        error.statusCode = 400;
        return next(error);
      }
    }

    const updatedSubCategory = await SubCategory.findByIdAndUpdate(
      id,
      {
        name: name || existingSubCategory.name,
        category: categoryId || existingSubCategory.category,
        shortDescription:
          shortDescription !== undefined
            ? shortDescription
            : existingSubCategory.shortDescription,
        sequence: sequence !== undefined ? sequence : existingSubCategory.sequence,
        isActive:
          isActive !== undefined ? isActive : existingSubCategory.isActive,
      },
      { new: true, runValidators: true }
    ).populate("category", "name");

    res.status(200).json({
      message: "Sub-category updated successfully",
      data: updatedSubCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteSubCategory = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id) {
      const error = new Error("Sub-category ID is required");
      error.statusCode = 400;
      return next(error);
    }

    const subCategory = await SubCategory.findById(id).populate(
      "category",
      "name"
    );
    if (!subCategory) {
      const error = new Error("Sub-category not found");
      error.statusCode = 404;
      return next(error);
    }

    // Check if any services reference this sub-category
    const servicesCount = await Service.countDocuments({
      subCategory: subCategory._id,
    });

    if (servicesCount > 0) {
      const error = new Error(
        `Cannot delete sub-category. It has ${servicesCount} services. Please delete or reassign them first.`
      );
      error.statusCode = 400;
      return next(error);
    }

    await SubCategory.findByIdAndDelete(id);

    res.status(200).json({
      message: "Sub-category deleted successfully",
      data: subCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const purgeOrphanedDocuments = async (req, res, next) => {
  try {
    const uploadsDir = path.join(process.cwd(), "uploads", "service-documents");

    // Collect all filenames referenced in the DB
    const services = await Service.find({}, "documents").lean();
    const referencedFilenames = new Set();
    for (const svc of services) {
      for (const doc of svc.documents || []) {
        if (doc.filename) referencedFilenames.add(doc.filename);
        // Fallback: derive filename from url for legacy records
        else if (doc.url) referencedFilenames.add(path.basename(doc.url));
      }
    }

    // Read the uploads directory
    let filesOnDisk = [];
    try {
      filesOnDisk = fs.readdirSync(uploadsDir);
    } catch {
      // Directory doesn't exist yet — nothing to purge
      return res.status(200).json({ message: "No uploads directory found.", deleted: [] });
    }

    const deleted = [];
    const errors = [];
    for (const filename of filesOnDisk) {
      if (!referencedFilenames.has(filename)) {
        try {
          fs.unlinkSync(path.join(uploadsDir, filename));
          deleted.push(filename);
        } catch (err) {
          errors.push({ filename, error: err.message });
        }
      }
    }

    res.status(200).json({
      message: `Purge complete. Deleted ${deleted.length} orphaned file(s).`,
      deleted,
      errors,
    });
  } catch (error) {
    next(error);
  }
};

export const uploadBlogImageFile = async (req, res, next) => {
  try {
    if (!req.file) {
      const error = new Error("Image file is required");
      error.statusCode = 400;
      return next(error);
    }

    res.status(200).json({
      message: "Blog image uploaded successfully",
      data: {
        url: `/uploads/blog-images/${req.file.filename}`,
        filename: req.file.filename,
        originalName: req.file.originalname,
      },
    });
  } catch (error) {
    next(error);
  }
};
