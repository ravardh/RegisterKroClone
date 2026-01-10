import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import axios from "../../../config/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";

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
    faqs: [{ question: "", answer: "" }],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const quillRef = useRef(null);
  const quillInstanceRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editingService) {
        setFormData({
          category: editingService.category?._id || editingService.category,
          subCategory:
            editingService.subCategory?._id || editingService.subCategory,
          serviceName: editingService.serviceName,
          shortDescription: editingService.shortDescription,
          topPointers: editingService.topPointers?.length
            ? editingService.topPointers
            : [""],
          faqs: editingService.faqs?.length
            ? editingService.faqs
            : [{ question: "", answer: "" }],
        });
        fetchSubCategories(
          editingService.category?._id || editingService.category
        );
      }
    }
  }, [isOpen, editingService]);

  useEffect(() => {
    // When modal closes, clean up Quill
    if (!isOpen) {
      if (quillInstanceRef.current) {
        quillInstanceRef.current.off("text-change");
        quillInstanceRef.current = null;
      }
      return;
    }

    // When modal opens and no Quill instance exists, initialize it
    if (!quillRef.current || quillInstanceRef.current) return;

    // Clear any residual Quill HTML from previous sessions
    quillRef.current.innerHTML = "";

    quillInstanceRef.current = new Quill(quillRef.current, {
      theme: "snow",
      placeholder: "Enter detailed description of the service...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["link"],
        ],
      },
    });

    quillInstanceRef.current.on("text-change", () => {
      setFormData((prev) => ({
        ...prev,
        description: quillInstanceRef.current.root.innerHTML,
      }));
    });
  }, [isOpen]);

  // Separate effect for updating content when editing service changes
  useEffect(() => {
    if (!quillInstanceRef.current) return;

    if (editingService?.description) {
      quillInstanceRef.current.root.innerHTML = editingService.description;
    } else if (isOpen && !editingService) {
      quillInstanceRef.current.root.innerHTML = "";
    }
  }, [editingService, isOpen]);

  // Effect to enable/disable Quill editor based on form state
  useEffect(() => {
    if (!quillInstanceRef.current) return;
    quillInstanceRef.current.enable(!!formData.subCategory);
  }, [formData.subCategory]);

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
      fetchSubCategories(value);
    } else {
      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, subCategory: value }));
    setError("");
  };

  const handlePointerChange = (index, value) => {
    const newPointers = [...formData.topPointers];
    newPointers[index] = value;
    setFormData((prev) => ({ ...prev, topPointers: newPointers }));
  };

  const handleFaqChange = (index, field, value) => {
    setFormData((prev) => {
      const updatedFaqs = [...prev.faqs];
      updatedFaqs[index] = { ...updatedFaqs[index], [field]: value };
      return { ...prev, faqs: updatedFaqs };
    });
  };

  const addFaq = () => {
    setFormData((prev) => ({
      ...prev,
      faqs: [...prev.faqs, { question: "", answer: "" }],
    }));
  };

  const removeFaq = (index) => {
    setFormData((prev) => {
      const updatedFaqs = prev.faqs.filter((_, i) => i !== index);
      return {
        ...prev,
        faqs:
          updatedFaqs.length > 0 ? updatedFaqs : [{ question: "", answer: "" }],
      };
    });
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
      if (!formData.category || !formData.subCategory) {
        setError("Category and Sub-category are required");
        setLoading(false);
        return;
      }

      const submitData = {
        ...formData,
        topPointers: formData.topPointers.filter((p) => p.trim()),
        faqs: formData.faqs.filter(
          (faq) => faq.question?.trim() && faq.answer?.trim()
        ),
      };

      const plainText = quillInstanceRef.current?.getText().trim();

      if (!plainText) {
        setError("Detailed description is required");
        setLoading(false);
        return;
      }

      const res = editingService
        ? await axios.put(`/services/${editingService._id}`, submitData)
        : await axios.post("/services", submitData);

      if (res.data.data) {
        onAddService(res.data.data);
        resetForm();
        onClose();
      }
    } catch (error) {
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
      faqs: [{ question: "", answer: "" }],
    });

    if (quillInstanceRef.current) {
      quillInstanceRef.current.root.innerHTML = "";
    }

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
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center z-49">
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat._id || cat} value={cat._id || cat}>
                    {cat.name || cat}
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
                value={formData.subCategory}
                onChange={handleSubCategoryChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                required
                disabled={!formData.category}
              >
                <option value="">Select Sub-Category</option>
                {subCategories.map((subCat) => (
                  <option
                    key={subCat._id || subCat}
                    value={subCat._id || subCat}
                  >
                    {subCat.name || subCat}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter service name"
                required
                disabled={!formData.subCategory}
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
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Brief description (1-2 lines)"
                required
                disabled={!formData.subCategory}
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
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder={`Pointer ${index + 1}`}
                      disabled={!formData.subCategory}
                    />
                    {formData.topPointers.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePointer(index)}
                        className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addPointer}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm"
                  disabled={!formData.subCategory}
                >
                  <MdAdd /> Add Pointer
                </button>
              </div>
            </div>

            {/* FAQs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAQs
              </label>
              <div className="space-y-3">
                {formData.faqs.map((faq, index) => (
                  <div
                    key={index}
                    className="space-y-2 border border-gray-200 rounded-lg p-4 bg-gray-50"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        FAQ {index + 1}
                      </span>
                      {formData.faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeFaq(index)}
                          disabled={!formData.subCategory}
                          className="text-red-500 hover:text-red-600 disabled:opacity-60"
                        >
                          <MdDelete />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) =>
                        handleFaqChange(index, "question", e.target.value)
                      }
                      placeholder="Question"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      disabled={!formData.subCategory}
                    />
                    <textarea
                      rows="3"
                      value={faq.answer}
                      onChange={(e) =>
                        handleFaqChange(index, "answer", e.target.value)
                      }
                      placeholder="Answer"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      disabled={!formData.subCategory}
                    />
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={addFaq}
                disabled={!formData.subCategory}
                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm mt-2"
              >
                <MdAdd /> Add FAQ
              </button>
            </div>

            {/* Description */}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Detailed Description <span className="text-red-500">*</span>
              </label>

              <div
                ref={quillRef}
                className="bg-white"
                style={{ minHeight: "180px" }}
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:bg-blue-300"
              disabled={loading || !formData.subCategory}
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
