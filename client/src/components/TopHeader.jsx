import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import CommonData from "../assets/common.json";
import { useAuth } from "../context/AuthContext.jsx";
import { useAppData } from "../context/DataContext";
import axios from "../config/api";
import toast from "react-hot-toast";

const TopHeader = () => {
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
  const navigate = useNavigate();
  const email = CommonData.emails.support;

  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [allServices, setAllServices] = useState([]);
  const searchDropdownRef = useRef(null);

  const { allServices: allServicesData } = useAppData();

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

  const getDashboardLink = () => {
    if (isSuperAdmin) return "/superAdminDashboard";
    if (isAdmin) return "/managerDashboard";
    if (isBlogger) return "/bloggerDashboard";
    if (isRM) return "/rmDashboard";
    return "/";
  };

  const location = useLocation().pathname;

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      sessionStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsRM(false);
      setIsBlogger(false);
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <div className="bg-(--primary) sticky top-0 z-60">
        <div className="max-w-[min(95%,calc(100vw-1rem))] mx-auto px-3 sm:px-5">
          <div className="flex gap-2 sm:gap-4 md:gap-6 py-1.5 sm:py-2 justify-between items-center">
            {/* Logo - Left */}

            <div
              className="w-22 h-12 rounded-xl cursor-pointer overflow-hidden flex items-center justify-center"
              onClick={() => navigate("/")}
            >
              <img
                src="/taxpro-logo-rect.webp"
                alt={CommonData.companyName}
                className="w-full h-full object-cover "
              />
            </div>

            {/* Search Bar - Center */}
            <div
              className="relative flex-1 max-w-md mx-2 sm:mx-4"
              ref={searchDropdownRef}
            >
              <div className="flex items-center bg-white rounded-lg px-3 py-2">
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
                  className="bg-white outline-none text-xs sm:text-sm flex-1 text-(--text)"
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

            {/* Navigation Links & Login - Right */}
            <nav className="hidden md:flex gap-2 lg:gap-4 items-center flex-wrap justify-end shrink-0">
              <Link
                to="/about"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
              >
                About
              </Link>

              <Link
                to="/services"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
              >
                Services
              </Link>

              <Link
                to="/contact"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
              >
                Contact Us
              </Link>

              <Link
                to="/blog"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
              >
                Blog
              </Link>

              {isLoggedIn ? (
                <>
                  <span className="text-white text-xs sm:text-sm">|</span>
                  <Link
                    to={getDashboardLink()}
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
                  >
                    {user?.fullName || user?.email}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  {/* <span className="text-white text-xs sm:text-sm">|</span>
                  <Link
                    to="/login"
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
                  >
                    Login
                  </Link> */}
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
    </>
  );
};

export default TopHeader;
