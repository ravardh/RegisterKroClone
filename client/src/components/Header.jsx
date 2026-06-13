import React, { useState, useEffect, useRef } from "react";
import { IoMenuSharp, IoClose, IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonData from "../assets/common.json";
import ServiceModal from "./ServiceModal.jsx";
import { useAppData } from "../context/DataContext";

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
  const [allCategories, setAllCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [allServices, setAllServices] = useState([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [isOtherServicesOpen, setIsOtherServicesOpen] = useState(false);
  const headerRef = useRef(null);
  const searchDropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes("Dashboard");

  const {
    categories: allCategoriesData,
    subCategories: subCategoriesData,
    services: servicesData,
    allServices: allServicesData,
  } = useAppData();

  // Get main categories (header order 1-5)
  const mainCategories = allCategories
    .filter((cat) => {
      const order = parseInt(cat.headerOrder);
      return !isNaN(order) && order >= 1 && order <= 5;
    })
    .sort((a, b) => parseInt(a.headerOrder) - parseInt(b.headerOrder));

  // Get other categories (header order > 5)
  const otherCategories = allCategories
    .filter((cat) => {
      const order = parseInt(cat.headerOrder);
      return !isNaN(order) && order > 5;
    })
    .sort((a, b) => parseInt(a.headerOrder) - parseInt(b.headerOrder));

  // Sync all services from DataContext
  useEffect(() => {
    if (allServicesData.length > 0) {
      setAllServices(allServicesData);
    }
  }, [allServicesData]);

  // Close search dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchDropdownRef.current &&
        !searchDropdownRef.current.contains(event.target)
      ) {
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
        .includes(searchQuery.toLowerCase()),
  );

  // Sync categories from DataContext
  useEffect(() => {
    if (allCategoriesData.length > 0) {
      setAllCategories(allCategoriesData);
    }
  }, [allCategoriesData]);

  // Close dropdowns when clicking outside header
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target)) {
        setActiveTab(null);
        setSubCategories([]);
        setIsSubMenuOpen(false);
        setSelectedSubcategory(null);
        setIsOtherServicesOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const showDesktopCategoryMenu = (category) => {
    setIsOtherServicesOpen(false);
    setIsSubMenuOpen(false);
    setSelectedSubcategory(null);

    setActiveTab(category.name);
    const sortedSubCats = [...(subCategoriesData[category._id] || [])].sort((a, b) => {
      const seqA = a.sequence != null && a.sequence !== '' ? Number(a.sequence) : Infinity;
      const seqB = b.sequence != null && b.sequence !== '' ? Number(b.sequence) : Infinity;
      return seqA - seqB;
    });
    setSubCategories(sortedSubCats);
  };

  const handleOtherServicesClick = () => {
    setActiveTab(null);
    setSubCategories([]);
    setIsSubMenuOpen(false);
    setSelectedSubcategory(null);
    setIsOtherServicesOpen((prev) => !prev);
  };

  const handleSubcategoryClick = (subcategory) => {
    const isAlreadyOpen = selectedSubcategory?._id === subcategory._id;

    if (isAlreadyOpen) {
      setSelectedSubcategory(null);
      setIsSubMenuOpen(false);
      setSubCategoryServices([]);
      return;
    }

    setSelectedSubcategory(subcategory);
    setIsSubMenuOpen(true);
    const sortedServices = [...(servicesData[subcategory._id] || [])].sort((a, b) => {
      const seqA = a.sequence != null && a.sequence !== '' ? Number(a.sequence) : Infinity;
      const seqB = b.sequence != null && b.sequence !== '' ? Number(b.sequence) : Infinity;
      return seqA - seqB;
    });
    setSubCategoryServices(sortedServices);
  };

  const handleServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    setIsSubMenuOpen(false);
    setSelectedSubcategory(null);
    setActiveTab(null);
    setSubCategories([]);
    setIsOtherServicesOpen(false);
  };

  const closeDesktopMenus = () => {
    setActiveTab(null);
    setSubCategories([]);
    setIsSubMenuOpen(false);
    setSelectedSubcategory(null);
    setSubCategoryServices([]);
    setIsOtherServicesOpen(false);
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
        const sortedMobileSubCats = [...(subCategoriesData[category._id] || [])].sort((a, b) => {
          const seqA = a.sequence != null && a.sequence !== '' ? Number(a.sequence) : Infinity;
          const seqB = b.sequence != null && b.sequence !== '' ? Number(b.sequence) : Infinity;
          return seqA - seqB;
        });
        setMobileSubCategories(sortedMobileSubCats);
      }
    }
  };

  const handleMobileSubcategoryClick = (subcategory) => {
    setMobileExpandedSubcategory(
      mobileExpandedSubcategory === subcategory._id ? null : subcategory._id,
    );
    const sortedMobileServices = [...(servicesData[subcategory._id] || [])].sort((a, b) => {
      const seqA = a.sequence != null && a.sequence !== '' ? Number(a.sequence) : Infinity;
      const seqB = b.sequence != null && b.sequence !== '' ? Number(b.sequence) : Infinity;
      return seqA - seqB;
    });
    setMobileServices(sortedMobileServices);
  };

  const handleMobileServiceClick = (serviceId) => {
    navigate(`/service/${serviceId}`);
    setIsMenuOpen(false);
    setMobileExpandedTab(null);
    setMobileExpandedSubcategory(null);
  };

  const filteredOtherServices = otherCategories;

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky z-50  max-w-[min(90%,calc(100vw-1rem))] mx-auto ${isDashboard
          ? "bg-[url('/hero.webp')] bg-cover bg-left bg-fixed p-1 top-[32px] sm:top-[40px] w-full max-w-none"
          : "bg-white top-[34px] sm:top-[45px] rounded-2xl mb-4 shadow-xl w-full"
          }`}
      >
        <div
          className={`relative ${isDashboard
            ? "px-3 sm:px-4 md:px-6 lg:px-8 rounded-2xl shadow-md bg-white w-[90%] mx-auto"
            : "px-3 sm:px-4 md:px-6 lg:px-8"
            } `}
        >
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Logo */}
            <div className="shrink-0 min-w-0">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/taxpro-logo-rect.webp"
                  alt={CommonData.companyName}
                  className="site-logo"
                />
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex space-x-2 lg:space-x-3 items-center"
              onMouseLeave={closeDesktopMenus}
            >
              {/* Main Tabs */}
              {mainCategories.length > 0 ? (
                <>
                  {mainCategories.map((category, index) => {
                    const opensToLeft = index >= mainCategories.length - 2;

                    return (
                    <div key={category._id} className="relative">
                      {/* Tab Button */}
                      <button
                        type="button"
                        onMouseEnter={() => showDesktopCategoryMenu(category)}
                        onFocus={() => showDesktopCategoryMenu(category)}
                        aria-expanded={activeTab === category.name}
                        className={`font-medium text-xs lg:text-sm text-(--text) hover:text-(--primary) transition-colors duration-200 py-3 px-2 border-b-2 border-transparent hover:bg-(--primary)/10 hover:rounded-xl cursor-pointer ${activeTab === category.name && "bg-(--primary)/10 rounded-xl"}`}
                      >
                        {category.name}
                      </button>

                      {/* Subcategories Dropdown */}
                      {activeTab === category.name &&
                        subCategories.length > 0 && (
                          <div className={`absolute ${opensToLeft ? "right-0" : "left-0"} top-full w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in duration-200 overflow-visible`}>
                            <div className="p-3 max-h-[calc(100vh-8rem)] overflow-y-auto">
                              {subCategories.map((subCat) => (
                                <div key={subCat._id} className="relative">
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSubcategoryClick(subCat)
                                    }
                                    aria-expanded={
                                      selectedSubcategory?._id === subCat._id
                                    }
                                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200 mb-1 cursor-pointer ${selectedSubcategory?._id === subCat._id
                                      ? "text-(--primary) bg-blue-50"
                                      : ""
                                      }`}
                                  >
                                    <span className="flex items-center justify-between w-full">
                                      {subCat.name}{" "}
                                      <span className="text-(--primary) text-base leading-none">
                                        {selectedSubcategory?._id === subCat._id ? "-" : "+"}
                                      </span>
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
                                const hasManyServices =
                                  subCategoryServices.length > 10;
                                const servicesPanelWidth = hasManyServices
                                  ? "w-[min(36rem,calc(100vw-2rem))]"
                                  : "w-80";
                                return (
                                  <div
                                    className={`absolute top-0 ${opensToLeft ? "right-full mr-2" : "left-full ml-2"} ${servicesPanelWidth} bg-white border border-gray-200 rounded-xl shadow-2xl z-60 animate-in fade-in duration-200`}
                                  >
                                    <div className="p-4">
                                      <h3 className="font-semibold text-sm mb-3 text-(--primary)">
                                        {selectedSubcategory.name}
                                      </h3>
                                      <div className={`${hasManyServices ? "grid grid-cols-2 gap-1" : "space-y-2"} max-h-[calc(100vh-9rem)] overflow-y-auto`}>
                                        {subCategoryServices.map((service) => (
                                          <button
                                            key={service._id}
                                            onClick={() =>
                                              handleServiceClick(service._id)
                                            }
                                            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200 cursor-pointer"
                                          >
                                            {service.serviceName}
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
                    );
                  })}
                </>
              ) : null}

              {/* Other Services - Only show if there are categories with headerOrder > 5 */}
              {/* {filteredOtherServices.length > 0 && (
                <div className="relative">
                  <button
                    type="button"
                    className={`font-medium text-xs lg:text-sm text-(--text) hover:text-(--primary) transition-colors duration-200 py-3 px-2 border-b-2 border-transparent hover:bg-(--primary)/10 hover:rounded-xl cursor-pointer ${isOtherServicesOpen ? "bg-(--primary)/10 rounded-xl" : ""
                      }`}
                    onClick={handleOtherServicesClick}
                    aria-expanded={isOtherServicesOpen}
                  >
                    Other Services
                  </button>

                  
                  {isOtherServicesOpen && (
                    <div className="absolute right-0 top-full w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 transition-all duration-200 animate-in fade-in">
                      <div className="p-3 max-h-96 overflow-y-auto">
                        {filteredOtherServices.map((category) => (
                          <button
                            key={category._id}
                            type="button"
                            onClick={() => {
                              setSelectedCategoryName(category.name);
                              setIsModalOpen(true);
                              setIsOtherServicesOpen(false);
                            }}
                            className="w-full text-left px-4 py-3 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) hover:bg-blue-50 transition-all duration-200 mb-1 cursor-pointer"
                          >
                            <span className="flex items-center justify-between w-full">
                              {category.name}{" "}
                              <span className="text-(--primary) text-base leading-none">+</span>
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )} */}
            </nav>

            {/* Search Bar */}
            <div className="relative hidden md:block" ref={searchDropdownRef}>
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
                  className="bg-gray-100 outline-none text-xs w-24 md:w-32 lg:w-60 min-w-0 text-(--text)"
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
            <div
              className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[min(85dvh,calc(100svh-9rem))] overflow-y-auto overscroll-y-contain scroll-touch touch-pan-y"
            >
              <div className="flex flex-col p-4 space-y-2 pb-6">
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

                  {isSearchDropdownOpen &&
                    searchQuery.trim() &&
                    filteredSearchServices.length > 0 && (
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
                              {service.category?.name} →{" "}
                              {service.subCategory?.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                </div>

                {/* Mobile Static Links */}
                <div className="flex flex-col border-b border-gray-200 pb-2 mb-2 space-y-1">
                  <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm">Home</Link>
                  <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm">About</Link>
                  <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm">Contact</Link>
                  <Link to="/blog" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm">Blog</Link>
                  <Link to="/trackStatus" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm">Track Status</Link>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-(--primary) hover:bg-gray-50 font-bold px-3 py-2 rounded-md text-sm">Login / Account</Link>
                </div>

                {/* Mobile Tabs */}
                {mainCategories.map((category) => (
                  <div key={category._id} className="flex flex-col">
                    <button
                      onClick={() => handleMobileTabClick(category.name)}
                      className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm text-left flex justify-between items-center"
                    >
                      {category.name}
                      <span
                        className={`transform transition-transform ${mobileExpandedTab === category.name ? "rotate-180" : "text-(--accent)"}`}
                      >
                        {mobileExpandedTab === category.name ? "-" : "+"}
                      </span>
                    </button>

                    {/* Mobile Subcategories */}
                    {mobileExpandedTab === category.name &&
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
                                  {mobileExpandedSubcategory === subCat._id ? "-" : "+"}
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

                {/* Mobile Other Services - Only show if there are categories with headerOrder > 5 */}
                {filteredOtherServices.length > 0 && (
                  <Link
                    to="/services"
                    className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 font-medium px-3 py-2 rounded-md text-sm"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Other Services
                  </Link>
                )}
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
