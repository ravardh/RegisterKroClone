import React, { useState } from "react";
import Sidebar from "../../components/Admin Dashboard/Sidebar";
import Applications from "../../components/Admin Dashboard/Applications";
import Dashboard from "../../components/Admin Dashboard/Dashboard";
import Services from "../../components/Admin Dashboard/Services";
import RelationshipManagers from "../../components/Admin Dashboard/RelationshipManagers";
import Assignments from "../../components/Admin Dashboard/Assignments";


const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <>
      <div className="flex min-h-screen overflow-hidden" style={{ backgroundColor: 'var(--background)' }}>
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-4/5 h-full overflow-auto scrollbar-hide right-0 ml-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "applications" && <Applications />}
          {activeTab === "assignments" && <Assignments />}
          {activeTab === "services" && <Services />}
          {activeTab === "relationshipManagers" && <RelationshipManagers />}
          
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
