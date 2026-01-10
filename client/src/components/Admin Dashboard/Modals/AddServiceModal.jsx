import React, { useState, useEffect } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import axios from "../../../config/api";

const AddServiceModal = ({
  isOpen,
  onClose,
  onAddService,
  editingService = null,
}) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    serviceName: "",
    shortDescription: "",
    topPointers: [""],
    description: "",
  });
  const [subEnabled, setSubEnabled] = useState(false);
  const [fieldsEnabled, setFieldsEnabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showNewSubCategory, setShowNewSubCategory] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      setSubEnabled(false);
      setFieldsEnabled(false);
      setShowNewSubCategory(false);
      setNewSubCategory("");
      if (editingService) {
        setFormData({
          category: editingService.category,
          subCategory: editingService.subCategory,
          serviceName: editingService.serviceName,
          shortDescription: editingService.shortDescription,
          topPointers:
            editingService.topPointers.length > 0
              ? editingService.topPointers
              : [""],
          description: editingService.description,
        });
        setSubEnabled(true);
        setFieldsEnabled(true);
      }
    }
  }, [isOpen, editingService]);

  useEffect(() => {
    if (formData.category) {
      fetchSubCategories(formData.category);
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/services/categories-list");
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (category) => {
    try {
      const res = await axios.get(
        `/services/subcategories-list?categoryId=${category}`
      );
      setSubCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, category: value, subCategory: "" }));
    setError("");
    if (value) {
      setSubEnabled(true);
      setFieldsEnabled(false);
      fetchSubCategories(value);
    } else {
      setSubEnabled(false);
      setFieldsEnabled(false);
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    if (value === "new") {
      setShowNewSubCategory(true);
      setFormData((prev) => ({ ...prev, subCategory: "" }));
      setFieldsEnabled(false);
    } else {
      setShowNewSubCategory(false);
      setNewSubCategory("");
      setFormData((prev) => ({ ...prev, subCategory: value }));
      setFieldsEnabled(!!value);
    }
    setError("");
  };

  const handlePointerChange = (index, value) => {
    const newPointers = [...formData.topPointers];
    newPointers[index] = value;
    setFormData((prev) => ({ ...prev, topPointers: newPointers }));
  };

  const addPointer = () => {
    setFormData((prev) => ({
      ...prev,
      topPointers: [...prev.topPointers, ""],
    }));
  };

  const removePointer = (index) => {
    const newPointers = formData.topPointers.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      topPointers: newPointers.length > 0 ? newPointers : [""],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const finalCategory = formData.category;
      const finalSubCategory = showNewSubCategory
        ? newSubCategory
        : formData.subCategory;

      if (!finalCategory || !finalSubCategory) {
        setError("Category and Sub-category are required");
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        category: finalCategory,
        subCategory: finalSubCategory,
        topPointers: formData.topPointers.filter((p) => p.trim() !== ""),
      };

      let res;
      if (editingService) {
        res = await axios.put(
          `/services/services/${editingService._id}`,
          submitData
        );
      } else {
        res = await axios.post("/services/services", submitData);
      }

      if (res.data.data) {
        onAddService(res.data.data);
        resetForm();
        onClose();
      }
    } catch (error) {
      console.error("Error saving service:", error);
      setError(error.response?.data?.message || "Failed to save service");
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      category: "",
      subCategory: "",
      serviceName: "",
      shortDescription: "",
      topPointers: [""],
      description: "",
    });
    setShowNewSubCategory(false);
    setNewSubCategory("");
    setError("");
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-800">
            {editingService ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-500 hover:text-gray-700 transition duration-200"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.category}
                onChange={handleCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat, index) => (
                  <option key={index} value={cat?._id || cat}>
                    {cat?.name || cat}
                  </option>
                ))}
              </select>
            </div>

            {/* SubCategory */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sub-Category <span className="text-red-500">*</span>
              </label>
              <select
                value={showNewSubCategory ? "new" : formData.subCategory}
                onChange={handleSubCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                required
                disabled={!subEnabled}
              >
                <option value="">Select Sub-Category</option>
                {subCategories.map((subCat, index) => (
                  <option key={index} value={subCat?._id || subCat}>
                    {subCat?.name || subCat}
                  </option>
                ))}
              </select>
            </div>

            {/* Service Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="serviceName"
                value={formData.serviceName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Enter service name"
                required
                disabled={!fieldsEnabled}
              />
            </div>

            {/* Short Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Description <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                placeholder="Brief description (1-2 lines)"
                required
                disabled={!fieldsEnabled}
              />
            </div>

            {/* Top Pointers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Key Features / Top Pointers
              </label>
              <div className="space-y-2">
                {formData.topPointers.map((pointer, index) => (
                  <div key={index} className="flex gap-2">
                    <input
                      type="text"
                      value={pointer}
                      onChange={(e) =>
                        handlePointerChange(index, e.target.value)
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                      placeholder={`Pointer ${index + 1}`}
                      disabled={!fieldsEnabled}
                    />
                    {formData.topPointers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePointer(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      >
                        <MdDelete className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPointer}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition text-sm"
                  disabled={!fieldsEnabled}
                >
                  <MdAdd className="w-4 h-4" /> Add Pointer
                </button>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows="6"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                placeholder="Enter detailed description of the service"
                required
                disabled={!fieldsEnabled}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-blue-300"
              disabled={loading || !fieldsEnabled}
            >
              {loading
                ? "Saving..."
                : editingService
                ? "Update Service"
                : "Create Service"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddServiceModal;
