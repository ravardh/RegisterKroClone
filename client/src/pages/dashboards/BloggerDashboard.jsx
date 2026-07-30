import React, { useState } from "react";
import Sidebar from "../../components/Blogger Dashboard/Sidebar";
import BlogManage from "../../components/Blogger Dashboard/BlogManage";
import SEOHelmet from "../../components/SEOHelmet";

const BloggerDashboard = () => {
  const [activeTab, setActiveTab] = useState("blogs");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  return (
    <>
      <SEOHelmet
        title="Blogger Dashboard - Tax Pro Solutions"
        description="Manage blog posts from your blogger dashboard."
        keywords="blogger dashboard, blog management"
        canonicalUrl="https://taxprosolution.co.in/bloggerDashboard"
      />
      <div className="flex h-[83.5vh] overflow-hidden bg-(--background)">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
        />

        <div className="w-full lg:w-4/5 h-[83vh] overflow-auto scrollbar-hide right-0 lg:ml-auto">
          {activeTab === "blogs" && <BlogManage />}
        </div>
      </div>
    </>
  );
};

export default BloggerDashboard;
