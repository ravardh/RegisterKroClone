import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave } from "react-icons/md";
import toast from "react-hot-toast";
import SEOHelmet from "../components/SEOHelmet";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "../config/api";

const CreateBlog = ({ blog = null, isAdminEmbedded = false, apiPrefix = "/admin", onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(blog?._id);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    category: blog?.category || "",
    author: blog?.author || "",
    summary: blog?.summary || "",
    content: blog?.content || "",
  });

  const quillWrapperRef = useRef(null);
  const quillInstance = useRef(null);

  const getAbsoluteFileUrl = useCallback((url) => {
    if (!url) return "";
    if (/^https?:\/\//i.test(url)) return url;
    const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
    const filePath = url.startsWith("/") ? url : `/${url}`;
    return `${base}${filePath}`;
  }, []);

  const handleImageUpload = useCallback((editor) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (!file) return;

      const payload = new FormData();
      payload.append("image", file);
      setIsUploadingImage(true);

      try {
        const res = await axios.post("/services/upload-blog-image", payload);
        const relativeUrl = res?.data?.data?.url;
        if (!relativeUrl) {
          throw new Error("Upload did not return an image URL");
        }

        const imageUrl = getAbsoluteFileUrl(relativeUrl);
        const range = editor.getSelection(true);
        editor.insertEmbed(range.index, "image", imageUrl, "user");
        editor.setSelection(range.index + 1, 0);
        toast.success("Image uploaded");
      } catch (error) {
        console.error("Image upload failed:", error);
        toast.error(error.response?.data?.message || "Image upload failed");
      } finally {
        setIsUploadingImage(false);
      }
    };
  }, [getAbsoluteFileUrl]);

  useEffect(() => {
    const quillWrapper = quillWrapperRef.current;
    if (!quillWrapper) return;
    if (quillInstance.current) return;

    quillWrapper.innerHTML = "";
    const editorHost = document.createElement("div");
    quillWrapper.appendChild(editorHost);

    const editor = new Quill(editorHost, {
      theme: "snow",
      placeholder: "Write blog content here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ["link", "image"],
          ["clean"],
        ],
      },
    });

    if (blog?.content) {
      editor.root.innerHTML = blog.content;
    }

    const toolbar = editor.getModule("toolbar");
    toolbar.addHandler("image", () => {
      handleImageUpload(editor);
    });

    editor.on("text-change", () => {
      setFormData((prev) => ({
        ...prev,
        content: editor.root.innerHTML,
      }));
    });

    quillInstance.current = editor;

    return () => {
      quillInstance.current = null;
      quillWrapper.innerHTML = "";
    };
  }, [blog?.content, handleImageUpload]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;

    const parser = document.createElement("div");
    parser.innerHTML = formData.content || "";
    const plainTextContent = (parser.textContent || parser.innerText || "").trim();
    const title = formData.title.trim();
    const author = formData.author.trim();
    const category = formData.category.trim();
    const summary = formData.summary.trim();

    if (!title) {
      toast.error("Blog title is required");
      return;
    }

    if (!author) {
      toast.error("Author name is required");
      return;
    }

    if (!plainTextContent || plainTextContent.length < 20) {
      toast.error("Blog content must be at least 20 characters");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        title,
        author,
        category,
        summary,
        content: formData.content,
      };

      if (isEditMode) {
        await axios.put(`${apiPrefix}/blogs/${blog._id}`, payload);
      } else {
        await axios.post(`${apiPrefix}/blogs`, payload);
      }

      window.dispatchEvent(new Event("blogPostsUpdated"));
      toast.success(isEditMode ? "Blog updated successfully" : "Blog created successfully");

      if (onSuccess) {
        onSuccess();
        return;
      }

      navigate("/blog");
    } catch (error) {
      console.error("Failed to save blog:", error);
      toast.error(error.response?.data?.message || "Failed to save blog. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEOHelmet
        title="Create Blog - TaxProSolution"
        description="Create a new blog post for TaxProSolution."
        keywords="create blog, blog post, admin blog"
        canonicalUrl="https://taxprosolution.co.in/create-blog"
      />

      <section className={`bg-gray-50 px-4 ${isAdminEmbedded ? "py-6" : "py-10"}`}>
        <div className="mx-auto max-w-4xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {isEditMode ? "Edit Blog" : "Create Blog"}
              </h1>
              <p className="mt-2 text-sm text-gray-500">
                {isEditMode
                  ? "Update this article for business, tax, and compliance updates."
                  : "Add a new article for business, tax, and compliance updates."}
              </p>
            </div>
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
              >
                <MdArrowBack className="h-5 w-5" />
                Back to Blogs
              </button>
            )}
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-5 rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter blog title"
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g. Tax, Compliance"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="author"
                  value={formData.author}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Author name"
                />
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Short Summary
              </label>
              <textarea
                name="summary"
                value={formData.summary}
                onChange={handleChange}
                rows="3"
                className="w-full resize-none rounded-lg border border-gray-300 px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Short description for this blog"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content <span className="text-red-500">*</span>
              </label>
              <div className="rounded-lg border border-gray-300 overflow-hidden">
                <div ref={quillWrapperRef} style={{ minHeight: "280px" }} />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || isUploadingImage}
                className="inline-flex items-center gap-2 rounded-lg bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--primary-hover) disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MdSave className="h-5 w-5" />
                {isUploadingImage
                  ? "Uploading image..."
                  : isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Publishing..."
                  : isEditMode
                  ? "Update Blog"
                  : "Publish Blog"}
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateBlog;
