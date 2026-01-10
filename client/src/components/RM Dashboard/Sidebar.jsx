import React from "react";
import { FaChartBar, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ activeTab, setActiveTab }) => {
  const navigate = useNavigate();
  const sidebarItems = [
    { id: "dashboard", label: "Dashboard", icon: FaChartBar },
    { id: "leadstatus", label: "Lead Status", icon: FaClipboardList },
  ];

  const handleLogout = () => {
    toast.success("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="w-1/5 h-full shadow-2xl flex flex-col overflow-y-auto scrollbar-hide bg-[url('/hero.jpg')] bg-cover">
      <div className="p-6 flex-1 overflow-y-auto">
        <div className="mb-8 mt-4">
          <h1 className="text-2xl font-bold text-white mb-1">RM Dashboard</h1>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex items-center w-full px-4 py-3 text-sm rounded-xl transition-all duration-200 group relative overflow-hidden ${
                activeTab === item.id
                  ? "bg-white text-[#4F46E5] shadow-lg shadow-white/20 scale-105 font-semibold"
                  : "text-white/80 hover:bg-white/10 hover:text-white hover:translate-x-1"
              }`}
            >
              <item.icon
                className={`w-5 h-5 mr-3 transition-transform duration-200 ${
                  activeTab === item.id ? "scale-110" : "group-hover:scale-110"
                }`}
              />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="p-6 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-4 py-3 text-sm rounded-xl text-red-100 hover:bg-red-500/20 hover:text-white transition-all duration-200 group border border-red-300/30 hover:border-red-300/50"
        >
          <FaSignOutAlt className="w-5 h-5 mr-3 transition-transform duration-200 group-hover:translate-x-1" />
          <span className="font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
