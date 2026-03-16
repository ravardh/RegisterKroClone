import React, { useState, useEffect, useRef } from "react";
import { MdClose, MdAdd, MdDelete } from "react-icons/md";
import axios from "../../../config/api";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import toast from "react-hot-toast";

const EMPTY_PACKAGE = { name: "", price: "", description: "", includedFeatures: [""], isMostPopular: false };
const EMPTY_DESCRIPTION_TAB = { tabs: "", content: "" };

const AddServiceModal = ({
  isOpen,
  onClose,
  onAddService,
  editingService = null,
}) => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [formData, setFormData] = useState({
    isVisible: true,
    category: "",
    subCategory: "",
    serviceName: "",
    OneLinner: "",
    priceTag: "0",
    shortDescription: "",
    topPointers: [""],
    description: [{ ...EMPTY_DESCRIPTION_TAB }],
    packages: [{ ...EMPTY_PACKAGE }],
    Featured: { isFeatured: false, featureOrder: "" },
    offer: "",
    faqs: [{ question: "", answer: "" }],
    documents: [],
  });
  const [newDocuments, setNewDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeDescTab, setActiveDescTab] = useState(0);

  const quillRefs = useRef([]);
  const quillInstances = useRef([]);
  const fileInputRef = useRef(null);

  const handleAddDocument = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewDocuments((prev) => [...prev, file]);
    e.target.value = "";
  };

  const handleRemoveNewDoc = (index) => {
    setNewDocuments((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = `
      .ql-toolbar {
        position: sticky !important;
        top: 0 !important;
        z-index: 10 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);


  useEffect(() => {
    if (isOpen) {
      fetchCategories();
      if (editingService) {
        setFormData({
          isVisible: editingService.isVisible ?? true,
          category: editingService.category?._id || editingService.category,
          subCategory:
            editingService.subCategory?._id || editingService.subCategory,
          serviceName: editingService.serviceName,
          OneLinner: editingService.OneLinner || "",
          priceTag: editingService.priceTag || "0",
          shortDescription: editingService.shortDescription,
          topPointers: editingService.topPointers?.length
            ? editingService.topPointers
            : [""],
          description: editingService.description?.length
            ? editingService.description.map((d) => ({
                tabs: d.tabs || "",
                content: d.content || "",
              }))
            : [{ ...EMPTY_DESCRIPTION_TAB }],
          faqs: editingService.faqs?.length
            ? editingService.faqs
            : [{ question: "", answer: "" }],
          packages: editingService.packages?.length
            ? editingService.packages.map((pkg) => ({
                name: pkg.name || "",
                price: pkg.price || "",
                description: pkg.description || "",
                includedFeatures: pkg.includedFeatures?.length
                  ? pkg.includedFeatures
                  : [""],
                isMostPopular: pkg.isMostPopular || false,
              }))
            : [{ ...EMPTY_PACKAGE }],
          Featured: {
            isFeatured: editingService.Featured?.isFeatured || false,
            featureOrder: editingService.Featured?.featureOrder || "",
          },
          offer: editingService.offer || "",
          documents: editingService.documents || [],
        });
        setNewDocuments([]);
        setActiveDescTab(0);
        fetchSubCategories(
          editingService.category?._id || editingService.category
        );
      } else {
        setNewDocuments([]);
      }
    }
  }, [isOpen, editingService]);

  // Initialize / cleanup Quill instances for each description tab
  useEffect(() => {
    if (!isOpen) {
      // Cleanup all Quill instances when modal closes
      quillInstances.current.forEach((q) => {
        if (q) q.off("text-change");
      });
      quillInstances.current = [];
      quillRefs.current = [];
      return;
    }

    // Initialize Quill for each description tab that doesn't have one yet
    formData.description.forEach((desc, index) => {
      const ref = quillRefs.current[index];
      if (!ref) return;

      // Skip if already initialized and properly set
      if (quillInstances.current[index]) {
        // Update content if it changed (for edit mode)
        if (quillInstances.current[index].root.innerHTML !== desc.content) {
          quillInstances.current[index].root.innerHTML = desc.content || "";
        }
        return;
      }

      ref.innerHTML = "";

      const q = new Quill(ref, {
        theme: "snow",
        placeholder: "Enter content for this tab...",
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link"],
          ],
        },
      });

      q.on("text-change", () => {
        setFormData((prev) => {
          const updated = [...prev.description];
          updated[index] = { ...updated[index], content: q.root.innerHTML };
          return { ...prev, description: updated };
        });
      });

      // Set initial content - use setTimeout to ensure Quill is fully ready
      setTimeout(() => {
        if (desc.content) {
          q.root.innerHTML = desc.content;
        }
      }, 0);

      q.enable(!!formData.subCategory);
      quillInstances.current[index] = q;
    });
  }, [isOpen, editingService?._id, formData.description.length]);

  // Enable/disable Quill editors based on subCategory selection
  useEffect(() => {
    quillInstances.current.forEach((q) => {
      if (q) q.enable(!!formData.subCategory);
    });
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

  // Package handlers
  const handlePackageChange = (pkgIndex, field, value) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[pkgIndex] = { ...updated[pkgIndex], [field]: value };
      return { ...prev, packages: updated };
    });
  };

  const handlePackageFeatureChange = (pkgIndex, featIndex, value) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      const features = [...updated[pkgIndex].includedFeatures];
      features[featIndex] = value;
      updated[pkgIndex] = { ...updated[pkgIndex], includedFeatures: features };
      return { ...prev, packages: updated };
    });
  };

  const addPackageFeature = (pkgIndex) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        includedFeatures: [...updated[pkgIndex].includedFeatures, ""],
      };
      return { ...prev, packages: updated };
    });
  };

  const removePackageFeature = (pkgIndex, featIndex) => {
    setFormData((prev) => {
      const updated = [...prev.packages];
      const features = updated[pkgIndex].includedFeatures.filter(
        (_, i) => i !== featIndex
      );
      updated[pkgIndex] = {
        ...updated[pkgIndex],
        includedFeatures: features.length > 0 ? features : [""],
      };
      return { ...prev, packages: updated };
    });
  };

  const addPackage = () => {
    if (formData.packages.length >= 3) {
      toast.error("Maximum 3 packages allowed per service");
      return;
    }
    setFormData((prev) => ({
      ...prev,
      packages: [...prev.packages, { ...EMPTY_PACKAGE, includedFeatures: [""] }],
    }));
  };

  const removePackage = (index) => {
    setFormData((prev) => {
      const updated = prev.packages.filter((_, i) => i !== index);
      return {
        ...prev,
        packages: updated.length > 0 ? updated : [{ ...EMPTY_PACKAGE, includedFeatures: [""] }],
      };
    });
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

      if (!formData.OneLinner?.trim()) {
        setError("One Liner tagline is required");
        setLoading(false);
        return;
      }

      if (!formData.priceTag?.trim()) {
        setError("Price Tag is required");
        setLoading(false);
        return;
      }

      const submitData = {
        isVisible: formData.isVisible,
        category: formData.category,
        subCategory: formData.subCategory,
        serviceName: formData.serviceName,
        OneLinner: formData.OneLinner,
        priceTag: formData.priceTag,
        shortDescription: formData.shortDescription,
        description: formData.description
          .filter((d) => d.tabs?.trim() && d.content?.trim())
          .map((d) => ({ tabs: d.tabs.trim(), content: d.content })),
        topPointers: formData.topPointers.filter((p) => p.trim()),
        faqs: formData.faqs.filter(
          (faq) => faq.question?.trim() && faq.answer?.trim()
        ),
        packages: formData.packages
          .filter((pkg) => pkg.name?.trim() && pkg.price?.trim())
          .map((pkg) => ({
            ...pkg,
            includedFeatures: pkg.includedFeatures.filter((f) => f.trim()),
          })),
        Featured: {
          isFeatured: formData.Featured.isFeatured,
          featureOrder: formData.Featured.isFeatured
            ? formData.Featured.featureOrder
            : undefined,
        },
        offer: formData.offer?.trim() || null,
        documents: formData.documents || [],
      };

      // Validate at least one description tab has content
      if (submitData.description.length === 0) {
        setError("At least one description tab with content is required");
        setLoading(false);
        return;
      }

      const formPayload = new FormData();
      formPayload.append("isVisible", String(submitData.isVisible));
      formPayload.append("category", submitData.category);
      formPayload.append("subCategory", submitData.subCategory);
      formPayload.append("serviceName", submitData.serviceName);
      formPayload.append("OneLinner", submitData.OneLinner);
      formPayload.append("priceTag", submitData.priceTag);
      formPayload.append("shortDescription", submitData.shortDescription);
      formPayload.append("topPointers", JSON.stringify(submitData.topPointers));
      formPayload.append("description", JSON.stringify(submitData.description));
      formPayload.append("faqs", JSON.stringify(submitData.faqs));
      formPayload.append("packages", JSON.stringify(submitData.packages));
      formPayload.append("Featured", JSON.stringify(submitData.Featured));
      formPayload.append("offer", submitData.offer || "");
      formPayload.append("documents", JSON.stringify(submitData.documents));

      newDocuments.forEach((file) => {
        formPayload.append("documents", file);
      });

      const res = editingService
        ? await axios.put(`/services/${editingService._id}`, formPayload, {
            headers: { "Content-Type": "multipart/form-data" },
          })
        : await axios.post("/services", formPayload, {
            headers: { "Content-Type": "multipart/form-data" },
          });

      if (res.data.data) {
        toast.success(`Service ${editingService ? 'updated' : 'added'} successfully!`);
        onAddService(res.data.data);
      }
    } catch (error) {
      const message = error.response?.data?.message || "Failed to save service";
      toast.error(message);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      isVisible: true,
      category: "",
      subCategory: "",
      serviceName: "",
      OneLinner: "",
      priceTag: "0",
      shortDescription: "",
      topPointers: [""],
      description: [{ ...EMPTY_DESCRIPTION_TAB }],
      packages: [{ ...EMPTY_PACKAGE, includedFeatures: [""] }],
      Featured: { isFeatured: false, featureOrder: "" },
      offer: "",
      faqs: [{ question: "", answer: "" }],
      documents: [],
    });
    setNewDocuments([]);

    // Cleanup all Quill instances
    quillInstances.current.forEach((q) => {
      if (q) {
        q.off("text-change");
        q.root.innerHTML = "";
      }
    });
    quillInstances.current = [];
    setActiveDescTab(0);

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

            {/* Visibility Toggle */}
            <div className="rounded-lg border border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Visibility</p>
                  <p className="text-xs text-gray-500">Set whether this service appears on public pages.</p>
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      isVisible: !prev.isVisible,
                    }))
                  }
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                    formData.isVisible
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {formData.isVisible ? "Visible" : "Not Visible"}
                </button>
              </div>
            </div>

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

            {/* One Liner & Price Tag */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  One Liner Tagline <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="OneLinner"
                  value={formData.OneLinner}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. Start your business in 7 days"
                  required
                  disabled={!formData.subCategory}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price Tag <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="priceTag"
                  value={formData.priceTag}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. ₹2,999 or Starting at ₹999"
                  required
                  disabled={!formData.subCategory}
                />
              </div>
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

            {/* Featured */}
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.Featured.isFeatured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      Featured: {
                        ...prev.Featured,
                        isFeatured: e.target.checked,
                        featureOrder: e.target.checked
                          ? prev.Featured.featureOrder
                          : "",
                      },
                    }))
                  }
                  className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  disabled={!formData.subCategory}
                />
                <label
                  htmlFor="isFeatured"
                  className="text-sm font-medium text-gray-700 cursor-pointer"
                >
                  Mark as Featured Service
                </label>
              </div>
              {formData.Featured.isFeatured && (
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-gray-700">
                    Order:
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.Featured.featureOrder}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        Featured: {
                          ...prev.Featured,
                          featureOrder: e.target.value,
                        },
                      }))
                    }
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
                    placeholder="#"
                    required
                  />
                </div>
              )}
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

            {/* Packages */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Packages
              </label>
              <div className="space-y-4">
                {formData.packages.map((pkg, pkgIndex) => (
                  <div
                    key={pkgIndex}
                    className="border border-gray-200 rounded-lg p-4 bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-gray-700">
                        Package {pkgIndex + 1}
                      </span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={pkg.isMostPopular || false}
                            onChange={(e) =>
                              handlePackageChange(pkgIndex, "isMostPopular", e.target.checked)
                            }
                            className="w-3.5 h-3.5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            disabled={!formData.subCategory}
                          />
                          Most Popular
                        </label>
                        {formData.packages.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removePackage(pkgIndex)}
                            className="text-red-500 hover:text-red-600"
                            disabled={!formData.subCategory}
                          >
                            <MdDelete />
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <input
                        type="text"
                        value={pkg.name}
                        onChange={(e) =>
                          handlePackageChange(pkgIndex, "name", e.target.value)
                        }
                        placeholder="Package name (e.g. Basic, Premium)"
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={!formData.subCategory}
                      />
                      <input
                        type="text"
                        value={pkg.price}
                        onChange={(e) =>
                          handlePackageChange(pkgIndex, "price", e.target.value)
                        }
                        placeholder="Price (e.g. ₹4,999)"
                        className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={!formData.subCategory}
                      />
                    </div>

                    <textarea
                      rows="2"
                      value={pkg.description}
                      onChange={(e) =>
                        handlePackageChange(
                          pkgIndex,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Package description (optional)"
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                      disabled={!formData.subCategory}
                    />

                    {/* Included Features */}
                    <div>
                      <label className="block text-xs font-medium text-gray-600 mb-1">
                        Included Features
                      </label>
                      <div className="space-y-2">
                        {pkg.includedFeatures.map((feat, featIndex) => (
                          <div key={featIndex} className="flex gap-2">
                            <input
                              type="text"
                              value={feat}
                              onChange={(e) =>
                                handlePackageFeatureChange(
                                  pkgIndex,
                                  featIndex,
                                  e.target.value
                                )
                              }
                              placeholder={`Feature ${featIndex + 1}`}
                              className="flex-1 px-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                              disabled={!formData.subCategory}
                            />
                            {pkg.includedFeatures.length > 1 && (
                              <button
                                type="button"
                                onClick={() =>
                                  removePackageFeature(pkgIndex, featIndex)
                                }
                                className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs"
                              >
                                <MdDelete />
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addPackageFeature(pkgIndex)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 text-xs"
                          disabled={!formData.subCategory}
                        >
                          <MdAdd /> Add Feature
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {formData.packages.length < 3 && (
                <button
                  type="button"
                  onClick={addPackage}
                  disabled={!formData.subCategory}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-sm mt-2"
                >
                  <MdAdd /> Add Package ({formData.packages.length}/3)
                </button>
              )}
            </div>

            {/* Offer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Offer
              </label>
              <input
                type="text"
                name="offer"
                value={formData.offer}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. 20% off for first-time customers (optional)"
                disabled={!formData.subCategory}
              />
            </div>

            {/* Documents */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Service Documents
              </label>

              {/* Hidden file input — triggered one at a time */}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.xls,.xlsx,.ppt,.pptx,.doc,.docx,.txt,.csv"
                onChange={handleAddDocument}
                className="hidden"
                disabled={!formData.subCategory}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={!formData.subCategory}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <MdAdd className="w-4 h-4" /> Add Document
              </button>
              <p className="text-xs text-gray-500 mt-1">
                Allowed: PDF, XLS, XLSX, PPT, PPTX, DOC, DOCX, TXT, CSV (max 10MB each)
              </p>

              {/* Existing saved documents */}
              {formData.documents?.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Saved Documents</p>
                  {formData.documents.map((doc, index) => (
                    <div key={`${doc.url}-${index}`} className="flex items-center justify-between text-sm bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                      <span className="truncate text-gray-700">{doc.displayName || doc.name}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            documents: prev.documents.filter((_, i) => i !== index),
                          }))
                        }
                        className="ml-3 text-xs text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Newly queued documents (not yet uploaded) */}
              {newDocuments.length > 0 && (
                <div className="mt-3 space-y-2">
                  <p className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Queued for Upload</p>
                  {newDocuments.map((doc, index) => (
                    <div key={`${doc.name}-${doc.size}-${index}`} className="flex items-center justify-between text-sm bg-blue-50 border border-blue-200 rounded-lg px-3 py-2">
                      <span className="truncate text-gray-700">{doc.name}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveNewDoc(index)}
                        className="ml-3 text-xs text-red-600 hover:text-red-700 font-medium flex-shrink-0"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Description Tabs */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description Tabs <span className="text-red-500">*</span>
              </label>

              {/* Tab navigation */}
              <div className="flex flex-wrap gap-1 mb-3 border-b border-gray-200">
                {formData.description.map((desc, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => setActiveDescTab(index)}
                    className={`px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                      activeDescTab === index
                        ? "bg-blue-50 text-blue-600 border-b-2 border-blue-600"
                        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {desc.tabs?.trim() || `Tab ${index + 1}`}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      description: [...prev.description, { ...EMPTY_DESCRIPTION_TAB }],
                    }));
                    setActiveDescTab(formData.description.length);
                  }}
                  className="px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded-t-lg flex items-center gap-1"
                  disabled={!formData.subCategory}
                >
                  <MdAdd /> Add Tab
                </button>
              </div>

              {/* Active tab content */}
              {formData.description.map((desc, index) => (
                <div
                  key={index}
                  className={`space-y-3 border border-gray-200 rounded-lg p-4 bg-gray-50 ${
                    activeDescTab === index ? "" : "hidden"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <input
                        type="text"
                        value={desc.tabs}
                        onChange={(e) => {
                          setFormData((prev) => {
                            const updated = [...prev.description];
                            updated[index] = { ...updated[index], tabs: e.target.value };
                            return { ...prev, description: updated };
                          });
                        }}
                        placeholder="Tab name (e.g. Overview, Process, Requirements)"
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                        disabled={!formData.subCategory}
                      />
                    </div>
                    {formData.description.length > 1 && (
                      <button
                        type="button"
                        onClick={() => {
                          setFormData((prev) => {
                            const updated = prev.description.filter((_, i) => i !== index);
                            return { ...prev, description: updated };
                          });
                          // Cleanup Quill instance
                          if (quillInstances.current[index]) {
                            quillInstances.current[index].off("text-change");
                            quillInstances.current.splice(index, 1);
                          }
                          setActiveDescTab((prev) => Math.min(prev, formData.description.length - 2));
                        }}
                        className="ml-3 px-2 py-2 text-red-500 hover:text-red-600"
                        disabled={!formData.subCategory}
                      >
                        <MdDelete />
                      </button>
                    )}
                  </div>

                  <div
                    ref={(el) => (quillRefs.current[index] = el)}
                    className="bg-white rounded border border-gray-300"
                    style={{ minHeight: "200px", maxHeight: "400px", overflow: "auto" }}
                  />
                </div>
              ))}
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
