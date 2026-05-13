import React, { useState, useEffect } from "react";
import { MdAdd, MdEdit, MdDelete } from "react-icons/md";
import axios from "../../config/api";
import toast from "react-hot-toast";
import { confirmDialog } from "../../utils/confirmDialog";
import CategoryModal from "./Modals/CategoryModal";
import SubCategoryModal from "./Modals/SubCategoryModal";
import { useTable } from "../../hooks/useTable";
import { SortableHeader, TablePagination, SearchBar } from "./TableComponents";
import clsx from "clsx";

const Categories = () => {
  const [activeTab, setActiveTab] = useState("categories");
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isSubCategoryModalOpen, setIsSubCategoryModalOpen] = useState(false);

  const [editingCategory, setEditingCategory] = useState(null);
  const [editingSubCategory, setEditingSubCategory] = useState(null);

  const {
    data: displayedCategories,
    totalItems: totalCategories,
    totalPages: totalCategoryPages,
    currentPage: currentCategoryPage,
    setCurrentPage: setCurrentCategoryPage,
    rowsPerPage: categoriesRowsPerPage,
    handleRowsPerPageChange: handleCategoriesRowsPerPageChange,
    searchTerm: categorySearch,
    handleSearch: handleCategorySearch,
    sortConfig: categorySort,
    requestSort: requestCategorySort,
  } = useTable(categories, ["name", "shortDescription", "headerOrder"], { key: "headerOrder", direction: "desc" });

  const {
    data: displayedSubCategories,
    totalItems: totalSubCategories,
    totalPages: totalSubCategoryPages,
    currentPage: currentSubCategoryPage,
    setCurrentPage: setCurrentSubCategoryPage,
    rowsPerPage: subCategoriesRowsPerPage,
    handleRowsPerPageChange: handleSubCategoriesRowsPerPageChange,
    searchTerm: subCategorySearch,
    handleSearch: handleSubCategorySearch,
    sortConfig: subCategorySort,
    requestSort: requestSubCategorySort,
  } = useTable(subCategories, ["name", "category.name", "shortDescription", "sequence"], { key: "category.name", direction: "asc" });

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
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "categories"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("subcategories")}
          className={`px-6 py-3 font-semibold transition-all ${activeTab === "subcategories"
            ? "border-b-2 border-blue-600 text-blue-600"
            : "text-gray-600 hover:text-gray-800"
            }`}
        >
          Sub-Categories ({subCategories.length})
        </button>
      </div>

      {activeTab === "categories" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Categories</h2>
              <p className="text-sm text-gray-500">Manage your service categories and their display order</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <SearchBar
                value={categorySearch}
                onChange={handleCategorySearch}
                placeholder="Search categories..."
              />
              <button
                onClick={() => {
                  setEditingCategory(null);
                  setIsCategoryModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
              >
                <MdAdd className="w-5 h-5" /> Add Category
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead className="bg-gray-50 text-left text-gray-700">
                  <tr>
                    <SortableHeader label="Name" sortKey="name" currentSort={categorySort} onSort={requestCategorySort} />
                    <SortableHeader label="Description" sortKey="shortDescription" currentSort={categorySort} onSort={requestCategorySort} />
                    <SortableHeader label="Header Order" sortKey="headerOrder" currentSort={categorySort} onSort={requestCategorySort} />
                    <SortableHeader label="Status" sortKey="isActive" currentSort={categorySort} onSort={requestCategorySort} />
                    <SortableHeader label="Created" sortKey="createdAt" currentSort={categorySort} onSort={requestCategorySort} />
                    <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-left text-gray-500 border-b-2 border-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-500 font-medium">Loading categories...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayedCategories.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                        {categories.length === 0 ? "No categories found. Click 'Add Category' to create one." : "No categories match your search."}
                      </td>
                    </tr>
                  ) : (
                    displayedCategories.map((cat) => (
                      <tr key={cat._id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {cat.name}
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-xs truncate">
                          {cat.shortDescription || "-"}
                        </td>
                        <td className="px-4 py-4">
                          {cat.headerOrder <= 5 ? (
                            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-bold border border-blue-100">
                              {cat.headerOrder} (Main)
                            </span>
                          ) : (
                            <span className="px-3 py-1 bg-gray-50 text-gray-600 rounded-full text-xs font-medium border border-gray-100">
                              {cat.headerOrder} (Other)
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={clsx(
                              "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border",
                              cat.isActive
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            )}
                          >
                            {cat.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-medium">
                          {new Date(cat.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditCategory(cat)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <MdEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteCategory(cat._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!loading && categories.length > 0 && (
              <TablePagination
                currentPage={currentCategoryPage}
                totalPages={totalCategoryPages}
                onPageChange={setCurrentCategoryPage}
                rowsPerPage={categoriesRowsPerPage}
                onRowsPerPageChange={handleCategoriesRowsPerPageChange}
                totalItems={totalCategories}
                showingCount={displayedCategories.length}
              />
            )}
          </div>
        </div>
      )}

      {activeTab === "subcategories" && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Sub-Categories</h2>
              <p className="text-sm text-gray-500">Manage detailed service types within each category</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <SearchBar
                value={subCategorySearch}
                onChange={handleSubCategorySearch}
                placeholder="Search sub-categories..."
              />
              <button
                onClick={() => {
                  setEditingSubCategory(null);
                  setIsSubCategoryModalOpen(true);
                }}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all font-medium shadow-md hover:shadow-lg active:scale-95"
              >
                <MdAdd className="w-5 h-5" /> Add Sub-Category
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 transition-all">
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse text-sm">
                <thead className="bg-gray-50 text-left text-gray-700">
                  <tr>
                    <SortableHeader label="Name" sortKey="name" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <SortableHeader label="Parent Category" sortKey="category.name" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <SortableHeader label="Description" sortKey="shortDescription" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <SortableHeader label="Sequence" sortKey="sequence" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <SortableHeader label="Status" sortKey="isActive" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <SortableHeader label="Created" sortKey="createdAt" currentSort={subCategorySort} onSort={requestSubCategorySort} />
                    <th className="px-4 py-4 font-bold text-xs uppercase tracking-wider text-center text-gray-500 border-b-2 border-gray-100">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700 divide-y divide-gray-100">
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center">
                        <div className="flex flex-col items-center gap-2">
                          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                          <span className="text-gray-500 font-medium">Loading sub-categories...</span>
                        </div>
                      </td>
                    </tr>
                  ) : displayedSubCategories.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-10 text-center text-gray-500 italic">
                        {subCategories.length === 0 ? "No sub-categories found. Click 'Add Sub-Category' to create one." : "No sub-categories match your search."}
                      </td>
                    </tr>
                  ) : (
                    displayedSubCategories.map((sc) => (
                      <tr key={sc._id} className="hover:bg-blue-50/50 transition-colors group">
                        <td className="px-4 py-4 font-semibold text-gray-900">
                          {sc.name}
                        </td>
                        <td className="px-4 py-4">
                          <span className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-bold border border-indigo-100">
                            {sc.category?.name}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-600 max-w-xs truncate">
                          {sc.shortDescription || "-"}
                        </td>
                        <td className="px-4 py-4 font-medium text-gray-500 text-center">
                          {sc.sequence || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={clsx(
                              "px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border",
                              sc.isActive
                                ? "bg-green-50 text-green-700 border-green-100"
                                : "bg-red-50 text-red-700 border-red-100"
                            )}
                          >
                            {sc.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-gray-500 font-medium text-center">
                          {new Date(sc.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleEditSubCategory(sc)}
                              className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                              title="Edit"
                            >
                              <MdEdit className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleDeleteSubCategory(sc._id)}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                              title="Delete"
                            >
                              <MdDelete className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
            {!loading && subCategories.length > 0 && (
              <TablePagination
                currentPage={currentSubCategoryPage}
                totalPages={totalSubCategoryPages}
                onPageChange={setCurrentSubCategoryPage}
                rowsPerPage={subCategoriesRowsPerPage}
                onRowsPerPageChange={handleSubCategoriesRowsPerPageChange}
                totalItems={totalSubCategories}
                showingCount={displayedSubCategories.length}
              />
            )}
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
