import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaHome, FaInfoCircle, FaServicestack, FaTasks, FaEnvelope, FaCommentDots, FaShieldAlt, FaFileContract } from "react-icons/fa";
import axiosInstance from "../config/api";
import SEOHelmet from "../components/SEOHelmet";

const Sitemap = () => {
  const sitemapSchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "name": "Sitemap",
    "description": "Sitemap of all pages available on TaxProSolution"
  };
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/public/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const mainPages = [
    { name: "Home", path: "/", icon: <FaHome /> },
    { name: "About Us", path: "/about", icon: <FaInfoCircle /> },
    { name: "Services", path: "/services", icon: <FaServicestack /> },
    { name: "Track Status", path: "/trackStatus", icon: <FaTasks /> },
    { name: "Contact Us", path: "/contact", icon: <FaEnvelope /> },
    { name: "Feedback", path: "/feedback", icon: <FaCommentDots /> },
  ];

  const legalPages = [
    { name: "Privacy Policy", path: "/privacy", icon: <FaShieldAlt /> },
    { name: "Terms & Conditions", path: "/terms", icon: <FaFileContract /> },
  ];

  return (
    <>
      <SEOHelmet
        title="Sitemap - TaxProSolution Website Navigation"
        description="Browse the complete sitemap of TaxProSolution. Find all pages, services, and navigation links to explore our website."
        keywords="sitemap, navigation, site map, pages"
        canonicalUrl="https://taxprosolution.co.in/sitemap"
        structuredData={sitemapSchema}
      />
      <div className="bg-gray-50 -mt-20 pt-20 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Sitemap</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Navigate through all the pages and services available on our website. Find what you're looking for quickly and easily.
          </p>
        </div>

        <div className="space-y-8">
          {/* Main Pages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-blue-100 p-2 rounded-lg mr-3">
                <FaHome className="text-blue-600" />
              </span>
              Main Pages
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mainPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.path}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-all group"
                >
                  <span className="text-2xl text-gray-400 group-hover:text-blue-600 mr-3">
                    {page.icon}
                  </span>
                  <span className="text-gray-700 group-hover:text-blue-600 font-medium">
                    {page.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Services by Category */}
          {loading ? (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading services...</p>
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
                <span className="bg-green-100 p-2 rounded-lg mr-3">
                  <FaServicestack className="text-green-600" />
                </span>
                Our Services
              </h2>
              
              {categories.length > 0 ? (
                <div className="space-y-6">
                  {categories.map((category, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h3 className="text-xl font-semibold text-gray-900 mb-3">
                        {category.name}
                      </h3>
                      <p className="text-gray-600 text-sm mb-3">{category.description}</p>
                      
                      {category.subcategories && category.subcategories.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                          {category.subcategories.map((subcategory, subIndex) => (
                            <div
                              key={subIndex}
                              className="bg-gray-50 p-3 rounded-lg border border-gray-200"
                            >
                              <p className="text-gray-700 font-medium text-sm">
                                {subcategory.name}
                              </p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 text-sm italic">No subcategories available</p>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-600 text-center py-4">No service categories available at the moment.</p>
              )}
            </div>
          )}

          {/* Legal Pages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-purple-100 p-2 rounded-lg mr-3">
                <FaShieldAlt className="text-purple-600" />
              </span>
              Legal & Policies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {legalPages.map((page, index) => (
                <Link
                  key={index}
                  to={page.path}
                  className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all group"
                >
                  <span className="text-2xl text-gray-400 group-hover:text-purple-600 mr-3">
                    {page.icon}
                  </span>
                  <span className="text-gray-700 group-hover:text-purple-600 font-medium">
                    {page.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* Account Pages */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
              <span className="bg-orange-100 p-2 rounded-lg mr-3">
                <FaTasks className="text-orange-600" />
              </span>
              Account & Dashboard
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/login"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                  Login
                </span>
              </Link>
              <Link
                to="/register"
                className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-all group"
              >
                <span className="text-gray-700 group-hover:text-orange-600 font-medium">
                  Register
                </span>
              </Link>
              <div className="flex items-center p-4 border border-gray-200 rounded-lg bg-gray-100">
                <span className="text-gray-500 font-medium">
                  Dashboards (Login Required)
                </span>
              </div>
            </div>
          </div>

          {/* Quick Contact */}
          <div className="bg-[url('/hero.jpg')] bg-cover bg-center rounded-lg shadow-sm p-8 text-white text-center relative">
            <div className="absolute inset-0 bg-black/40 rounded-lg"></div>
            <div className="relative z-10">
              <h2 className="text-2xl font-semibold mb-3">Can't Find What You're Looking For?</h2>
              <p className="mb-6">
                Our team is here to help. Get in touch with us for personalized assistance.
              </p>
              <Link
                to="/contact"
                className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
              >
                Contact Us
              </Link>
            </div>
          </div>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-block bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Back to Home
          </Link>
        </div>
      </div>
      </div>
    </>
  );
};

export default Sitemap;
