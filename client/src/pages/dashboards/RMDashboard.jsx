import React, { useState } from "react";
import Sidebar from "../../components/RM Dashboard/Sidebar";
import Dashboard from "../../components/RM Dashboard/Dashboard";
import LeadStatus from "../../components/RM Dashboard/LeadStatus";
import SEOHelmet from "../../components/SEOHelmet";

const RMDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <SEOHelmet
        title="RM Dashboard - Tax Pro Solution"
        description="Manage your assigned leads, track lead status, and monitor your sales activities from your personal dashboard."
        keywords="rm dashboard, lead management, sales dashboard, relationship manager"
        canonicalUrl="https://taxprosolution.co.in/rmDashboard"
      />
      <div className="flex h-[83.5vh] overflow-hidden bg-(--background)">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="w-full lg:w-4/5 h-[83vh] overflow-auto scrollbar-hide right-0 lg:ml-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "leadstatus" && <LeadStatus />}
        </div>
      </div>
    </>
  );
};

export default RMDashboard;
