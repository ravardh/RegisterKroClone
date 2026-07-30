import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../config/api";
import SEOHelmet from "../components/SEOHelmet";
import { useAppData } from "../context/DataContext";
import { motion, AnimatePresence } from "motion/react";
import { FiArrowRight, FiSearch, FiX } from "react-icons/fi";
import { HiOutlineSparkles } from "react-icons/hi2";

const CATEGORY_GRADIENTS = [
  { from: "#3b82f6", to: "#6366f1", light: "#eff6ff" },
  { from: "#a855f7", to: "#ec4899", light: "#faf5ff" },
  { from: "#f97316", to: "#ef4444", light: "#fff7ed" },
  { from: "#10b981", to: "#06b6d4", light: "#f0fdf4" },
  { from: "#f59e0b", to: "#f97316", light: "#fffbeb" },
  { from: "#6366f1", to: "#3b82f6", light: "#eef2ff" },
];

const Services = () => {
  const servicesSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Our Services",
    description: "Comprehensive business and tax services",
  };

  const navigate = useNavigate();
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState(null);
  const [activeSubCategory, setActiveSubCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [allServices, setAllServices] = useState([]);
  const tabsRef = useRef(null);

  const {
    categories: allCategoriesData,
    subCategories: subCategoriesData,
    services: servicesData,
  } = useAppData();

  const stats = [
    { number: "2000+", label: "Happy Clients" },
    { number: "50+", label: "Expert Team" },
    { number: "98%", label: "Success Rate" },
    { number: "15+", label: "Years Experience" },
    { number: "24/7", label: "Support" },
  ];

  // Load categories
  useEffect(() => {
    if (allCategoriesData.length > 0) {
      setCategories(allCategoriesData);
      setActiveCategory(allCategoriesData[0]);
    } else {
      const fetchCategories = async () => {
        try {
          const response = await axiosInstance.get("/public/categories");
          const data = response.data.data || [];
          setCategories(data);
          if (data.length > 0) setActiveCategory(data[0]);
        } catch (error) {
          console.error("Error fetching categories:", error);
        }
      };
      fetchCategories();
    }
  }, [allCategoriesData]);

  // When active category changes → load its subcategories
  useEffect(() => {
    if (!activeCategory) return;
    const subs = subCategoriesData[activeCategory._id] || [];
    setSubCategories(subs);
    setActiveSubCategory(subs[0] || null);
  }, [activeCategory, subCategoriesData]);

  // When active subcategory changes → load its services
  useEffect(() => {
    if (!activeSubCategory) {
      setServices([]);
      return;
    }
    setServices(servicesData[activeSubCategory._id] || []);
  }, [activeSubCategory, servicesData]);

  // Build flat all-services list for search
  useEffect(() => {
    const flat = [];
    Object.values(servicesData).forEach((arr) => {
      arr.forEach((s) => flat.push(s));
    });
    setAllServices(flat);
  }, [servicesData]);

  // Handle navigation state (from header search etc.)
  useEffect(() => {
    const name = location.state?.selectedCategoryName;
    if (name && categories.length > 0) {
      const cat = categories.find(
        (c) => c?.name?.toLowerCase() === name.toLowerCase()
      );
      if (cat) {
        setActiveCategory(cat);
        window.history.replaceState({}, document.title);
      }
    }
  }, [categories, location.state]);

  const filteredServices = searchQuery.trim()
    ? allServices.filter((s) =>
        s.serviceName?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : services;

  const gradientFor = (index) =>
    CATEGORY_GRADIENTS[index % CATEGORY_GRADIENTS.length];

  return (
    <>
      <SEOHelmet
        title="Our Services - Business Registration, GST & Compliance | Tax Pro Solution"
        description="Explore our comprehensive business services including company registration, GST filing, compliance, and tax solutions."
        keywords="business services, company registration, GST filing, tax compliance"
        canonicalUrl="https://taxprosolution.co.in/services"
        structuredData={servicesSchema}
      />

      <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50/30 to-indigo-50/40 -mt-20">
        {/* ── Hero Banner ── */}
        <div
          className="relative overflow-hidden pt-28 pb-16 px-4"
          style={{
            background:
              "linear-gradient(135deg, #0d4dbf 0%, #1a6bd4 40%, #2563eb 70%, #4f46e5 100%)",
          }}
        >
          {/* Decorative blobs */}
          <div
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-20 blur-3xl"
            style={{ background: "radial-gradient(circle, #60a5fa, transparent)" }}
          />
          <div
            className="absolute -bottom-16 -left-16 w-72 h-72 rounded-full opacity-15 blur-3xl"
            style={{ background: "radial-gradient(circle, #a78bfa, transparent)" }}
          />

          <div className="relative max-w-6xl mx-auto text-center">
            <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm border border-white/20 text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 tracking-wide uppercase">
              <HiOutlineSparkles className="text-yellow-300" />
              Comprehensive Business Solutions
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4 leading-tight">
              All Our Services
            </h1>
            <p className="text-white/80 text-base sm:text-lg max-w-2xl mx-auto mb-10">
              From business registration to tax compliance — explore everything
              we offer for your business growth.
            </p>

            {/* Search bar */}
            <div className="relative max-w-xl mx-auto">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any service..."
                className="w-full pl-11 pr-10 py-3.5 rounded-2xl text-gray-800 text-sm sm:text-base shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Stats strip */}
          <div className="relative max-w-4xl mx-auto mt-12 grid grid-cols-3 sm:grid-cols-5 gap-4">
            {stats.map((s, i) => (
              <div key={i} className="text-center">
                <div className="text-xl sm:text-2xl font-extrabold text-white">
                  {s.number}
                </div>
                <div className="text-[10px] sm:text-xs text-white/70 font-medium mt-0.5 uppercase tracking-wide">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Content ── */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Search results mode */}
          {searchQuery.trim() ? (
            <div>
              <p className="text-sm text-gray-500 mb-6">
                Showing{" "}
                <span className="font-semibold text-gray-800">
                  {filteredServices.length}
                </span>{" "}
                results for{" "}
                <span className="font-semibold text-blue-600">
                  "{searchQuery}"
                </span>
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredServices.length === 0 ? (
                  <div className="col-span-full text-center py-20 text-gray-400">
                    No services found. Try a different keyword.
                  </div>
                ) : (
                  filteredServices.map((service) => (
                    <ServiceCard
                      key={service._id}
                      service={service}
                      onClick={() => navigate(`/service/${service._id}`)}
                      gradient={gradientFor(0)}
                    />
                  ))
                )}
              </div>
            </div>
          ) : (
            <>
              {/* ── Category Tabs ── */}
              {categories.length > 0 && (
                <div className="mb-8">
                  <div
                    ref={tabsRef}
                    className="flex gap-3 overflow-x-auto no-scrollbar pb-2"
                  >
                    {categories.map((cat, i) => {
                      const g = gradientFor(i);
                      const isActive = activeCategory?._id === cat._id;
                      return (
                        <button
                          key={cat._id}
                          onClick={() => {
                            setActiveCategory(cat);
                            setSearchQuery("");
                          }}
                          className="shrink-0 flex items-center gap-2 px-5 py-2.5 rounded-2xl text-sm font-semibold transition-all duration-300 whitespace-nowrap"
                          style={
                            isActive
                              ? {
                                  background: `linear-gradient(135deg, ${g.from}, ${g.to})`,
                                  color: "#fff",
                                  boxShadow: `0 4px 14px ${g.from}55`,
                                }
                              : {
                                  background: "#fff",
                                  color: "#374151",
                                  border: "1px solid var(--border)",
                                }
                          }
                        >
                          <span
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{
                              background: isActive ? "#fff" : g.from,
                            }}
                          />
                          {cat.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ── Subcategory pills + Services ── */}
              <div className="flex flex-col lg:flex-row gap-6">
                {/* Sidebar subcategories */}
                <aside className="lg:w-56 xl:w-64 shrink-0">
                  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3 sticky top-24">
                    <p className="text-xs font-bold text-gray-400 uppercase tracking-widest px-2 mb-3">
                      Subcategories
                    </p>
                    <div className="flex flex-col gap-1">
                      {subCategories.length === 0 ? (
                        <div className="text-xs text-gray-400 px-2 py-4 text-center">
                          No subcategories
                        </div>
                      ) : (
                        subCategories.map((sub) => {
                          const isActive = activeSubCategory?._id === sub._id;
                          const g = gradientFor(
                            categories.findIndex(
                              (c) => c._id === activeCategory?._id
                            )
                          );
                          return (
                            <button
                              key={sub._id}
                              onClick={() => setActiveSubCategory(sub)}
                              className="w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                              style={
                                isActive
                                  ? {
                                      background: g.light,
                                      color: g.from,
                                      fontWeight: 700,
                                    }
                                  : {
                                      color: "var(--text-light)",
                                    }
                              }
                            >
                              {sub.name}
                            </button>
                          );
                        })
                      )}
                    </div>
                  </div>
                </aside>

                {/* Services grid */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-5">
                    <div>
                      <h2 className="text-lg font-bold text-gray-900">
                        {activeSubCategory?.name || activeCategory?.name}
                      </h2>
                      <p className="text-sm text-gray-500">
                        {subCategories.length === 0
                          ? "No services available"
                          : `${services.length} service${services.length !== 1 ? "s" : ""} available`}
                      </p>
                    </div>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeSubCategory?._id || activeCategory?._id || "empty"}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.22 }}
                      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                    >
                      {subCategories.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-400">
                          No subcategories or services available yet.
                        </div>
                      ) : services.length === 0 ? (
                        <div className="col-span-full text-center py-20 text-gray-400">
                          No services in this subcategory yet.
                        </div>
                      ) : (
                        services.map((service, i) => (
                          <ServiceCard
                            key={service._id}
                            service={service}
                            onClick={() => navigate(`/service/${service._id}`)}
                            gradient={gradientFor(
                              categories.findIndex(
                                (c) => c._id === activeCategory?._id
                              )
                            )}
                            delay={i * 0.04}
                          />
                        ))
                      )}
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

/* ── Service Card Component ── */
const ServiceCard = ({ service, onClick, gradient, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay }}
      onClick={onClick}
      className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
    >
      {/* Top accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
        }}
      />

      <div className="p-5 flex flex-col flex-1">
        {/* Category badge */}
        {service.category?.name && (
          <span
            className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full self-start mb-3"
            style={{ background: gradient.light, color: gradient.from }}
          >
            {service.category.name}
          </span>
        )}

        <h3 className="text-sm sm:text-base font-bold text-gray-900 leading-snug mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {service.serviceName}
        </h3>

        {service.shortDescription && (
          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1 mb-4">
            {service.shortDescription}
          </p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-50">
          {service.priceTag && service.priceTag !== "0" ? (
            <span
              className="text-sm font-bold"
              style={{ color: gradient.from }}
            >
              ₹{Number(service.priceTag).toLocaleString("en-IN")}
            </span>
          ) : (
            <span className="text-xs text-gray-400 italic">Price on request</span>
          )}
          <span
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full transition-all duration-200 group-hover:gap-2"
            style={{ background: gradient.light, color: gradient.from }}
          >
            View <FiArrowRight className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default Services;
