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
    isRM,
    setUser,
    setIsLoggedIn,
    setIsAdmin,
    setIsRM,
  } = useAuth();
  const navigate = useNavigate();
  const email = CommonData.emails.support;

  const getDashboardLink = () => {
    if (isAdmin) return "/adminDashboard";
    if (isRM) return "/rmDashboard";
    return "/dashboard";
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
      toast.success("Logged out successfully!");
      navigate("/");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout");
    }
  };

  return (
    <>
      <div className="bg-(--primary) ">
        <div className="max-w-7xl mx-auto px-3 sm:px-5">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-2 sm:py-2.5 justify-between items-center">
            <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center text-white text-xs sm:text-sm font-medium">
              <span className="hidden sm:inline">Call Us:</span>
              <a
                href={`tel:${CommonData.phones.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-yellow-400 transition-colors duration-300"
              >
                {CommonData.phones.primary}
              </a>
              <span className="hidden sm:inline">|</span>
              <a
                href={`mailto:${email}`}
                className="hover:text-yellow-400 transition-colors duration-300 truncate max-w-45 sm:max-w-none"
              >
                {email}
              </a>
            </div>

            <nav className="flex gap-3 sm:gap-6 md:gap-8 items-center flex-wrap justify-center">
              <Link
                to="/about"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
              >
                About
              </Link>
              <Link
                to="/contact"
                className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
              >
                Contact
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
                  <Link
                    to="/login"
                    className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
                  >
                    Login
                  </Link>
                </>
              )}
            </nav>
          </div>
        </div>
      </div>
      <div
        className={`p-1 ${location === "/service" ? "bg-sky-50" : "bg-[url('/hero.webp')] bg-cover bg-top"}`}
      />
    </>
  );
};

export default TopHeader;
