import React, { useEffect, useMemo, useState } from "react";
import { MdAdd, MdEdit, MdSearch, MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "../../config/api";
import CreateBlog from "../../pages/CreateBlog";

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [mode, setMode] = useState("list");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/admin/blogs");
      setBlogs(res.data.data || []);
    } catch (error) {
      console.error("fetchBlogs", error);
      toast.error(error.response?.data?.message || "Failed to load blogs");
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    const q = searchTerm.trim().toLowerCase();
    if (!q) return blogs;

    return blogs.filter((blog) =>
      [blog.title, blog.author, blog.category, blog.summary]
        .some((value) => (value || "").toLowerCase().includes(q))
    );
  }, [blogs, searchTerm]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";

    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleCreate = () => {
    setSelectedBlog(null);
    setMode("create");
  };

  const handleEdit = (blog) => {
    setSelectedBlog(blog);
    setMode("edit");
  };

  const handleVisibilityToggle = async (blog) => {
    const nextVisibility = !blog.isPublished;

    try {
      const res = await axios.patch(`/admin/blogs/${blog._id}/visibility`, {
        isPublished: nextVisibility,
      });
      const updatedBlog = res.data.data;

      setBlogs((prev) =>
        prev.map((item) => (item._id === blog._id ? updatedBlog : item))
      );
      toast.success(nextVisibility ? "Blog is visible" : "Blog is hidden");
    } catch (error) {
      console.error("toggleBlogVisibility", error);
      toast.error(error.response?.data?.message || "Failed to update blog visibility");
    }
  };

  const handleFormSuccess = () => {
    setSelectedBlog(null);
    setMode("list");
    fetchBlogs();
  };

  const handleCancelForm = () => {
    setSelectedBlog(null);
    setMode("list");
  };

  if (mode === "create") {
    return (
      <CreateBlog
        key="create-blog"
        isAdminEmbedded
        onCancel={handleCancelForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  if (mode === "edit") {
    return (
      <CreateBlog
        key={selectedBlog?._id || "edit-blog"}
        blog={selectedBlog}
        isAdminEmbedded
        onCancel={handleCancelForm}
        onSuccess={handleFormSuccess}
      />
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Blogs</h1>
          <p className="mt-1 text-sm text-gray-500">
            View, edit, and control which blog posts are visible.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative">
            <MdSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search blogs..."
              className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-blue-500 sm:w-64"
            />
          </div>

          <button
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-(--primary) px-4 py-2 text-sm font-semibold text-white hover:bg-(--primary-hover)"
          >
            <MdAdd className="h-5 w-5" />
            Create Blog
          </button>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Loading blogs...</div>
        ) : filteredBlogs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {blogs.length === 0 ? "No blogs found." : "No blogs match your search."}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3">Title</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Author</th>
                  <th className="px-4 py-3">Visibility</th>
                  <th className="px-4 py-3">Created</th>
                  <th className="px-4 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 align-top">
                      <div className="font-medium text-gray-900">{blog.title}</div>
                      {blog.summary && (
                        <p className="mt-1 max-w-xl text-xs text-gray-500 line-clamp-2">
                          {blog.summary}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600">
                      {blog.category || "-"}
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600">
                      {blog.author || "-"}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <button
                        onClick={() => handleVisibilityToggle(blog)}
                        className={`inline-flex min-w-24 items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                          blog.isPublished
                            ? "bg-green-100 text-green-700 hover:bg-green-200"
                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                        }`}
                        title={blog.isPublished ? "Hide Blog" : "Show Blog"}
                      >
                        {blog.isPublished ? (
                          <MdVisibility className="h-4 w-4" />
                        ) : (
                          <MdVisibilityOff className="h-4 w-4" />
                        )}
                        {blog.isPublished ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-3 align-top text-gray-600">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-4 py-3 align-top">
                      <div className="flex items-center gap-3">
                        {blog.slug && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-gray-500 hover:text-gray-800"
                            title="View Blog"
                          >
                            <MdVisibility size={20} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(blog)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Edit Blog"
                        >
                          <MdEdit size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {!loading && filteredBlogs.length > 0 && (
        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredBlogs.length} of {blogs.length} blogs
        </div>
      )}
    </div>
  );
};

export default BlogManage;
