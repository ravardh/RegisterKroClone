import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSave } from "react-icons/md";
import toast from "react-hot-toast";
import SEOHelmet from "../components/SEOHelmet";

const CreateBlog = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    author: "",
    summary: "",
    content: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      toast.error("Blog title is required");
      return;
    }

    if (!formData.author.trim()) {
      toast.error("Author name is required");
      return;
    }

    if (!formData.content.trim() || formData.content.trim().length < 20) {
      toast.error("Blog content must be at least 20 characters");
      return;
    }

    const savedPosts = JSON.parse(localStorage.getItem("blogPosts") || "[]");
    const newPost = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
    };

    localStorage.setItem("blogPosts", JSON.stringify([newPost, ...savedPosts]));
    toast.success("Blog created successfully");
    navigate("/blog");
  };

  return (
    <>
      <SEOHelmet
        title="Create Blog - TaxProSolution"
        description="Create a new blog post for TaxProSolution."
        keywords="create blog, blog post, admin blog"
        canonicalUrl="https://taxprosolution.co.in/create-blog"
      />

      <section className="bg-gray-50 px-4 py-10">
        <div className="mx-auto max-w-4xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Create Blog</h1>
            <p className="mt-2 text-sm text-gray-500">
              Add a new article for business, tax, and compliance updates.
            </p>
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
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows="12"
                className="w-full rounded-lg border border-gray-300 px-4 py-2 leading-7 outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write blog content here..."
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-(--primary) px-5 py-2.5 text-sm font-semibold text-white hover:bg-(--primary-hover)"
              >
                <MdSave className="h-5 w-5" /> Publish Blog
              </button>
            </div>
          </form>
        </div>
      </section>
    </>
  );
};

export default CreateBlog;
