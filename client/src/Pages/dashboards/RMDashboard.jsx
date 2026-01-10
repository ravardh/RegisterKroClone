import React, { useState } from "react";
import Sidebar from "../../components/RM Dashboard/Sidebar";
import Dashboard from "../../components/RM Dashboard/Dashboard";
import LeadStatus from "../../components/RM Dashboard/LeadStatus";

const RMDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <>
      <div className="flex h-[90vh] overflow-hidden bg-[--background)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-4/5 h-[90vh] overflow-auto scrollbar-hide right-0 ml-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "leadstatus" && <LeadStatus />}
        </div>
      </div>
    </>
  );
};

export default RMDashboard;
