import fs from "fs";
import path from "path";
import multer from "multer";

const uploadDir = path.join(process.cwd(), "uploads", "service-documents");
const blogImagesDir = path.join(process.cwd(), "uploads", "blog-images");
const teamImagesDir = path.join(process.cwd(), "uploads", "team-images");
const resumesDir = path.join(process.cwd(), "uploads", "resumes");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
if (!fs.existsSync(blogImagesDir)) {
  fs.mkdirSync(blogImagesDir, { recursive: true });
}
if (!fs.existsSync(teamImagesDir)) {
  fs.mkdirSync(teamImagesDir, { recursive: true });
}
if (!fs.existsSync(resumesDir)) {
  fs.mkdirSync(resumesDir, { recursive: true });
}

const allowedExtensions = new Set([
  ".pdf",
  ".xls",
  ".xlsx",
  ".ppt",
  ".pptx",
  ".doc",
  ".docx",
  ".txt",
  ".csv",
]);

const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `${Date.now()}-${base || "document"}${ext}`);
  },
});

const fileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedExtensions.has(ext)) {
    return cb(new Error("Unsupported file type. Allowed: PDF, XLS, XLSX, PPT, PPTX, DOC, DOCX, TXT, CSV"));
  }
  cb(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 10,
  },
});

export const uploadServiceDocuments = upload.array("documents", 10);

const imageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, blogImagesDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `${Date.now()}-${base || "blog-image"}${ext}`);
  },
});

const allowedImageExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

const imageFileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedImageExtensions.has(ext)) {
    return cb(new Error("Unsupported image type. Allowed: JPG, JPEG, PNG, WEBP, GIF"));
  }
  cb(null, true);
};

const imageUpload = multer({
  storage: imageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadBlogImage = imageUpload.single("image");

const teamImageStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, teamImagesDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `${Date.now()}-${base || "team"}${ext}`);
  },
});

const teamImageUpload = multer({
  storage: teamImageStorage,
  fileFilter: imageFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadTeamImage = teamImageUpload.single("image");

const resumeStorage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, resumesDir),
  filename: (_, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const base = path.basename(file.originalname, ext).replace(/\s+/g, "-").replace(/[^a-zA-Z0-9-_]/g, "");
    cb(null, `resume-${Date.now()}-${base}${ext}`);
  },
});

const allowedResumeExtensions = new Set([".pdf", ".doc", ".docx"]);

const resumeFileFilter = (_, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (!allowedResumeExtensions.has(ext)) {
    return cb(new Error("Unsupported file type. Allowed: PDF, DOC, DOCX"));
  }
  cb(null, true);
};

const resumeUpload = multer({
  storage: resumeStorage,
  fileFilter: resumeFileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
});

export const uploadResume = resumeUpload.single("resume");
