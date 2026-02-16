import React, { useState, useEffect, useRef } from "react";
import { IoMenuSharp, IoClose, IoSearch } from "react-icons/io5";
import { IoChevronDownCircleOutline } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonData from "../assets/common.json";
import ServiceModal from "./ServiceModal.jsx";
import axios from "../config/api";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSubMenuOpen, setIsSubMenuOpen] = useState(false);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);
  const [subCategoryServices, setSubCategoryServices] = useState([]);
  const [mobileExpandedTab, setMobileExpandedTab] = useState(null);
  const [mobileExpandedSubcategory, setMobileExpandedSubcategory] =
    useState(null);
  const [mobileSubCategories, setMobileSubCategories] = useState([]);
  const [mobileServices, setMobileServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const headerRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes("Dashboard");

  const MAIN_TABS = ["Business Formation", "Licenses & Registrations","Taxation","Trademark & IPRs","Accounting", "Compliance"];

  // Fetch all services for search
  useEffect(() => {
    const fetchServices = async () => {
      try {
        // Check sessionStorage first
        const cachedServices = sessionStorage.getItem("allServices");
        if (cachedServices) {
          setAllServices(JSON.parse(cachedServices));
          return;
        }

        // If not cached, fetch from API
        const response = await axios.get("/public/services");
        const services = response.data.data || [];
        setAllServices(services);
        
        // Cache for session
        sessionStorage.setItem("allServices", JSON.stringify(services));
      } catch (error) {
        console.error("Failed to fetch services", error);
      }
    };

    fetchServices();
  }, []);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDropdownRef.current && !searchDropdownRef.current.contains(event.target)) {
        setIsSearchDropdownOpen(false);
      }
    };

    if (isSearchDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSearchDropdownOpen]);

  // Filter services based on search query
  const filteredSearchServices = allServices.filter(
    (service) =>
      service.serviceName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.category?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      service.subCategory?.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase())
  );

  // Load categories from session storage - wait for initialization
  useEffect(() => {
    const loadCategories = () => {
      try {
        const categoriesData = sessionStorage.getItem("categories");
        if (categoriesData) {
          setAllCategories(JSON.parse(categoriesData));
        }
      } catch (error) {
        console.error("Error loading data from session storage:", error);
      }
    };

    // Check if data is initialized
    const isInitialized = sessionStorage.getItem("appDataInitialized");
    
    if (isInitialized) {
      loadCategories();
    } else {
      // If not initialized, wait for it with a polling mechanism
      const checkInterval = setInterval(() => {
        if (sessionStorage.getItem("appDataInitialized")) {
          loadCategories();
          clearInterval(checkInterval);
        }
      }, 100);

      // Cleanup interval
      return () => clearInterval(checkInterval);
    }
  }, []);

  // Close dropdowns when clicking outside header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveTab(null);
        setSubCategories([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleTabHover = (tabName) => {
    setActiveTab(tabName);
    const category = allCategories.find(
      (c) => c.name.toLowerCase() === tabName.toLowerCase(),
    );
    if (category) {
      try {
        const subCategoriesObj = JSON.parse(
          sessionStorage.getItem("subCategories") || "{}",
        );
        setSubCategories(subCategoriesObj[category._id] || []);
      } catch (error) {
        console.error("Error loading subcategories:", error);
        setSubCategories([]);
      }
    }
  };

  const handleSubcategoryClick = (subcategory) => {
    setSelectedSubcategory(subcategory);
    setIsSubMenuOpen(true);

    try {
      const servicesObj = JSON.parse(
        sessionStorage.getItem("services") || "{}",
      );
      setSubCategoryServices(servicesObj[subcategory._id] || []);
    } catch (error) {
      console.error("Error loading services:", error);
      setSubCategoryServices([]);
    }
  };

  const handleCategorySelect = (category) => {
    navigate("/services", { state: { selectedCategory: category } });
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    setIsSubMenuOpen(false);
    setSelectedSubcategory(null);
    setActiveTab(null);
    setSubCategories([]);
  };

  const handleMobileTabClick = (tabName) => {
    setMobileExpandedTab(mobileExpandedTab === tabName ? null : tabName);
    setMobileExpandedSubcategory(null);
    setMobileServices([]);

    if (mobileExpandedTab !== tabName) {
      const category = allCategories.find(
        (c) => c.name.toLowerCase() === tabName.toLowerCase(),
      );
      if (category) {
        try {
          const subCategoriesObj = JSON.parse(
            sessionStorage.getItem("subCategories") || "{}",
          );
          setMobileSubCategories(subCategoriesObj[category._id] || []);
        } catch (error) {
          console.error("Error loading subcategories:", error);
          setMobileSubCategories([]);
        }
      }
    }
  };

  const handleMobileSubcategoryClick = (subcategory) => {
    setMobileExpandedSubcategory(
      mobileExpandedSubcategory === subcategory._id ? null : subcategory._id,
    );
    try {
      const servicesObj = JSON.parse(
        sessionStorage.getItem("services") || "{}",
      );
      setMobileServices(servicesObj[subcategory._id] || []);
    } catch (error) {
      console.error("Error loading services:", error);
      setMobileServices([]);
    }
  };

  const handleMobileServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    setIsMenuOpen(false);
    setMobileExpandedTab(null);
    setMobileExpandedSubcategory(null);
  };

  const filteredOtherServices = allCategories.filter(
    (cat) => !MAIN_TABS.includes(cat.name),
  );

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky z-50 ${
          isDashboard
            ? "bg-[url('/hero.webp')] bg-cover bg-left bg-fixed p-1 top-0"
            : "bg-white top-2 rounded-2xl mb-4 shadow-md w-[90%] mx-auto"
        }`}
      >
        <div
          className={`relative ${
            isDashboard
              ? "px-3 sm:px-4 md:px-6 lg:px-8 rounded-2xl shadow-md bg-white w-[90%] mx-auto"
              : "px-3 sm:px-4 md:px-6 lg:px-8"
          }`}
        >
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="shrink-0">
              <Link
                to="/"
                className="text-sm sm:text-md md:text-lg lg:text-xl font-bold text-(--primary)"
              >
                {CommonData.companyName}
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-2 lg:space-x-3 items-center">
              {/* Main Tabs */}
              {MAIN_TABS.map((tabName) => (
                <div
                  key={tabName}
                  className="relative"
                  onMouseEnter={() => handleTabHover(tabName)}
                  onMouseLeave={() => {
                    setActiveTab(null);
                    setSubCategories([]);
                  }}
                >
                  {/* Tab Button */}
                  <button
                    className={`font-medium text-xs lg:text-sm text-(--text) hover:text-(--primary) transition-colors duration-200 py-3 px-2 border-b-2 border-transparent hover:bg-(--primary)/10 hover:rounded-xl ${activeTab === tabName && "bg-(--primary)/10 rounded-xl"}`}
                  >
                    {tabName}
                  </button>

                  {/* Subcategories Dropdown */}
                  {activeTab === tabName && subCategories.length > 0 && (
                    <div
                      className="absolute left-0 top-full w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in duration-200 overflow-visible"
                      onMouseLeave={() => {
                        setIsSubMenuOpen(false);
                        setSelectedSubcategory(null);
                      }}
                    >
                      <div className="p-3 overflow-y-auto">
                        {subCategories.map((subCat) => (
                          <div
                            key={subCat._id}
                            className="relative"
                            onMouseEnter={() => handleSubcategoryClick(subCat)}
                          >
                            <button
                              onClick={() => handleSubcategoryClick(subCat)}
                              className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200 mb-1"
                            >
                              <span className="flex items-center gap-3">
                                <span className="w-2 h-2 rounded-full bg-(--primary)"></span>
                                {subCat.name}
                              </span>
                            </button>
                          </div>
                        ))}
                      </div>

                      {/* Services Submenu - Outside overflow container */}
                      {isSubMenuOpen &&
                        selectedSubcategory &&
                        subCategoryServices.length > 0 &&
                        (() => {
                          const selectedIndex = subCategories.findIndex(
                            (cat) => cat._id === selectedSubcategory._id,
                          );
                          const topOffset = selectedIndex * 52; // Each item is ~52px
                          return (
                            <div
                              style={{ top: `${topOffset}px` }}
                              className="absolute left-full  w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-60 animate-in fade-in duration-200"
                            >
                              <div className="p-4">
                                <h3 className="font-semibold text-sm mb-3 text-(--primary)">
                                  {selectedSubcategory.name}
                                </h3>
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                  {subCategoryServices.map((service) => (
                                    <button
                                      key={service._id}
                                      onClick={() =>
                                        handleServiceClick(service._id)
                                      }
                                      className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200"
                                    >
                                      <span className="flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-(--primary)"></span>
                                        {service.serviceName}
                                      </span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>
                          );
                        })()}
                    </div>
                  )}
                </div>
              ))}

              {/* Other Services */}
              <div className="relative group">
                <button
                  className="font-medium text-xs lg:text-sm text-(--text) hover:text-(--primary) transition-colors duration-200 py-3 px-2 border-b-2 border-transparent group-hover:bg-(--primary)/10 group-hover:rounded-xl "
                  onClick={() => navigate("/services")}
                >
                  Other Services
                </button>

                {/* Other Services Dropdown */}
                {filteredOtherServices.length > 0 && (
                  <div className="absolute left-0 top-full w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-in fade-in">
                    <div className="p-3 max-h-96 overflow-y-auto">
                      {filteredOtherServices.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => {
                            setSelectedCategoryName(category.name);
                            setIsModalOpen(true);
                          }}
                          className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200 mb-1"
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-(--primary)"></span>
                            {category.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </nav>

            {/* Search Bar */}
            <div className="relative" ref={searchDropdownRef}>
              <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                <IoSearch className="text-gray-500 mr-2" />
                <input
                  type="text"
                  placeholder="Search services..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setIsSearchDropdownOpen(true);
                  }}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      setIsSearchDropdownOpen(true);
                    }
                  }}
                  className="bg-gray-100 outline-none text-sm w-27 md:w-30 lg:w-40 text-(--text)"
                />
              </div>

              {/* Search Results Dropdown */}
              {isSearchDropdownOpen && searchQuery.trim() && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {filteredSearchServices.length > 0 ? (
                    filteredSearchServices.map((service) => (
                      <button
                        key={service._id}
                        onClick={() => {
                          navigate(`/service/${service._id}`);
                          setSearchQuery("");
                          setIsSearchDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 border-b last:border-b-0 text-sm text-(--text) transition-colors"
                      >
                        <div className="font-semibold text-(--primary)">
                          {service.serviceName}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5">
                          {service.category?.name} → {service.subCategory?.name}
                        </div>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No services found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-md text-gray-700 hover:text-(--primary) hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <IoClose className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <IoMenuSharp className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
              <div className="flex flex-col p-4 space-y-2">
                {/* Mobile Search */}
                <div className="relative mb-2">
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                    <IoSearch className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setIsSearchDropdownOpen(true);
                      }}
                      className="bg-gray-100 outline-none text-sm flex-1 text-(--text)"
                    />
                  </div>

                  {isSearchDropdownOpen && searchQuery.trim() && filteredSearchServices.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {filteredSearchServices.map((service) => (
                        <button
                          key={service._id}
                          onClick={() => {
                            navigate(`/service/${service._id}`);
                            setSearchQuery("");
                            setIsSearchDropdownOpen(false);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-blue-50 border-b last:border-b-0 text-sm text-(--text)"
                        >
                          <div className="font-semibold text-(--primary) text-xs">
                            {service.serviceName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {service.category?.name} → {service.subCategory?.name}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Mobile Tabs */}
                {MAIN_TABS.map((tabName) => (
                  <div key={tabName} className="flex flex-col">
                    <button
                      onClick={() => handleMobileTabClick(tabName)}
                      className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm text-left flex justify-between items-center"
                    >
                      {tabName}
                      <span
                        className={`transform transition-transform ${mobileExpandedTab === tabName ? "rotate-180" : "text-(--accent)"}`}
                      >
                        <IoChevronDownCircleOutline/>
                      </span>
                    </button>

                    {/* Mobile Subcategories */}
                    {mobileExpandedTab === tabName &&
                      mobileSubCategories.length > 0 && (
                        <div className="bg-gray-50 pl-4 py-2 space-y-1">
                          {mobileSubCategories.map((subCat) => (
                            <div key={subCat._id} className="flex flex-col">
                              <button
                                onClick={() =>
                                  handleMobileSubcategoryClick(subCat)
                                }
                                className="text-gray-600 hover:text-(--primary) hover:bg-white font-medium px-3 py-2 rounded-md text-sm text-left flex justify-between items-center"
                              >
                                {subCat.name}
                                <span
                                  className={`transform transition-transform ${mobileExpandedSubcategory === subCat._id ? "rotate-180" : "text-(--accent)"}`}
                                >
                                 <IoChevronDownCircleOutline/>
                                </span>
                              </button>

                              {/* Mobile Services */}
                              {mobileExpandedSubcategory === subCat._id &&
                                mobileServices.length > 0 && (
                                  <div className="bg-white pl-4 py-2 space-y-1">
                                    {mobileServices.map((service) => (
                                      <button
                                        key={service._id}
                                        onClick={() =>
                                          handleMobileServiceClick(service._id)
                                        }
                                        className="text-gray-600 hover:text-(--primary) font-medium px-3 py-2 rounded-md text-sm text-left"
                                      >
                                        {service.serviceName}
                                      </button>
                                    ))}
                                  </div>
                                )}
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                ))}

                {/* Mobile Other Services */}
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Other Services
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedCategoryName(null);
        }}
        categoryName={selectedCategoryName}
      />
    </>
  );
};

export default Header;
