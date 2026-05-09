import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import CategoryModal from "./Modals/CategoryModal";
import SubCategoryModal from "./Modals/SubCategoryModal";

const Categories = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    try {
      setLoading(true);
      await Promise.all([fetchCategories(), fetchSubCategories()]);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/services/categories-list");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error("fetchCategories", err);
      toast.error("Failed to load categories");
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("/services/subcategories-list");
      setSubCategories(res.data.data || []);
    } catch (err) {
      console.error("fetchSubCategories", err);
      toast.error("Failed to load sub-categories");
    }
  };

  // Category handlers
  const handleSaveCategory = (saved) => {
    if (editingCategory) {
      setCategories((prev) =>
        prev.map((c) => (c._id === saved._id ? saved : c))
      );
    } else {
      setCategories((prev) => [...prev, saved]);
    }
    setEditingCategory(null);
  };

  const handleEditCategory = (cat) => {
    setEditingCategory(cat);
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this category? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/services/categories/${id}`);
          setCategories((prev) => prev.filter((c) => c._id !== id));
          toast.success("Category deleted successfully!");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete category"
          );
          console.error(err);
        }
      },
      () => {
        // Cancelled
      }
    );
  };

  // Sub-category handlers
  const handleSaveSubCategory = (saved) => {
    if (editingSubCategory) {
      setSubCategories((prev) =>
        prev.map((s) => (s._id === saved._id ? saved : s))
      );
    } else {
      setSubCategories((prev) => [...prev, saved]);
    }
    setEditingSubCategory(null);
  };

  const handleEditSubCategory = (sc) => {
    setEditingSubCategory(sc);
    setIsSubCategoryModalOpen(true);
  };

  const handleDeleteSubCategory = async (id) => {
    confirmDialog(
      "Are you sure you want to delete this sub-category? This action cannot be undone.",
      async () => {
        try {
          await axios.delete(`/services/subcategories/${id}`);
          setSubCategories((prev) => prev.filter((s) => s._id !== id));
          toast.success("Sub-category deleted successfully!");
        } catch (err) {
          toast.error(
            err.response?.data?.message || "Failed to delete sub-category"
          );
          console.error(err);
        }
      },
      () => {
        // Cancelled
      }
    );
  };

  const getFilteredSubCategories = (categoryId) => {
    if (!categoryId || categoryId === "all") return subCategories;
    return subCategories.filter((sc) => sc.category?._id === categoryId);
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Category Management
        </h1>
        <p className="text-gray-600 mt-1">
          Manage Categories and Sub-Categories
        </p>
      </div>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        <button
          onClick={() => setActiveTab("categories")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "categories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`px-6 py-3 font-semibold transition-all ${
            activeTab === "subcategories"
              ? "border-b-2 border-blue-600 text-blue-600"
              : "text-gray-600 hover:text-gray-800"
          }`}
        >
          Sub-Categories ({subCategories.length})
        </button>
      </div>

      {activeTab === "categories" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
            <button
              onClick={() => {
                setEditingCategory(null);
                setIsCategoryModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
            >
              <MdAdd className="w-5 h-5" /> Add Category
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-auto border border-gray-200">
            <table className="w-full table-auto border-collapse text-sm">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Header Order
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Created
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="border border-gray-200 p-6 text-center text-gray-500"
                    >
                      No categories found
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr key={cat._id} className="hover:bg-blue-50/40">
                      <td className="border border-gray-200 px-4 py-3 align-top font-medium text-gray-900">
                        {cat.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {cat.shortDescription || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {cat.headerOrder <= 5 ? (
                          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                            {cat.headerOrder} (Main)
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                            {cat.headerOrder} (Other)
                          </span>
                        )}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            cat.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {cat.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {new Date(cat.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        <button
                          onClick={() => handleEditCategory(cat)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <MdEdit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(cat._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <MdDelete className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "subcategories" && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Sub-Categories</h2>
            <button
              onClick={() => {
                setEditingSubCategory(null);
                setIsSubCategoryModalOpen(true);
              }}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium shadow-lg"
            >
              <MdAdd className="w-5 h-5" /> Add Sub-Category
            </button>
          </div>

          <div className="bg-white rounded shadow overflow-auto border border-gray-200">
            <table className="w-full table-auto border-collapse text-sm">
              <thead className="bg-gray-100 text-left text-gray-700">
                <tr>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Name
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Parent Category
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Description
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Sequence
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Status
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Created
                  </th>
                  <th className="border border-gray-200 px-4 py-3 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-700">
                {subCategories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="border border-gray-200 p-6 text-center text-gray-500"
                    >
                      No sub-categories found
                    </td>
                  </tr>
                ) : (
                  subCategories.map((sc) => (
                    <tr key={sc._id} className="hover:bg-blue-50/40">
                      <td className="border border-gray-200 px-4 py-3 align-top font-medium text-gray-900">
                        {sc.name}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                          {sc.category?.name}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {sc.shortDescription || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {sc.sequence || "-"}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            sc.isActive
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {sc.isActive ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        {new Date(sc.createdAt).toLocaleDateString()}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 align-top">
                        <button
                          onClick={() => handleEditSubCategory(sc)}
                          className="text-blue-600 hover:text-blue-900 mr-3"
                        >
                          <MdEdit className="w-5 h-5 inline" />
                        </button>
                        <button
                          onClick={() => handleDeleteSubCategory(sc._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <MdDelete className="w-5 h-5 inline" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => {
          setIsCategoryModalOpen(false);
          setEditingCategory(null);
        }}
        onSave={handleSaveCategory}
        editingCategory={editingCategory}
      />
      <SubCategoryModal
        isOpen={isSubCategoryModalOpen}
        onClose={() => {
          setIsSubCategoryModalOpen(false);
          setEditingSubCategory(null);
        }}
        onSave={handleSaveSubCategory}
        editingSubCategory={editingSubCategory}
      />
    </div>
  );
};

export default Categories;
