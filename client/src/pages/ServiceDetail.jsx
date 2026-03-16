import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { MdDownload } from "react-icons/md";
import toast from "react-hot-toast";
import axiosInstance from "../config/api";
import SEOHelmet from "../components/SEOHelmet";
import { useAppData } from "../context/DataContext";
import CircularText from "../components/CircularText";

// Format price in Indian currency format with commas and .00
const formatIndianPrice = (price) => {
  if (!price) return "0.00";
  const numPrice =
    typeof price === "string"
      ? parseFloat(price.replace(/[^\d.]/g, ""))
      : price;

  if (isNaN(numPrice)) return "0.00";

  const parts = numPrice.toString().split(".");
  const integerPart = parts[0];
  const decimalPart = parts[1] ? parts[1].substring(0, 2).padEnd(2, "0") : "00";

  // Indian numbering system: group last 3 digits, then groups of 2
  let result = integerPart.replace(/\B(?=(\d{2})+(?!\d))/g, ",");
  if (integerPart.length > 3) {
    result =
      integerPart.slice(0, -3).replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
      "," +
      integerPart.slice(-3);
  }

  return `${result}.${decimalPart}`;
};

const getDocumentUrl = (url) => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);
  const [serviceData, setServiceData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    state: "",
    selectedPackage: "",
  });
  const [hasModalTriggered, setHasModalTriggered] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const [descriptionTabs, setDescriptionTabs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const { reviews: allReviews } = useAppData();
  const faqSectionRef = useRef(null);
  const tabContentRefs = useRef([]);
  const pageContainerRef = useRef(null);

  const indianStates = [
    "Andhra Pradesh",
    "Arunachal Pradesh",
    "Assam",
    "Bihar",
    "Chhattisgarh",
    "Goa",
    "Gujarat",
    "Haryana",
    "Himachal Pradesh",
    "Jharkhand",
    "Karnataka",
    "Kerala",
    "Madhya Pradesh",
    "Maharashtra",
    "Manipur",
    "Meghalaya",
    "Mizoram",
    "Nagaland",
    "Odisha",
    "Punjab",
    "Rajasthan",
    "Sikkim",
    "Tamil Nadu",
    "Telangana",
    "Tripura",
    "Uttar Pradesh",
    "Uttarakhand",
    "West Bengal",
    "Chandigarh",
    "Dadra and Nagar Haveli and Daman and Diu",
    "Lakshadweep",
    "Puducherry",
    "Delhi",
    "Ladakh",
    "Jammu and Kashmir",
  ];

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(window.innerWidth < 768 ? 1 : 3);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Auto-activate tabs on scroll
  useEffect(() => {
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.2; // 20% from top of viewport

      let closestTabIndex = 0;
      let closestDistance = Infinity;

      tabContentRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const tabTop = rect.top;

        // Distance from the trigger point (20% from top)
        const distance = Math.abs(tabTop - triggerPoint);

        // Check if this tab's content is in view and closest to trigger point
        if (
          tabTop < window.innerHeight &&
          tabTop > -rect.height &&
          distance < closestDistance
        ) {
          closestDistance = distance;
          closestTabIndex = index;
        }
      });

      setActiveTab(closestTabIndex);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [descriptionTabs.length]);

  // Clean up refs array when description tabs change
  useEffect(() => {
    tabContentRefs.current = tabContentRefs.current.slice(
      0,
      descriptionTabs.length,
    );
  }, [descriptionTabs.length]);

  // Calculate maxReviewIndex based on actual reviews from backend
  const maxReviewIndex =
    reviews.length > 0 ? Math.ceil(reviews.length / reviewsPerPage) - 1 : 0;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(
          `/public/service/${serviceId}`,
        );
        setServiceData(response.data.data);

        // Use description array directly for tabs
        if (
          Array.isArray(response.data.data.description) &&
          response.data.data.description.length > 0
        ) {
          setDescriptionTabs(response.data.data.description);
        }

        setError(null);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError(
          err.response?.data?.message || "Failed to load service details",
        );
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Filter reviews for this service from DataContext
  useEffect(() => {
    if (!serviceData?.serviceName) return;

    setIsLoadingReviews(true);
    try {
      const serviceReviews = allReviews.filter(
        (feedback) =>
          feedback.serviceAvailed?.serviceName === serviceData.serviceName,
      );
      setReviews(serviceReviews);
    } catch (error) {
      console.error("Error filtering service reviews:", error);
    } finally {
      setIsLoadingReviews(false);
    }
  }, [serviceData?.serviceName, allReviews]);

  // Intersection Observer for FAQ section - auto show modal (only once)
  useEffect(() => {
    if (hasModalTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasModalTriggered) {
            setIsModalOpen(true);
            setHasModalTriggered(true);
          }
        });
      },
      { threshold: 0.1 },
    );

    if (faqSectionRef.current) {
      observer.observe(faqSectionRef.current);
    }

    return () => {
      if (faqSectionRef.current) {
        observer.unobserve(faqSectionRef.current);
      }
    };
  }, [serviceData, hasModalTriggered]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 3000);
    return () => clearInterval(interval);
  }, [maxReviewIndex]);

  const handleReviewNext = () => {
    setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
  };

  const handleReviewPrev = () => {
    setReviewIndex((prev) => (prev <= 0 ? maxReviewIndex : prev - 1));
  };

  const visibleReviews = reviews.slice(
    reviewIndex * reviewsPerPage,
    (reviewIndex + 1) * reviewsPerPage,
  );

  const scrollToSection = (tabIndex) => {
    setActiveTab(tabIndex);
    const element = document.getElementById(`tab-${tabIndex}`);
    if (element) {
      const offset = 140; // Offset for fixed header (64px main header + 60px tab header + 16px padding)
      const elementPosition =
        element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: "smooth",
      });
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Full Name validation
    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    } else if (formData.fullName.trim().length < 2) {
      toast.error("Full name must be at least 2 characters");
      return;
    }

    // Email validation - only accept major providers
    const emailRegex = /^[^\s@]+@[^\s@]+$/;
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    // Phone number validation - only 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ""))) {
      toast.error("Invalid phone number. Please enter exactly 10 digits");
      return;
    }

    // State validation
    if (!formData.state) {
      toast.error("Please select your state");
      return;
    }

    // Package validation
    if (serviceData.packages?.length > 0 && !formData.selectedPackage) {
      toast.error("Please select a package");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/public/lead", {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        interestedService: serviceData.serviceName,
        selectedPackage: formData.selectedPackage || "N/A",
        state: formData.state,
        assignedTo: null, // Will be assigned by admin
      });
      toast.success(
        "Application submitted successfully! We'll contact you soon.",
      );
      setFormData({
        fullName: "",
        email: "",
        phoneNumber: "",
        state: "",
        selectedPackage: "",
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-(--background) min-h-screen flex items-center justify-center -mt-20 pt-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--primary) mx-auto mb-4"></div>
          <p className="text-gray-600">Loading service details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-(--background) min-h-screen flex items-center justify-center -mt-20 pt-20">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-(--primary) text-white px-6 py-2 rounded-lg hover:bg-(--primary-hover)"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  if (!serviceData) {
    return (
      <div className="bg-(--background) min-h-screen flex items-center justify-center -mt-20 pt-20">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Service not found</p>
          <button
            onClick={() => navigate("/services")}
            className="bg-(--primary) text-white px-6 py-2 rounded-lg hover:bg-(--primary-hover)"
          >
            Back to Services
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEOHelmet
        title={
          serviceData
            ? `${serviceData.serviceName} - Professional Business Services`
            : "Service Details"
        }
        description={
          serviceData
            ? serviceData.shortDescription ||
              "Get expert assistance with our professional business services"
            : "Professional business services"
        }
        keywords={
          serviceData
            ? `${serviceData.serviceName}, business services, professional help`
            : "business services"
        }
        canonicalUrl={`https://taxprosolution.co.in/services/${serviceId}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: serviceData?.serviceName || "Business Service",
          description:
            serviceData?.shortDescription || "Professional business service",
          provider: {
            "@type": "Organization",
            name: "TaxProSolution",
          },
        }}
      />
      <div className="bg-(--background) -mt-20">
        {/* Hero Section - Service Name, One Liner, PriceTag */}
        <div className="bg-linear-to-r from-amber-50 to-blue-100 text-(--text) pt-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 text-center">
            {/* Category & Subcategory badges */}
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3 justify-center">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {serviceData.category?.name}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {serviceData.subCategory?.name}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl text-(--primary) font-bold mb-2 sm:mb-3">
              {serviceData.serviceName}
            </h1>

            {serviceData.OneLinner && (
              <p className="text-sm sm:text-base md:text-lg text-(--text) font-medium mb-3 sm:mb-4 max-w-3xl mx-auto">
                {serviceData.OneLinner}
              </p>
            )}

            {serviceData.priceTag && serviceData.priceTag !== "0" && (
              <div className="inline-flex items-center bg-white/80 backdrop-blur-sm rounded-full px-4 sm:px-5 py-1.5 sm:py-2 shadow-md">
                <span className="text-xs sm:text-sm text-gray-500 mr-2">
                  Starting at
                </span>
                <span className="text-lg sm:text-xl md:text-2xl font-bold text-(--primary)">
                  ₹ {formatIndianPrice(serviceData.priceTag)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Main Content Card - Short Description + Pointers (Left) | Lead Form (Right) */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 -mt-4 sm:-mt-6 relative z-10 pb-6 sm:pb-8">
          <div className="bg-white rounded-2xl shadow-xl overflow-visible relative">
            {/* Offer Zigzag Sticker */}
            {serviceData.offer && (
              <div className="absolute -top-10 right-0 md:-right-10 z-20">
                <div className="relative">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="w-24 h-24 sm:w-28 sm:h-28 drop-shadow-lg"
                  >
                    <defs>
                      <clipPath id="zigzag-clip">
                        <path d="M60,0 L67,8 L74,2 L79,11 L87,7 L90,17 L99,15 L100,25 L109,25 L108,35 L117,38 L113,47 L120,52 L114,60 L120,68 L113,73 L117,82 L108,85 L109,95 L100,95 L99,105 L90,103 L87,113 L79,109 L74,118 L67,112 L60,120 L53,112 L46,118 L41,109 L33,113 L30,103 L21,105 L20,95 L11,95 L12,85 L3,82 L7,73 L0,68 L6,60 L0,52 L7,47 L3,38 L12,35 L11,25 L20,25 L21,15 L30,17 L33,7 L41,11 L46,2 L53,8 Z" />
                      </clipPath>
                    </defs>
                    <rect
                      width="120"
                      height="120"
                      fill="#ef4444"
                      clipPath="url(#zigzag-clip)"
                    />
                  </svg>

                  <div className="absolute inset-0 flex items-center justify-center ">
                    <CircularText
                      text="LIMITED PERIOD OFFER "
                      onHover="speedUp"
                      spinDuration={20}
                      className="custom-class"
                    />
                  </div>
                  <div className="absolute inset-0 top-[50%] left-[50%] transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-10 h-10">
                    <span className="text-white font-bold text-[12px] sm:text-[14px] text-center leading-tight max-w-16 sm:max-w-18 uppercase italic">
                      {serviceData.offer}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              {/* Left - Short Description & Top Pointers */}
              <div className="p-5 sm:p-6 md:p-8 lg:border-r border-gray-100">
                {/* <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-3 sm:mb-4">
                  About This Service
                </h2> */}
                <p className="text-sm sm:text-base text-gray-600 leading-relaxed mb-5 sm:mb-6">
                  {serviceData.shortDescription}
                </p>

                {serviceData.topPointers &&
                  serviceData.topPointers.length > 0 && (
                    <div>
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                        Key Highlights
                      </h3>
                      <div className="space-y-2.5 sm:space-y-3">
                        {serviceData.topPointers.map((pointer, index) => (
                          <div
                            key={index}
                            className="flex items-start gap-2.5 sm:gap-3"
                          >
                            <span className="text-green-600 mt-0.5 shrink-0 text-base sm:text-lg">
                              <SiTicktick />
                            </span>
                            <span className="text-gray-700 text-sm sm:text-base">
                              {pointer}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
              </div>

              {/* Right - Lead Generation Form */}
              <div ref={formRef} className="p-5 sm:p-6 md:p-8 bg-gray-50">
                <h3 className="text-base sm:text-lg md:text-xl text-center font-bold mb-3 sm:mb-4 text-(--primary)">
                  Get a Free Consultation
                </h3>
                <p className="text-xs sm:text-sm text-gray-500 text-center mb-4">
                  Enter your details to receive a full quote and expert advice
                </p>
                <form
                  onSubmit={handleFormSubmit}
                  className="space-y-3 sm:space-y-4"
                >
                  <div>
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleFormChange}
                      placeholder="Enter your full name"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleFormChange}
                      placeholder="your.email@example.com"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 10);
                        setFormData((prev) => ({
                          ...prev,
                          phoneNumber: value,
                        }));
                      }}
                      placeholder="10 digit phone number"
                      maxLength="10"
                      inputMode="numeric"
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleFormChange}
                      className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                      required
                    >
                      <option value="">Select your state</option>
                      {indianStates.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  {serviceData.packages && serviceData.packages.length > 0 && (
                    <div>
                      <select
                        name="selectedPackage"
                        value={formData.selectedPackage}
                        onChange={handleFormChange}
                        className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        required
                      >
                        <option value="">Select a package</option>
                        {serviceData.packages.map((pkg, idx) => (
                          <option key={idx} value={pkg.name}>
                            {pkg.name} - ₹ {formatIndianPrice(pkg.price)}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div>
                    <div className="w-full px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base border border-gray-200 rounded-xl bg-white text-gray-600">
                      {serviceData.category?.name} →{" "}
                      {serviceData.subCategory?.name} →{" "}
                      {serviceData.serviceName}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-(--primary) text-base sm:text-lg text-white px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-semibold hover:bg-(--primary-hover) transition-colors disabled:opacity-70"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </button>
                </form>
                <p className="text-xs text-gray-400 mt-3 text-center">
                  Our expert will contact you within 24 hours
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Packages Section */}
        {serviceData.packages && serviceData.packages.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-gray-900 mb-2">
              Choose Your Plan
            </h2>
            <p className="text-sm sm:text-base text-gray-500 text-center mb-8 sm:mb-10">
              Select the package that best suits your needs
            </p>

            <div
              className={`grid grid-cols-1 ${serviceData.packages.length === 2 ? "md:grid-cols-2 max-w-3xl" : serviceData.packages.length === 1 ? "md:grid-cols-1 max-w-md" : "md:grid-cols-3"} gap-5 sm:gap-6 mx-auto`}
            >
              {serviceData.packages.map((pkg, index) => {
                const isPopular = pkg.isMostPopular || false;

                return (
                  <div
                    key={index}
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col ${
                      isPopular
                        ? "border-2 border-(--primary) md:scale-105"
                        : "border border-gray-200"
                    }`}
                  >
                    {/* Popular badge */}
                    {isPopular && (
                      <div className="bg-(--primary) text-white text-xs font-bold text-center py-1.5 uppercase tracking-wide">
                        Most Popular
                      </div>
                    )}

                    <div className="p-5 sm:p-6 flex flex-col flex-1">
                      {/* Package Name */}
                      <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-1">
                        {pkg.name}
                      </h3>

                      {/* Price */}
                      <div className="mb-3 sm:mb-4">
                        <span className="text-2xl sm:text-3xl font-bold text-(--primary)">
                          ₹ {formatIndianPrice(pkg.price)}
                        </span>
                      </div>

                      {/* Description */}
                      {pkg.description && (
                        <p className="text-xs sm:text-sm text-gray-500 mb-4 leading-relaxed">
                          {pkg.description}
                        </p>
                      )}

                      {/* Divider */}
                      <div className="border-t border-gray-100 my-3 sm:my-4"></div>

                      {/* Features */}
                      {pkg.includedFeatures &&
                        pkg.includedFeatures.length > 0 && (
                          <div className="space-y-2.5 flex-1">
                            {pkg.includedFeatures
                              .filter((f) => f.trim())
                              .map((feature, fIndex) => (
                                <div
                                  key={fIndex}
                                  className="flex items-start gap-2.5"
                                >
                                  <SiTicktick className="text-green-500 shrink-0 mt-0.5 text-sm" />
                                  <span className="text-sm text-gray-600">
                                    {feature}
                                  </span>
                                </div>
                              ))}
                          </div>
                        )}

                      {/* CTA Button - scrolls to inline form */}
                      <button
                        onClick={() => {
                          setFormData((prev) => ({
                            ...prev,
                            selectedPackage: pkg.name,
                          }));
                          formRef.current?.scrollIntoView({
                            behavior: "smooth",
                            block: "center",
                          });
                        }}
                        className={`w-full mt-5 sm:mt-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors ${
                          isPopular
                            ? "bg-(--primary) text-white hover:bg-(--primary-hover)"
                            : "bg-gray-100 text-gray-800 hover:bg-(--primary) hover:text-white"
                        }`}
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Documents Section */}
        {serviceData.documents && serviceData.documents.length > 0 && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 pb-4 sm:pb-6 md:pb-8">
            <div className="bg-white rounded-2xl shadow-md p-5 sm:p-6 md:p-8 border border-gray-100">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                Documents
              </h2>
              <p className="text-sm text-gray-500 mb-4">
                Download required forms and reference files for this service.
              </p>
              <div className="space-y-3">
                {serviceData.documents.map((doc, index) => (
                  <div
                    key={`${doc.url}-${index}`}
                    className="flex items-center justify-between gap-3 p-3 rounded-xl border border-gray-200"
                  >
                    <p className="text-sm text-gray-700 truncate">{doc.displayName || doc.name}</p>
                    <a
                      href={getDocumentUrl(doc.url)}
                      download
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700"
                    >
                      <MdDownload className="w-4 h-4" /> Download
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Description Tabs Section */}
        {descriptionTabs.length > 0 && (
          <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
            <div className="bg-white rounded-lg shadow-sm">
              {/* Tab Navigation */}
              <div className="border-b sticky top-16 bg-white z-10 rounded-t-lg">
                <div className="flex overflow-x-auto scrollbar-hide">
                  {descriptionTabs.map((tab, index) => (
                    <button
                      key={index}
                      onClick={() => scrollToSection(index)}
                      className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold capitalize whitespace-nowrap ${
                        activeTab === index
                          ? "border-b-2 border-blue-600 text-blue-600"
                          : "text-gray-600 hover:text-blue-600"
                      }`}
                    >
                      {tab.tabs || `Tab ${index + 1}`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Content - All sections displayed */}
              <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12">
                {descriptionTabs.map((tab, index) => (
                  <div
                    ref={(el) => (tabContentRefs.current[index] = el)}
                    key={index}
                    id={`tab-${index}`}
                    className="scroll-mt-32"
                  >
                    <div
                      className="text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose max-w-none
                      prose-headings:text-gray-900 
                      prose-h2:text-xl prose-h2:sm:text-2xl prose-h2:font-bold prose-h2:mb-3 prose-h2:mt-6
                      prose-h3:text-lg prose-h3:sm:text-xl prose-h3:font-semibold prose-h3:mb-2 prose-h3:mt-4
                      prose-p:text-gray-700 prose-p:mb-3
                      prose-ol:list-decimal prose-ol:ml-6 prose-ol:mb-4
                      prose-ul:list-disc prose-ul:ml-6 prose-ul:mb-4
                      prose-li:text-gray-700 prose-li:mb-1
                      prose-table:w-full prose-table:border-collapse prose-table:my-4
                      prose-th:bg-gray-100 prose-th:border prose-th:border-gray-300 prose-th:px-4 prose-th:py-2 prose-th:text-left prose-th:font-semibold
                      prose-td:border prose-td:border-gray-300 prose-td:px-4 prose-td:py-2
                      prose-strong:font-semibold prose-strong:text-gray-900"
                      dangerouslySetInnerHTML={{ __html: tab.content }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact Us Banner */}
        <section className="cta-section max-w-7xl mx-auto my-10 md:my-20 py-6 md:py-8 bg-[url('/hero.webp')] rounded-2xl opacity-90 bg-cover bg-center">
          <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-6 sm:px-12 md:px-20 lg:px-25 gap-4 md:gap-2">
            <div className="flex-1 text-center md:text-left">
              <h2 className="text-white text-xl sm:text-2xl md:text-2xl font-bold mb-2 md:mb-3">
                Have Questions? Speak with Our Experts
              </h2>
              <p className="text-white text-sm sm:text-base md:text-lg">
                Get tailored advice on business registration, legal
                requirements, and compliance from our seasoned professional
                available to assist you anytime.
              </p>
            </div>
            <div className="md:ml-8">
              <button className="bg-(--primary) text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-base md:text-lg font-medium hover:bg-(--primary-hover) transition whitespace-nowrap">
                Call Us Now
              </button>
            </div>
          </div>
        </section>

        {/* FAQs Section - Outside Tabs */}
        {serviceData.faqs && serviceData.faqs.length > 0 && (
          <div
            ref={faqSectionRef}
            className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8"
          >
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900">
                Frequently Asked Questions
              </h2>
              <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
                {serviceData.faqs.map((faq, index) => (
                  <details
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-colors"
                  >
                    <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 text-base sm:text-lg">
                      {faq.question}
                    </summary>
                    <p className="mt-2 sm:mt-3 text-gray-600 pl-0 sm:pl-4 text-sm sm:text-base">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section - Only show if there are actual reviews */}
        {reviews.length > 0 && (
          <section className="reviews-section py-10 md:py-20 bg-(--background)">
            <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
              <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
                What Our Clients Say
              </h2>
              <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-8 md:mb-12 w-full sm:w-3/4 md:w-2/3 mx-auto px-4">
                Trusted by thousands of businesses across the country. Here's
                what they have to say about our services.
              </p>

              <div className="relative mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500 ease-in-out">
                  {visibleReviews.map((review, index) => (
                    <div
                      key={index}
                      className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg"
                    >
                      <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                          <div className="w-full h-full flex items-center justify-center bg-(--primary) text-white text-xl sm:text-2xl font-semibold">
                            {review.fullName.charAt(0)}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-lg sm:text-xl font-semibold text-(--text)">
                            {review.fullName}
                          </h3>
                          <p className="text-(--secondary) text-xs sm:text-sm">
                            {review.serviceAvailed?.serviceName || "Service"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-1 mb-2 sm:mb-3">
                        {Array.from({ length: review.starRating }).map(
                          (_, i) => (
                            <span
                              key={i}
                              className="text-yellow-400 text-base sm:text-lg"
                            >
                              ★
                            </span>
                          ),
                        )}
                      </div>
                      <p className="text-(--secondary) text-sm sm:text-base leading-relaxed">
                        "{review.message}"
                      </p>
                    </div>
                  ))}
                </div>

                {reviews.length > reviewsPerPage && (
                  <div className="flex justify-center items-center gap-4 mt-8">
                    <button
                      onClick={handleReviewPrev}
                      className="text-(--primary) hover:text-(--primary-hover) transition"
                      aria-label="Previous reviews"
                    >
                      <FaChevronLeft size={24} />
                    </button>

                    <div className="flex gap-3">
                      {Array.from({ length: maxReviewIndex + 1 }).map(
                        (_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReviewIndex(idx)}
                            className={`w-3 h-3 rounded-full transition ${
                              reviewIndex === idx
                                ? "bg-(--primary)"
                                : "bg-gray-300"
                            }`}
                            aria-label={`Go to page ${idx + 1}`}
                          />
                        ),
                      )}
                    </div>

                    <button
                      onClick={handleReviewNext}
                      className="text-(--primary) hover:text-(--primary-hover) transition"
                      aria-label="Next reviews"
                    >
                      <FaChevronRight size={24} />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Modal - triggers only when FAQ section is scrolled into view */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
              >
                ×
              </button>

              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">
                Get Started
              </h3>
              <p className="text-gray-600 mb-5 text-sm">
                Fill in your details and our expert will contact you shortly.
              </p>

              <form onSubmit={handleFormSubmit} className="space-y-3">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    placeholder="Full Name"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    placeholder="Email Address"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 10);
                      setFormData((prev) => ({ ...prev, phoneNumber: value }));
                    }}
                    placeholder="10 digit phone number"
                    maxLength="10"
                    inputMode="numeric"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    required
                  />
                </div>
                <div>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                    required
                  >
                    <option value="">Select your state</option>
                    {indianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                {serviceData.packages && serviceData.packages.length > 0 && (
                  <div>
                    <select
                      name="selectedPackage"
                      value={formData.selectedPackage}
                      onChange={handleFormChange}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                      required
                    >
                      <option value="">Select a package</option>
                      {serviceData.packages.map((pkg, idx) => (
                        <option key={idx} value={pkg.name}>
                          {pkg.name} - ₹ {formatIndianPrice(pkg.price)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-(--primary) text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-(--primary-hover) transition-colors disabled:opacity-70 text-sm"
                >
                  {isSubmitting ? "Submitting..." : "Submit Request"}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ServiceDetail;
