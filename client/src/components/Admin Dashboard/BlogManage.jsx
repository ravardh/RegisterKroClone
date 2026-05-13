import React, { useEffect, useState } from "react";
import { MdAdd, MdEdit, MdSearch, MdVisibility, MdVisibilityOff } from "react-icons/md";
import toast from "react-hot-toast";
import axios from "../../config/api";
import CreateBlog from "../../pages/CreateBlog";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const BlogManage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState("list");
  const [selectedBlog, setSelectedBlog] = useState(null);

  const {
    data: displayedBlogs,
    totalItems,
    totalPages,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    handleRowsPerPageChange,
    searchTerm,
    handleSearch,
    sortConfig,
    requestSort,
  } = useTable(blogs, ["title", "author", "category", "summary"], { key: "createdAt", direction: "desc" });

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
    <div className="p-6 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Blogs</h1>
          <p className="text-gray-500 mt-1">View, edit, and control which blog posts are visible</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <SearchBar 
            value={searchTerm} 
            onChange={handleSearch} 
            placeholder="Search blogs..." 
          />
          <button
            onClick={handleCreate}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
          >
            <MdAdd className="w-5 h-5" /> Create Blog
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
        <div className="overflow-x-auto">
          <table className="w-full table-auto border-collapse text-sm">
            <thead className="bg-gray-50 text-left text-gray-700">
              <tr>
                <SortableHeader label="Title" sortKey="title" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Category" sortKey="category" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Author" sortKey="author" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Visibility" sortKey="isPublished" currentSort={sortConfig} onSort={requestSort} />
                <SortableHeader label="Created" sortKey="createdAt" currentSort={sortConfig} onSort={requestSort} />
                <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
              </tr>
            </thead>
            <tbody className="text-gray-700 divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center">
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-gray-500 font-medium">Loading blogs...</span>
                    </div>
                  </td>
                </tr>
              ) : displayedBlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                    {blogs.length === 0 ? "No blogs found." : "No blogs match your search."}
                  </td>
                </tr>
              ) : (
                displayedBlogs.map((blog) => (
                  <tr key={blog._id} className="hover:bg-blue-50/50 transition-colors group">
                    <td className="px-4 py-4 font-semibold text-gray-900 border-r border-gray-50">
                      <div className="font-bold">{blog.title}</div>
                      {blog.summary && (
                        <p className="mt-1 max-w-xl text-xs text-gray-500 line-clamp-1 italic font-normal">
                          {blog.summary}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                        {blog.category || "-"}
                      </span>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-gray-600 font-medium">
                      {blog.author || "-"}
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50">
                      <button
                        onClick={() => handleVisibilityToggle(blog)}
                        className={clsx(
                          "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold transition-all border",
                          blog.isPublished
                            ? "bg-green-50 text-green-700 border-green-100 hover:bg-green-100"
                            : "bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100"
                        )}
                      >
                        {blog.isPublished ? (
                          <MdVisibility className="h-4 w-4" />
                        ) : (
                          <MdVisibilityOff className="h-4 w-4" />
                        )}
                        {blog.isPublished ? "Visible" : "Hidden"}
                      </button>
                    </td>
                    <td className="px-4 py-4 border-r border-gray-50 text-gray-500 font-medium">
                      {formatDate(blog.createdAt)}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-center gap-3">
                        {blog.slug && (
                          <a
                            href={`/blog/${blog.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                            title="View Blog"
                          >
                            <MdVisibility size={20} />
                          </a>
                        )}
                        <button
                          onClick={() => handleEdit(blog)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                          title="Edit Blog"
                        >
                          <MdEdit size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {!loading && blogs.length > 0 && (
          <TablePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleRowsPerPageChange}
            totalItems={totalItems}
            showingCount={displayedBlogs.length}
          />
        )}
      </div>
    </div>
  );
};

export default BlogManage;
