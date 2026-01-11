import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../config/api";

const Services = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const stats = [
    { number: "5000+", title: "Happy Clients", description: "Businesses served" },
    { number: "50+", title: "Expert Team", description: "Professionals" },
    { number: "98%", title: "Success Rate", description: "First attempt" },
    { number: "15+", title: "Years Experience", description: "Industry leader" },
    { number: "24/7", title: "Support", description: "Always available" }
  ];

  useEffect(() => {
    // Fetch categories on component mount
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/public/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleCategoryClick = async (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
    setLoading(true);
    
    try {
      // Fetch subcategories for the selected category
      const response = await axiosInstance.get(`/public/categories/${category._id}/subcategories`);
      const fetchedSubCategories = response.data.data || [];
      setSubCategories(fetchedSubCategories);
      
      // Auto-select the first subcategory
      if (fetchedSubCategories.length > 0) {
        setSelectedSubCategory(fetchedSubCategories[0]);
        // Fetch services for the first subcategory
        await fetchServicesForSubCategory(fetchedSubCategories[0]._id);
      }
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServicesForSubCategory = async (subCategoryId) => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(`/public/subcategories/${subCategoryId}/services`);
      setServices(response.data.data || []);
    } catch (error) {
      console.error("Error fetching services:", error);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubCategoryClick = async (subCategory) => {
    setSelectedSubCategory(subCategory);
    await fetchServicesForSubCategory(subCategory._id);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setSubCategories([]);
    setServices([]);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="bg-linear-to-r from-blue-50 to-sky-50 py-10 px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen -mt-20">
        {/* Statistics Carousel Header */}
      <div className="bg-(--primary) mt-16 py-4 px-4 sm:px-8 rounded-2xl shadow-lg">
        <div className="sm:max-w-3xl md:max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Desktop: Show all stats */}
            <div className="hidden md:flex justify-center items-center gap-8 w-full">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <h3 className="text-sm font-semibold text-white">{stat.title}</h3>
                    <p className="text-xs text-white/90">{stat.description}</p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="h-10 w-px bg-white/30"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Carousel */}
            <div className="md:hidden w-full">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-white mb-1">{stats[currentSlide].number}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">{stats[currentSlide].title}</h3>
                  <p className="text-xs text-white/90">{stats[currentSlide].description}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {stats.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "w-8 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--primary) mb-4 sm:mb-8">Service Categories</h2>
            <p className="text-gray-600 text-base sm:text-lg">Explore our comprehensive range of business services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {categories.length === 0 ? (
              <div className="col-span-full text-center py-8 text-gray-500">
                Loading categories...
              </div>
            ) : (
              categories.map((category) => (
                <div 
                  key={category._id}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-white border-l-4 border-(--primary) p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
                >
                  <h2 className="text-lg font-semibold text-gray-800">{category.name}</h2>
                  
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-(--primary) px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{selectedCategory?.name}</h2>
              <button
                onClick={handleCloseModal}
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
                    <div className="text-center py-4 text-gray-500">No subcategories found</div>
                  ) : (
                    subCategories.map((subCat) => (
                      <button
                        key={subCat._id}
                        onClick={() => handleSubCategoryClick(subCat)}
                        onMouseEnter={() => handleSubCategoryClick(subCat)}
                        className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl mb-2 transition-all duration-200 text-sm sm:text-base ${
                          selectedSubCategory?._id === subCat._id
                            ? "bg-(--primary) text-white shadow-md"
                            : "text-gray-700"
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
                      const subCat = subCategories.find(sc => sc._id === e.target.value);
                      if (subCat) handleSubCategoryClick(subCat);
                    }}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  >
                    {subCategories.map((subCat) => (
                      <option key={subCat._id} value={subCat._id}>
                        {subCat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                  {loading ? (
                    <div className="text-center py-8 text-gray-500">Loading services...</div>
                  ) : services.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">No services found for this subcategory</div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {services.map((service) => (
                        <div
                          key={service._id}
                          onClick={() => handleServiceClick(service._id)}
                          className="bg-white p-2 sm:p-3 md:p-4 hover:underline hover:underline-offset-2 text-(--text) hover:text-(--primary) transition-all duration-200 cursor-pointer"
                        >
                          <p className="hover:text-(--primary) font-medium text-sm sm:text-base">{service.serviceName}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Services;
