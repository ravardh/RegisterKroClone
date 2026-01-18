import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ServiceModal = ({ isOpen, onClose, categoryName }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [category, setCategory] = useState(null);

  // Load data from sessionStorage when modal opens
  useEffect(() => {
    if (!isOpen || !categoryName) return;

    setLoading(true);
    try {
      // Find the category
      const categoriesData = sessionStorage.getItem("categories");
      const categories = categoriesData ? JSON.parse(categoriesData) : [];
      const foundCategory = categories.find(
        (c) => c.name.toLowerCase() === categoryName.toLowerCase()
      );

      if (foundCategory) {
        setCategory(foundCategory);

        // Get subcategories for this category
        const subCategoriesObj = JSON.parse(
          sessionStorage.getItem("subCategories") || "{}"
        );
        const categorySubCategories = subCategoriesObj[foundCategory._id] || [];
        setSubCategories(categorySubCategories);

        // Auto-select first subcategory
        if (categorySubCategories.length > 0) {
          setSelectedSubCategory(categorySubCategories[0]);
          // Get services for first subcategory
          const servicesObj = JSON.parse(
            sessionStorage.getItem("services") || "{}"
          );
          setServices(servicesObj[categorySubCategories[0]._id] || []);
        }
      }
    } catch (error) {
      console.error("Error loading modal data:", error);
    } finally {
      setLoading(false);
    }
  }, [isOpen, categoryName]);

  const handleSubCategoryClick = (subCategory) => {
    setSelectedSubCategory(subCategory);

    try {
      const servicesObj = JSON.parse(
        sessionStorage.getItem("services") || "{}"
      );
      setServices(servicesObj[subCategory._id] || []);
    } catch (error) {
      console.error("Error loading services:", error);
      setServices([]);
    }
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="bg-(--primary) px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
            {category?.name}
          </h2>
          <button
            onClick={onClose}
            className="text-white hover:text-gray-200 transition-colors text-3xl font-light"
          >
            ×
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex h-[calc(90vh-60px)] sm:h-[calc(85vh-80px)]">
          {/* Left Section - Sub-categories - Dropdown on small screens, sidebar on larger */}
          <div className="hidden sm:block w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
            <div className="p-3 sm:p-4">
              {loading ? (
                <div className="text-center py-4 text-gray-500">Loading...</div>
              ) : subCategories.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No subcategories found
                </div>
              ) : (
                subCategories.map((subCat) => (
                  <button
                    key={subCat._id}
                    onClick={() => handleSubCategoryClick(subCat)}
                    onMouseEnter={() => handleSubCategoryClick(subCat)}
                    className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl mb-2 transition-all duration-200 text-sm sm:text-base ${
                      selectedSubCategory?._id === subCat._id
                        ? "bg-(--primary) text-white shadow-md"
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {subCat.name}
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Right Section - Services */}
          <div className="w-full sm:w-2/3 overflow-y-auto">
            {/* Dropdown for mobile */}
            <div className="sm:hidden p-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
              <select
                value={selectedSubCategory?._id || ""}
                onChange={(e) => {
                  const subCat = subCategories.find((sc) => sc._id === e.target.value);
                  if (subCat) handleSubCategoryClick(subCat);
                }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary)"
              >
                <option value="">Select a subcategory</option>
                {subCategories.map((subCat) => (
                  <option key={subCat._id} value={subCat._id}>
                    {subCat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="p-3 sm:p-4 md:p-6">
              {loading ? (
                <div className="text-center py-8 text-gray-500">
                  Loading services...
                </div>
              ) : services.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No services found for this subcategory
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                  {services.map((service) => (
                    <div
                      key={service._id}
                      onClick={() => handleServiceClick(service._id)}
                      className="bg-white p-2 sm:p-3 md:p-4 hover:underline hover:underline-offset-2 text-(--text) hover:text-(--primary) transition-all duration-200 cursor-pointer"
                    >
                      <p className="hover:text-(--primary) font-medium text-sm sm:text-base">
                        {service.serviceName}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceModal;
