import React, { useState, useEffect } from "react";
import { IoMenuSharp, IoClose, IoSearch } from "react-icons/io5";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonData from "../assets/common.json";
import { useAuth } from "../context/AuthContext.jsx";
import axios from "../config/api";
import toast from "react-hot-toast";

const Header = () => {
  const {
    user,
    isLoggedIn,
    isAdmin,
    isRM,
    setUser,
    setIsLoggedIn,
    setIsAdmin,
    setIsRM,
  } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes("Dashboard");

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("/public/categories");
        setAllCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  // Handle search
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
      return;
    }

    const filtered = allCategories.filter((category) =>
      category.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setSearchResults(filtered);
  }, [searchQuery, allCategories]);

  // Get dashboard link based on user role
  const getDashboardLink = () => {
    if (isAdmin) return "/adminDashboard";
    if (isRM) return "/rmDashboard";
    return "/dashboard";
  };

  const getDashboardLabel = () => {
    if (isAdmin) return "Admin Dashboard";
    if (isRM) return "RM Dashboard";
    return "Dashboard";
  };

  const navLinks = [
    { name: "About", to: "/about" },
    { name: "Track Status", to: "/trackStatus" },
  ];

  const handleCategorySelect = (category) => {
    navigate("/services", { state: { selectedCategory: category } });
    setSearchQuery("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleServicesDropdownSelect = (category) => {
    navigate("/services", { state: { selectedCategory: category } });
    setIsServicesDropdownOpen(false);
  };

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout");
      sessionStorage.removeItem("user");
      setUser(null);
      setIsLoggedIn(false);
      setIsAdmin(false);
      setIsRM(false);
      toast.success("Logged out successfully!");
      navigate("/");
      setIsMenuOpen(false);
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <header
        className={`sticky z-50 ${
          isDashboard
            ? "bg-[url('hero.jpg')] bg-cover bg-left bg-fixed p-1 top-0"
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
            <div className="shrink-0">
              <Link
                to="/"
                className="text-lg sm:text-xl md:text-2xl font-bold text-(--primary)"
              >
                {CommonData.companyName}
              </Link>
            </div>

            <nav className="hidden md:flex space-x-4 lg:space-x-8 items-center">

              {/* Services Dropdown */}
              <div
                className="relative group"
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                onMouseLeave={() => setIsServicesDropdownOpen(false)}
              >
                <button className="font-medium text-sm lg:text-base text-(--text) hover:text-(--primary-hover) w-full px-2" onClick = {() => navigate("/services")}>
                  Services
                </button>

                {/* Categories Dropdown Menu */}
                {isServicesDropdownOpen && allCategories.length > 0 && (
                  <div className="absolute top-full -left-2 mt-1 bg-white border border-gray-300 rounded-xl shadow-xl z-50 min-w-64 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-2">
                      {allCategories.map((category, index) => (
                        <button
                          key={category._id}
                          onClick={() => handleServicesDropdownSelect(category)}
                          className="w-full text-left px-4 py-3 hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 rounded-lg text-sm font-medium text-(--text) hover:text-(--primary) transition-all duration-200 cursor-pointer group relative overflow-hidden"
                        >
                          <span className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-gray-300 group-hover:bg-(--primary) transition-colors duration-200"></span>
                            <span>{category.name}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
                {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.to}
                  className="font-medium text-sm lg:text-base text-(--text) hover:text-(--primary-hover)"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Auth Actions */}
            <div className="hidden md:flex items-center gap-4">
              {isLoggedIn ? (
                <>
                  <div className="flex items-center gap-3">
                    <Link
                      to={getDashboardLink()}
                      className="text-sm lg:text-base text-(--text) font-medium hover:text-(--primary-hover)"
                    >
                      {user?.fullName || user?.email}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-4 lg:px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base bg-(--primary) text-white hover:bg-(--primary-hover)"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Search Bar */}
                  <div className="relative">
                    <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                      <IoSearch className="text-gray-500 mr-2" />
                      <input
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setIsSearching(true)}
                        onBlur={() => setTimeout(() => setIsSearching(false), 200)}
                        className="bg-gray-100 outline-none text-sm w-40 text-(--text)"
                      />
                    </div>
                    
                    {/* Search Results Dropdown */}
                    {isSearching && searchResults.length > 0 && (
                      <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                        {searchResults.map((category) => (
                          <button
                            key={category._id}
                            onClick={() => handleCategorySelect(category)}
                            className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 text-sm text-(--text) hover:text-(--primary) transition-colors"
                          >
                            {category.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                  
                  <Link
                    to="/contact"
                    className="px-2 lg:px-4 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base bg-(--primary) text-white hover:bg-(--primary-hover)"
                  >
                    Contact Us
                  </Link>
                </>
              )}
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-1.5 sm:p-2 rounded-md focus:outline-none text-gray-700 hover:text-(--primary) hover:bg-gray-100"
            >
              {isMenuOpen ? (
                <IoClose className="h-5 w-5 sm:h-6 sm:w-6" />
              ) : (
                <IoMenuSharp className="h-5 w-5 sm:h-6 sm:w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu - Floating/Absolute */}
          {isMenuOpen && (
            <div className="absolute top-full left-0 right-0 mt-2 md:hidden bg-white rounded-lg shadow-xl border border-gray-200 z-50 animate-fade-in">
              <div className="flex flex-col p-3 sm:p-4 space-y-1">
                {/* Mobile Search Bar */}
                <div className="relative mb-2">
                  <div className="flex items-center bg-gray-100 rounded-lg px-3 py-2">
                    <IoSearch className="text-gray-500 mr-2" />
                    <input
                      type="text"
                      placeholder="Search categories..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-gray-100 outline-none text-sm flex-1 text-(--text)"
                    />
                  </div>
                  
                  {/* Mobile Search Results */}
                  {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
                      {searchResults.map((category) => (
                        <button
                          key={category._id}
                          onClick={() => {
                            handleCategorySelect(category);
                            setIsMenuOpen(false);
                          }}
                          className="w-full text-left px-4 py-2.5 hover:bg-gray-50 border-b last:border-b-0 text-sm text-(--text) hover:text-(--primary) transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 transition-colors duration-200 font-medium px-3 py-2.5 rounded-md text-sm sm:text-base"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                {/* Mobile Services Link */}
                <Link
                  to="/services"
                  className="text-gray-700 hover:text-(--primary) hover:bg-gray-50 transition-colors duration-200 font-medium px-3 py-2.5 rounded-md text-sm sm:text-base"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Services
                </Link>

                {isLoggedIn ? (
                  <>
                    <div className="border-t border-gray-200 pt-2 mt-2 space-y-2">
                      <Link
                        to={getDashboardLink()}
                        className="block px-3 py-2 text-sm text-gray-600 font-medium hover:text-(--primary) hover:bg-gray-50 rounded-md"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {user?.fullName || user?.email}
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="w-full bg-(--primary) text-white px-4 py-2.5 rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 font-medium text-center text-sm sm:text-base"
                      >
                        Logout
                      </button>
                    </div>
                  </>
                ) : (
                  <Link
                    to="/contact"
                    className="bg-(--primary) text-white px-4 py-2.5 rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 font-medium text-center text-sm sm:text-base mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact Us
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
