import React, { useState } from "react";
import Sidebar from "../../components/Admin Dashboard/Sidebar";
import Overview from "../../components/Admin Dashboard/Overview";
import Services from "../../components/Admin Dashboard/ServicesManage";
import EmpManage from "../../components/Admin Dashboard/EmpManage";
import Leads from "../../components/Admin Dashboard/LeadsManage";
import Categories from "../../components/Admin Dashboard/CategoriesManage";
import Contact from "../../components/Admin Dashboard/ContactManage";
import Feedbacks from "../../components/Admin Dashboard/FeedbackManage";
import BlogManage from "../../components/Admin Dashboard/BlogManage";
import TeamManage from "../../components/Admin Dashboard/TeamManage";
import CareersManage from "../../components/Admin Dashboard/CareersManage";
import OfferManage from "../../components/Admin Dashboard/OfferManage";
import SEOHelmet from "../../components/SEOHelmet";

const SuperAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <SEOHelmet
        title="Super Admin Dashboard - Tax Pro Solution"
        description="Manage services, leads, categories, employees, and customer feedback from your super admin dashboard."
        keywords="super admin dashboard, service management, lead management, business admin"
        canonicalUrl="https://taxprosolution.co.in/superAdminDashboard"
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
          {activeTab === "employees" && <EmpManage />}
          {activeTab === "feedbacks" && <Feedbacks />}
          {activeTab === "blogs" && <BlogManage />}
          {activeTab === "careers" && <CareersManage />}
          {activeTab === "specialOffer" && <OfferManage />}
          {activeTab === "ourTeam" && <TeamManage />}
        </div>
      </div>
    </>
  );
};

export default SuperAdminDashboard;
