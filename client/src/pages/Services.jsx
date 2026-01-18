import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../config/api";
import ServiceModal from "../components/ServiceModal";

const Services = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [categories, setCategories] = useState([]);

  const stats = [
    {
      number: "5000+",
      title: "Happy Clients",
      description: "Businesses served",
    },
    { number: "50+", title: "Expert Team", description: "Professionals" },
    { number: "98%", title: "Success Rate", description: "First attempt" },
    {
      number: "15+",
      title: "Years Experience",
      description: "Industry leader",
    },
    { number: "24/7", title: "Support", description: "Always available" },
  ];

  useEffect(() => {
    // Load categories from session storage if available
    const storedCategories = sessionStorage.getItem("categories");
    if (storedCategories) {
      setCategories(JSON.parse(storedCategories));
    } else {
      // Fallback to API call if session storage is empty
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/public/categories");
          setCategories(response.data.data || []);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, []);

  // Handle category selection from Header search
  useEffect(() => {
    if (location.state?.selectedCategory) {
      handleCategoryClick(location.state.selectedCategory);
      // Clear the navigation state
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Fallback: open by category name if only name is provided
  useEffect(() => {
    const name = location.state?.selectedCategoryName;
    if (name && categories.length > 0) {
      const normalizedName = (() => {
        const n = (name || "").toLowerCase().trim();
        if (["compliences", "compliances", "compliance"].includes(n))
          return "Compliance";
        if (["registeration", "registration"].includes(n))
          return "Registration";
        if (["taxation"].includes(n)) return "Taxation";
        return name;
      })();

      const cat = categories.find(
        (c) => c?.name?.toLowerCase() === normalizedName.toLowerCase(),
      );
      if (cat) {
        handleCategoryClick(cat);
        window.history.replaceState({}, document.title);
      }
    }
  }, [categories, location.state]);

  const handleCategoryClick = (category) => {
    setSelectedCategoryName(category.name);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategoryName(null);
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
                      <div className="text-2xl font-bold text-white">
                        {stat.number}
                      </div>
                      <h3 className="text-sm font-semibold text-white">
                        {stat.title}
                      </h3>
                      <p className="text-xs text-white/90">
                        {stat.description}
                      </p>
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
                    <div className="text-3xl font-bold text-white mb-1">
                      {stats[currentSlide].number}
                    </div>
                    <h3 className="text-sm font-semibold text-white mb-1">
                      {stats[currentSlide].title}
                    </h3>
                    <p className="text-xs text-white/90">
                      {stats[currentSlide].description}
                    </p>
                  </div>
                </div>
                <div className="flex justify-center gap-2 mt-3">
                  {stats.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        currentSlide === index
                          ? "w-8 bg-white"
                          : "w-1.5 bg-white/50"
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
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--primary) mb-4 sm:mb-8">
                Service Categories
              </h2>
              <p className="text-gray-600 text-base sm:text-lg">
                Explore our comprehensive range of business services
              </p>
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
                    <h2 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h2>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Service Modal */}
        <ServiceModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          categoryName={selectedCategoryName}
        />
      </div>
    </>
  );
};

export default Services;
