import React, { useState } from "react";
import Sidebar from "../../components/Admin Dashboard/Sidebar";
import Dashboard from "../../components/Admin Dashboard/Dashboard";
import Services from "../../components/Admin Dashboard/ServicesManage";
import RelationshipManagers from "../../components/Admin Dashboard/RmManage";
import Leads from "../../components/Admin Dashboard/LeadsManage";
import Categories from "../../components/Admin Dashboard/CategoriesManage";
import Contact from "../../components/Admin Dashboard/ContactManage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  return (
    <>
      <div className="flex h-[90vh] overflow-hidden bg-[--background)]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        <div className="w-4/5 h-[90vh] overflow-auto scrollbar-hide right-0 ml-auto">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "leads" && <Leads />}
          {activeTab === "category" && <Categories />}
          {activeTab === "contact" && <Contact />}
          {activeTab === "services" && <Services />}
          {activeTab === "relationshipManagers" && <RelationshipManagers />}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
