import React, { useState } from "react";
import { IoMenuSharp, IoClose } from "react-icons/io5";
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
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.includes("Dashboard");

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
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Contact", to: "/contact" },
    { name: "Track Status", to: "/trackStatus" },
  ];

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

            <nav className="hidden md:flex space-x-4 lg:space-x-8">
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
                <Link
                  to="/login"
                  className="px-4 lg:px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-sm lg:text-base bg-(--primary) text-white hover:bg-(--primary-hover)"
                >
                  Login
                </Link>
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
                    to="/login"
                    className="bg-(--primary) text-white px-4 py-2.5 rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 font-medium text-center text-sm sm:text-base mt-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
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
