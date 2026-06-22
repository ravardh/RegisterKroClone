import React, { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack, MdSave, MdKeyboardArrowDown, MdClose, MdCheck } from "react-icons/md";
import toast from "react-hot-toast";
import SEOHelmet from "../components/SEOHelmet";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import axios from "../config/api";
import { useAppData } from "../context/DataContext";

const SubcategoryDropdown = ({ value, onChange, options = [], loading = false }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o._id === value || o.name === value) || null;

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pick = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      {/* Trigger */}
      <button
        type="button"
        id="subcategory-dropdown-btn"
        disabled={loading}
        onClick={() => setOpen((p) => !p)}
        className={[
          "w-full flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-sm transition-all duration-200",
          "bg-white shadow-sm focus:outline-none",
          loading ? "opacity-60 cursor-not-allowed" : "hover:shadow-md",
          open
            ? "border-blue-500 ring-2 ring-blue-200"
            : "border-gray-200 hover:border-gray-300",
        ].join(" ")}
      >
        {loading ? (
          <span className="text-gray-400 font-normal text-sm">Loading…</span>
        ) : selected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-0.5 text-xs font-semibold text-blue-700">
            {selected.name}
          </span>
        ) : (
          <span className="text-gray-400 font-normal">Select subcategory…</span>
        )}
        <span className="flex items-center gap-1 shrink-0">
          {selected && !loading && (
            <span
              role="button"
              tabIndex={0}
              title="Clear"
              onClick={(e) => { e.stopPropagation(); pick(""); }}
              onKeyDown={(e) => e.key === "Enter" && (e.stopPropagation(), pick(""))}
              className="rounded-full p-0.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            >
              <MdClose size={14} />
            </span>
          )}
          <MdKeyboardArrowDown
            size={18}
            className={`text-gray-400 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </span>
      </button>

      {/* Floating panel */}
      <div
        className={[
          "absolute z-50 mt-1.5 w-full rounded-xl border border-gray-100 bg-white shadow-xl ring-1 ring-black/5",
          "overflow-hidden transition-all duration-200 origin-top",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none",
        ].join(" ")}
        style={{ maxHeight: "260px", overflowY: "auto" }}
      >
        {/* Clear option */}
        <button
          type="button"
          onClick={() => pick("")}
          className="w-full flex items-center gap-2 px-3.5 py-2.5 text-xs text-gray-400 hover:bg-gray-50 transition-colors border-b border-gray-100"
        >
          <MdClose size={13} />
          Clear selection
        </button>

        {options.length === 0 ? (
          <p className="px-4 py-4 text-xs text-gray-400 text-center italic">No subcategories found</p>
        ) : (
          <div className="p-2 grid grid-cols-2 gap-1.5">
            {options.map((opt) => {
              const isActive = value === opt.name;
              return (
                <button
                  key={opt._id}
                  type="button"
                  onClick={() => pick(opt.name)}
                  className={[
                    "flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs font-semibold transition-all duration-150 text-left",
                    isActive
                      ? "border-blue-200 bg-blue-50 text-blue-700 shadow-sm scale-[1.02]"
                      : "border-transparent bg-gray-50 text-gray-600 hover:bg-gray-100",
                  ].join(" ")}
                >
                  <span className="flex-1 leading-tight">{opt.name}</span>
                  {isActive && <MdCheck size={13} className="shrink-0 text-blue-600" />}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const CreateBlog = ({ blog = null, isAdminEmbedded = false, apiPrefix = "/admin", onCancel, onSuccess }) => {
  const navigate = useNavigate();
  const isEditMode = Boolean(blog?._id);
  const { subCategories: subCatMap, isDataLoaded } = useAppData();

  // Flatten the grouped {categoryId: [...subcats]} map into a deduplicated sorted list
  const subcategoryOptions = React.useMemo(() => {
    const seen = new Set();
    return Object.values(subCatMap)
      .flat()
      .filter((sc) => {
        if (seen.has(sc._id)) return false;
        seen.add(sc._id);
        return true;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [subCatMap]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    category: blog?.category || "",
    subcategory: blog?.subcategory || "",
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
    const subcategory = formData.subcategory.trim();
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
        subcategory,
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

            <div className="grid gap-4 md:grid-cols-3">
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
                  Subcategory
                </label>
                <SubcategoryDropdown
                  value={formData.subcategory}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, subcategory: val }))
                  }
                  options={subcategoryOptions}
                  loading={!isDataLoaded}
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
