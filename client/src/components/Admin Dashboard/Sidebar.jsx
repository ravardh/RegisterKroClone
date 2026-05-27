import React from "react";
import { FaTachometerAlt, FaUsers, FaLeaf, FaSignOutAlt, FaBox, FaTag, FaEnvelope, FaBars, FaTimes, FaStar, FaBlog, FaUserFriends } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "../../config/api";
import { useAuth } from "../../context/AuthContext";

const Sidebar = ({ activeTab, setActiveTab, isSidebarOpen, setIsSidebarOpen }) => {
  const navigate = useNavigate();
  const { setUser, setIsLoggedIn, setIsAdmin, setIsRM } = useAuth();
  const sidebarItems = [
    { id: "overview", label: "Overview", icon: FaTachometerAlt },
    { id: "relationshipManagers", label: "RM Manage", icon: FaUsers },
    { id: "leads", label: "Leads", icon: FaLeaf },
    { id: "category", label: "Category", icon: FaTag },
    { id: "services", label: "Services", icon: FaBox },
    { id: "contact", label: "Contact", icon: FaEnvelope },
    { id: "feedbacks", label: "Feedbacks", icon: FaStar },
    { id: "blogs", label: "Blogs", icon: FaBlog },
    { id: "ourTeam", label: "Our Team", icon: FaUserFriends },
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
        navigate("/login");
      } catch (error) {
        console.error("Logout failed", error);
        toast.error(error.response?.data?.message || "Logout failed. Please try again.");
      }
    };

    const handleTabClick = (tabId) => {
      setActiveTab(tabId);
      setIsSidebarOpen(false);
    };

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed top-20 right-4 z-50 bg-blue-600 text-white p-3 rounded-lg shadow-lg hover:bg-blue-700 transition"
      >
        {isSidebarOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Overlay for mobile */}
      {isSidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-40
        w-64 lg:w-1/5 h-full shadow-2xl flex flex-col overflow-y-auto no-scrollbar 
        bg-[url('/hero.webp')] bg-cover
        transform transition-transform duration-300 ease-in-out
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 pt-1 sm:p-6 sm:pt-2 flex-1 overflow-y-auto no-scrollbar">
          <div className="mb-2 sm:mb-3">
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">
              Admin Dashboard
            </h1>
          </div>
          <nav className="space-y-1">
            {sidebarItems.map((item) => (
              <button
                key={item.id}
                onClick={() => handleTabClick(item.id)}
                className={`flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  activeTab === item.id
                    ? "bg-white text-(--primary) shadow-lg shadow-white/20 scale-105 font-semibold"
                    : "text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
                }`}
              >
                
                <item.icon className={`w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform duration-200 ${
                  activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                }`} />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-2 sm:p-3 border-t border-white/20">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm rounded-xl text-red-100 hover:bg-red-500/40 hover:text-white transition-all duration-200 group border border-red-300/30 hover:border-red-300/50"
          >
            <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 transition-transform duration-200 group-hover:translate-x-1" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
