import React, { useState, useEffect, useRef } from "react";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ServiceModal from "./ServiceModal.jsx";
import { useAppData } from "../context/DataContext";
import { useAuth } from "../context/AuthContext.jsx";
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
  const [allCategories, setAllCategories] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [subCategories, setSubCategories] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [isOtherServicesOpen, setIsOtherServicesOpen] = useState(false);
  const headerRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes("Dashboard");

  const {
    user,
    isLoggedIn,
    isAdmin,
    isSuperAdmin,
    isRM,
    isBlogger,
    setUser,
    setIsLoggedIn,
    setIsAdmin,
    setIsRM,
    setIsBlogger,
  } = useAuth();

  const {
    categories: allCategoriesData,
    subCategories: subCategoriesData,
    services: servicesData,
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

  const getDashboardLink = () => {
    if (isSuperAdmin) return "/superAdminDashboard";
    if (isAdmin) return "/managerDashboard";
    if (isBlogger) return "/bloggerDashboard";
    if (isRM) return "/rmDashboard";
    return "/";
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      sessionStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsRM(false);
      setIsBlogger(false);
      setIsMenuOpen(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  const closeMobileMenu = () => setIsMenuOpen(false);

  const filteredOtherServices = otherCategories;

  return (
    <>
      <header
        ref={headerRef}
        className={`sticky z-50  max-w-[min(90%,calc(100vw-1rem))] mx-auto ${isDashboard
          ? "bg-[url('/hero.webp')] bg-cover bg-left bg-fixed p-1 top-[32px] sm:top-[40px] w-full max-w-none"
          : "bg-white top-[60px] sm:top-[70px] rounded-2xl mb-4 shadow-xl w-full"
          }`}
      >
        <div
          className={`relative ${isDashboard
            ? "px-3 sm:px-4 md:px-6 lg:px-8 rounded-2xl shadow-md bg-white w-[90%] mx-auto"
            : "px-3 sm:px-4 md:px-6 lg:px-8"
            } `}
        >
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Desktop Navigation - Left Justified */}
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
                          <div className={`absolute ${opensToLeft ? "right-0" : "left-0"} top-full w-80 bg-white border border-gray-200 rounded-xl shadow-2xl z-50 animate-in fade-in duration-200 overflow-visible before:absolute before:-inset-4 before:-z-10 before:bg-transparent`}>
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
                                    className={`absolute top-0 ${opensToLeft ? "right-full mr-2" : "left-full ml-2"} ${servicesPanelWidth} bg-white border border-gray-200 rounded-xl shadow-2xl z-60 animate-in fade-in duration-200 before:absolute before:-inset-4 before:-z-10 before:bg-transparent`}
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

            {/* Track Status — desktop */}
            <div className="hidden md:block">
              <Link
                to="/trackStatus"
                className="bg-(--primary) text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-(--primary)/90 transition-colors duration-200 whitespace-nowrap"
              >
                Track Status
              </Link>
            </div>

            {/* Mobile: menu left, Track Status right */}
            <button
              type="button"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="rounded-md p-1.5 text-gray-700 hover:bg-gray-100 hover:text-(--primary) sm:p-2 md:hidden"
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <IoClose className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <IoMenuSharp className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>

            <Link
              to="/trackStatus"
              className="bg-(--primary) px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap rounded-lg text-white transition-colors duration-200 hover:bg-(--primary)/90 sm:px-3 sm:text-sm md:hidden"
            >
              Track Status
            </Link>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[min(85dvh,calc(100svh-9rem))] overflow-y-auto overscroll-y-contain scroll-touch touch-pan-y"
            >
              <div className="flex flex-col p-4 space-y-2 pb-6">
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
                    onClick={closeMobileMenu}
                  >
                    Other Services
                  </Link>
                )}

                {/* Divider + Top Header links (mobile only) */}
                <div className="my-2 border-t border-gray-200" aria-hidden />

                <nav className="flex flex-col space-y-1">
                  <Link
                    to="/about"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-(--primary)"
                  >
                    About
                  </Link>
                  <Link
                    to="/services"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-(--primary)"
                  >
                    Services
                  </Link>
                  <Link
                    to="/contact"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-(--primary)"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/blog"
                    onClick={closeMobileMenu}
                    className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-(--primary)"
                  >
                    Blog
                  </Link>

                  {isLoggedIn && (
                    <>
                      <Link
                        to={getDashboardLink()}
                        onClick={closeMobileMenu}
                        className="rounded-md px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-(--primary)"
                      >
                        {user?.fullName || user?.email || "Dashboard"}
                      </Link>
                      <button
                        type="button"
                        onClick={handleLogout}
                        className="rounded-md px-3 py-2.5 text-left text-sm font-medium text-red-600 hover:bg-red-50"
                      >
                        Logout
                      </button>
                    </>
                  )}
                </nav>
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
