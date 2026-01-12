import React, { useState } from "react";
import Sidebar from "../../components/Admin Dashboard/Sidebar";
import Overview from "../../components/Admin Dashboard/Overview";
import Services from "../../components/Admin Dashboard/ServicesManage";
import RelationshipManagers from "../../components/Admin Dashboard/RmManage";
import Leads from "../../components/Admin Dashboard/LeadsManage";
import Categories from "../../components/Admin Dashboard/CategoriesManage";
import Contact from "../../components/Admin Dashboard/ContactManage";
import Feedbacks from "../../components/Admin Dashboard/FeedbackManage";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <div className="flex h-[90vh] overflow-hidden bg-(--background)">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="w-full lg:w-4/5 h-[90vh] overflow-auto scrollbar-hide right-0 lg:ml-auto">
          {activeTab === "overview" && <Overview />}
          {activeTab === "leads" && <Leads />}
          {activeTab === "category" && <Categories />}
          {activeTab === "contact" && <Contact />}
          {activeTab === "services" && <Services />}
          {activeTab === "relationshipManagers" && <RelationshipManagers />}
          {activeTab === "feedbacks" && <Feedbacks />}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
