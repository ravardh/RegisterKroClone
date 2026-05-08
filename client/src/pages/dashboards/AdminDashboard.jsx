import React, { useState } from "react";
import Sidebar from "../../components/Admin Dashboard/Sidebar";
import Overview from "../../components/Admin Dashboard/Overview";
import Services from "../../components/Admin Dashboard/ServicesManage";
import RelationshipManagers from "../../components/Admin Dashboard/RmManage";
import Leads from "../../components/Admin Dashboard/LeadsManage";
import Categories from "../../components/Admin Dashboard/CategoriesManage";
import Contact from "../../components/Admin Dashboard/ContactManage";
import Feedbacks from "../../components/Admin Dashboard/FeedbackManage";
import BlogManage from "../../components/Admin Dashboard/BlogManage";
import SEOHelmet from "../../components/SEOHelmet";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <SEOHelmet
        title="Admin Dashboard - TaxProSolution"
        description="Manage services, leads, categories, relationship managers, and customer feedback from your admin dashboard."
        keywords="admin dashboard, service management, lead management, business admin"
        canonicalUrl="https://taxprosolution.co.in/adminDashboard"
      />
      <div className="flex h-[83.5vh] overflow-hidden bg-(--background)">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="w-full lg:w-4/5 h-[83vh] overflow-auto scrollbar-hide right-0 lg:ml-auto">
          {activeTab === "overview" && <Overview />}
          {activeTab === "leads" && <Leads />}
          {activeTab === "category" && <Categories />}
          {activeTab === "contact" && <Contact />}
          {activeTab === "services" && <Services />}
          {activeTab === "relationshipManagers" && <RelationshipManagers />}
          {activeTab === "feedbacks" && <Feedbacks />}
          {activeTab === "blogs" && <BlogManage />}
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
