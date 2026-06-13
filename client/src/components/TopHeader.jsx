import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CommonData from "../assets/common.json";
import { useAuth } from "../context/AuthContext.jsx";
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
      <div className="bg-(--primary) sticky top-0 z-[60]">
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-6 md:gap-8 py-2 sm:py-2.5 justify-between items-center">
            {/* Mobile: full-width row + horizontal scroll if needed. md+: auto width so the nav row isn’t squeezed. */}
            <div className="flex max-sm:flex-nowrap sm:flex-wrap gap-2 sm:gap-3 items-center justify-center sm:justify-start text-white text-xs sm:text-sm font-medium w-full max-sm:min-w-0 max-sm:overflow-x-auto max-sm:scroll-touch max-sm:overscroll-x-contain max-sm:pb-0.5 max-sm:[scrollbar-width:thin] sm:w-auto sm:min-w-0 sm:overflow-visible lg:max-w-[50%]">
              <span className="hidden sm:inline shrink-0">Call Us:</span>
              <a
                href={`tel:${CommonData.phones.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors duration-300 shrink-0 whitespace-nowrap"
              >
                {CommonData.phones.primary}
              </a>
              <span className="hidden sm:inline shrink-0">|</span>
              <a
                href={`mailto:${email}`}
                className="hover:text-yellow-400 transition-colors duration-300 max-sm:shrink-0 max-sm:whitespace-nowrap sm:min-w-0 sm:truncate"
              >
                {email}
              </a>
            </div>

            <nav className="hidden md:flex gap-3 md:gap-6 lg:gap-8 items-center flex-wrap justify-end shrink-0">
              <Link
                to="/services"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
              >
                Services
              </Link>
              
              <Link
                to="/about"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
              >
                About
              </Link>
              
              <Link
                to="/blog"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
              >
                Blog
              </Link>
              <Link
                to="/trackStatus"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
              >
                Track Status
              </Link>

              {isLoggedIn ? (
                <>
                  <span className="text-white text-xs sm:text-sm font-medium">
                    |
                  </span>
                  <Link
                    to={getDashboardLink()}
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
                  >
                    {user?.fullName || user?.email}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                 
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
