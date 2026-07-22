import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { FaChevronLeft, FaChevronRight, FaChevronDown, FaTrophy, FaUsers, FaStar, FaStarHalfAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { MdDownload, MdOutlineTrackChanges } from "react-icons/md";
import toast from "react-hot-toast";
import "quill/dist/quill.snow.css";
import axiosInstance from "../config/api";
import SEOHelmet from "../components/SEOHelmet";
import { useAppData } from "../context/DataContext";
import CircularText from "../components/CircularText";
import { motion, AnimatePresence } from "motion/react";
import {
  HiOutlineDocumentText,
  HiOutlineShare,
  HiOutlinePrinter,
} from "react-icons/hi";
import { FcGoogle } from "react-icons/fc";
import {
  IoShieldCheckmarkOutline,
  IoInformationCircleOutline,
  IoPersonOutline,
  IoDocumentAttachOutline,
  IoStarOutline,
  IoSettingsOutline,
  IoRibbonOutline,
  IoCashOutline,
} from "react-icons/io5";

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

const getWhyChooseUsCards = (service) => {
  const items = service?.whyChooseus ?? service?.whyChooseUs ?? [];
  if (!Array.isArray(items)) return [];

  return items
    .map((card) => ({
      title: String(card?.title ?? "").trim(),
      description: String(card?.description ?? "").trim(),
    }))
    .filter((card) => card.title);
};

const getTabIcon = (tabName) => {
  const name = tabName?.toLowerCase() || "";
  if (name.includes("overview"))
    return <IoInformationCircleOutline size={18} />;
  if (name.includes("eligibility")) return <IoPersonOutline size={18} />;
  if (name.includes("document")) return <IoDocumentAttachOutline size={18} />;
  if (name.includes("choose") || name.includes("benefit"))
    return <IoStarOutline size={18} />;
  if (name.includes("process") || name.includes("step"))
    return <IoSettingsOutline size={18} />;
  if (name.includes("certificate") || name.includes("award"))
    return <IoRibbonOutline size={18} />;
  if (
    name.includes("fee") ||
    name.includes("price") ||
    name.includes("penalty")
  )
    return <IoCashOutline size={18} />;
  return <HiOutlineDocumentText size={18} />;
};

const getDocumentUrl = (url) => {
  if (!url) return "#";
  if (/^https?:\/\//i.test(url)) return url;
  const base = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
  const path = url.startsWith("/") ? url : `/${url}`;
  return `${base}${path}`;
};

const coverGradients = [
  { from: "#6d28d9", to: "#7c3aed" },
  { from: "#f59e0b", to: "#d97706" },
  { from: "#10b981", to: "#059669" },
  { from: "#3b82f6", to: "#2563eb" },
  { from: "#ec4899", to: "#db2777" },
];

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [relatedServicesIndex, setRelatedServicesIndex] = useState(0);
  const [reviewIndex, setReviewIndex] = useState(0);
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
  const [hasModalTriggered, setHasModalTriggered] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTopFormVisible, setIsTopFormVisible] = useState(true);
  const [isHoveringRelated, setIsHoveringRelated] = useState(false);
  const [isOfferOpen, setIsOfferOpen] = useState(false);
  const formRef = useRef(null);
  const [descriptionTabs, setDescriptionTabs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const [relatedServices, setRelatedServices] = useState([]);
  const [isLoadingRelated, setIsLoadingRelated] = useState(false);
  const [relatedOffset, setRelatedOffset] = useState(220);
  const { reviews: allReviews } = useAppData();
  const faqSectionRef = useRef(null);
  const pageContainerRef = useRef(null);
  const tabScrollRef = useRef(null);

  // Track top form visibility for mobile sticky bar
  useEffect(() => {
    if (!formRef.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => setIsTopFormVisible(entry.isIntersecting),
      { threshold: 0.1 },
    );
    observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const scrollTabs = (direction) => {
    if (tabScrollRef.current) {
      tabScrollRef.current.scrollBy({
        left: direction * 150,
        behavior: "smooth",
      });
    }
  };

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

  // Calculate maxReviewIndex based on actual reviews from backend
  const maxReviewIndex = reviews.length > 0 ? reviews.length - 1 : 0;

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
          setActiveTab(0);
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

  // Fetch related services
  useEffect(() => {
    if (!serviceId) return;

    const fetchRelatedServices = async () => {
      try {
        setIsLoadingRelated(true);
        const response = await axiosInstance.get(
          `/public/service/${serviceId}/related`,
        );
        setRelatedServices(response.data.data || []);
      } catch (error) {
        console.error("Error fetching related services:", error);
        setRelatedServices([]);
      } finally {
        setIsLoadingRelated(false);
      }
    };

    fetchRelatedServices();
  }, [serviceId]);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setRelatedOffset(w < 640 ? 150 : w < 1024 ? 190 : 230);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setRelatedServicesIndex((prev) =>
      relatedServices.length ? Math.min(prev, relatedServices.length - 1) : 0
    );
  }, [relatedServices.length]);

  useEffect(() => {
    setRelatedServicesIndex(0);
    setIsOfferOpen(false);
  }, [serviceId]);

  // Auto-slide for Related Services
  useEffect(() => {
    if (relatedServices.length <= 1 || isHoveringRelated) return;
    const timer = setTimeout(() => {
      setRelatedServicesIndex((prev) =>
        prev >= relatedServices.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [relatedServicesIndex, relatedServices.length, isHoveringRelated]);

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

  const visibleReviews =
    reviews.length > 0 ? [reviews[Math.min(reviewIndex, reviews.length - 1)]] : [];

  const handleDescriptionTabClick = (tabIndex) => {
    setActiveTab(tabIndex);
    if (tabScrollRef.current) {
      const container = tabScrollRef.current;
      const buttons = container.querySelectorAll("button");
      const button = buttons[tabIndex];
      if (button) {
        const containerRect = container.getBoundingClientRect();
        const buttonRect = button.getBoundingClientRect();
        const prevBtn = buttons[tabIndex - 1];
        const nextBtn = buttons[tabIndex + 1];
        const relativeLeft = buttonRect.left - containerRect.left;
        const relativeRight = buttonRect.right - containerRect.left;
        if (relativeLeft < 0) {
          const extraWidth = prevBtn ? prevBtn.offsetWidth : 0;
          container.scrollBy({
            left: relativeLeft - extraWidth,
            behavior: "smooth",
          });
        } else if (relativeRight > containerRect.width) {
          const extraWidth = nextBtn ? nextBtn.offsetWidth : 0;
          container.scrollBy({
            left: relativeRight - containerRect.width + extraWidth,
            behavior: "smooth",
          });
        }
      }
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
        <div className="bg-transparent text-(--text) pt-16 relative overflow-hidden">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-5 sm:py-6 md:py-8 text-center">
            {/* Category & Subcategory badges
            <div className="flex flex-wrap gap-2 mb-2 sm:mb-3 justify-center">
              <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {serviceData.category?.name}
              </span>
              <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded-full font-medium">
                {serviceData.subCategory?.name}
              </span>
            </div> */}

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
            {/* Offer — mobile in-flow expandable (avoids overflow clipping) */}
            {serviceData.offer && (
              <div className="md:hidden border-b border-red-100 bg-red-50 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setIsOfferOpen((open) => !open)}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-red-500 px-4 py-3 text-left text-white shadow-md active:scale-[0.99]"
                  aria-expanded={isOfferOpen}
                  aria-controls="mobile-offer-panel"
                >
                  <span className="min-w-0">
                    <span className="block text-[10px] font-semibold uppercase tracking-wider text-white/80">
                      Limited Period Offer
                    </span>
                    <span className="block truncate text-sm font-bold">
                      {isOfferOpen ? "Hide offer details" : "Tap to view offer"}
                    </span>
                  </span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/20 transition-transform duration-300 ${
                      isOfferOpen ? "rotate-180" : ""
                    }`}
                  >
                    <FaChevronDown className="h-3.5 w-3.5" />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOfferOpen && (
                    <motion.div
                      id="mobile-offer-panel"
                      key="mobile-offer-panel"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 rounded-xl bg-linear-to-br from-red-500 to-red-600 p-4 text-white shadow-inner">
                        <p className="text-[10px] font-semibold uppercase tracking-wider text-white/85">
                          Special Deal
                        </p>
                        <p className="mt-1 text-2xl font-extrabold italic leading-snug">
                          {serviceData.offer}
                        </p>
                        <button
                          type="button"
                          onClick={() => {
                            setIsOfferOpen(false);
                            formRef.current?.scrollIntoView({
                              behavior: "smooth",
                              block: "center",
                            });
                          }}
                          className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-red-600"
                        >
                          Claim Now <FaChevronDown className="h-3 w-3 rotate-[-90deg]" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {/* Offer — desktop zigzag sticker */}
            {serviceData.offer && (
              <div className="absolute -top-10 -right-10 z-30 hidden md:block">
                <div className="relative">
                  <svg
                    width="120"
                    height="120"
                    viewBox="0 0 120 120"
                    className="h-28 w-28 drop-shadow-lg"
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

                  <div className="absolute inset-0 flex items-center justify-center">
                    <CircularText
                      text="LIMITED PERIOD OFFER "
                      onHover="speedUp"
                      spinDuration={20}
                      className="custom-class"
                    />
                  </div>
                  <div className="absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center">
                    <span className="max-w-16 text-center text-[14px] font-bold leading-tight text-white uppercase italic">
                      {serviceData.offer}
                    </span>
                  </div>
                </div>
              </div>
            )}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 border border-gray-200 shadow-lg rounded-2xl ">
              {/* Left - Short Description & Top Pointers */}
              <div className="p-5 sm:p-6 md:p-8">
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
              <div
                ref={formRef}
                className="p-2 sm:p-3 md:p-4 bg-gray-50 rounded-2xl"
              >
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
              <div className="col-span-1 m-3 mt-0 lg:col-span-2 lg:mt-3">
                <div className="grid grid-cols-1 gap-3 md:grid-cols-4 md:gap-5">
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-3 shadow">
                    <FcGoogle className="text-5xl" />
                    <div>
                      <p className="flex gap-1 text-sm text-amber-400">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStarHalfAlt />
                      </p>
                      <p className="text-sm text-gray-600">972 (Verified Reviews)</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 shadow">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary)/10 text-2xl text-(--primary)">
                      <FaTrophy />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">12+ Years Experience</p>
                      <p className="text-xs text-gray-500">Trusted business expertise</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-xl border border-gray-200 p-4 shadow">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary)/10 text-2xl text-(--primary)">
                      <FaUsers />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">2000+ Customers</p>
                      <p className="text-xs text-gray-500">Happy clients served</p>
                    </div>
                  </div>
                  <div
                    onClick={() => navigate("/trackStatus")}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter" || event.key === " ") {
                        navigate("/trackStatus");
                      }
                    }}
                    className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4 shadow transition-colors hover:border-(--primary) hover:bg-(--primary)/5"
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-(--primary)/10 text-2xl text-(--primary)">
                      <MdOutlineTrackChanges />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Track Status</p>
                      <p className="text-xs text-gray-500">Real-time application tracking</p>
                    </div>
                  </div>
                </div>
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
                    className={`relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden flex flex-col ${isPopular
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
                        className={`w-full mt-5 sm:mt-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm sm:text-base transition-colors ${isPopular
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
                    <p className="text-sm text-gray-700 truncate">
                      {doc.displayName || doc.name}
                    </p>
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
            <div className="flex flex-col lg:flex-row gap-8 items-stretch">
              {/* Description Tabs */}
              <div className="w-full lg:w-[70%] bg-white rounded-xl shadow-lg min-w-0 border border-gray-100 flex flex-col h-[500px] sm:h-[600px] lg:h-[650px]">
                {/* Tab Navigation */}
                <div className="border-b border-gray-100  bg-gray-50/80 backdrop-blur-md z-10 rounded-t-xl overflow-hidden">
                  <div className="relative flex items-center h-14 sm:h-16">
                    <button
                      onClick={() => scrollTabs(-1)}
                      className="shrink-0 h-full px-4 text-gray-600 hover:text-(--primary) hover:bg-white transition-all border-r border-gray-100"
                      aria-label="Scroll tabs left"
                    >
                      <FaChevronLeft size={16} />
                    </button>
                    <div
                      ref={tabScrollRef}
                      className="flex overflow-x-auto no-scrollbar flex-1"
                    >
                      {descriptionTabs.map((tab, index) => (
                        <button
                          key={index}
                          onClick={() => handleDescriptionTabClick(index)}
                          className={`px-6 py-4 sm:px-8 h-full text-sm sm:text-base font-bold capitalize transition-all duration-300 whitespace-nowrap relative flex items-center justify-center gap-2 group cursor-pointer ${activeTab === index
                            ? "text-(--primary) bg-white shadow-sm"
                            : "text-gray-600 hover:text-(--primary) hover:bg-white/40"
                            }`}
                        >
                          <span
                            className={`${activeTab === index ? "text-(--primary)" : "text-gray-600 group-hover:text-(--primary)"} transition-colors`}
                          >
                            {getTabIcon(tab.tabs)}
                          </span>
                          <span className="relative z-10">
                            {tab.tabs || `Tab ${index + 1}`}
                          </span>
                          {activeTab === index && (
                            <motion.div
                              layoutId="activeTabIndicator"
                              className="absolute bottom-0 left-0 right-0 h-px bg-(--primary)"
                            />
                          )}
                        </button>
                      ))}
                    </div>
                    <button
                      onClick={() => scrollTabs(1)}
                      className="shrink-0 h-full px-4 text-gray-400 hover:text-(--primary) hover:bg-white transition-all border-l border-gray-100"
                      aria-label="Scroll tabs right"
                    >
                      <FaChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div className="p-1 pt-3 bg-gray-50/30 flex-1 flex flex-col min-h-0">
                  {/* Active Tab Header */}
                  {/* <div className="px-6 sm:px-10 pt-8 pb-6 flex items-center gap-4 border-b border-gray-50 bg-white">
                    <div className="w-10 h-10 rounded-xl bg-(--primary)/10 flex items-center justify-center text-(--primary) shrink-0">
                      {getTabIcon(descriptionTabs[activeTab]?.tabs)}
                    </div>
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">
                        {descriptionTabs[activeTab]?.tabs || "Service Details"}
                      </h2>
                      <div className="flex items-center gap-2 mt-0.5">
                        <IoShieldCheckmarkOutline className="text-green-500" size={14} />
                        <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400">Verified Professional Resource</span>
                      </div>
                    </div>
                  </div> */}

                  {/* Active Tab Content */}
                  <div className="px-6 sm:px-10 pb-10 overflow-y-auto flex-1 no-scrollbar bg-white">
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div
                          className="service-detail-content ql-editor text-sm sm:text-base text-gray-700 leading-relaxed prose prose-sm sm:prose max-w-none !p-0
                        prose-headings:text-gray-900 prose-headings:font-black prose-headings:tracking-tight
                        prose-h2:text-2xl prose-h2:sm:text-3xl prose-h2:mb-6 prose-h2:mt-10 prose-h2:pb-4 prose-h2:border-b-2 prose-h2:border-gray-50
                        prose-h3:text-xl prose-h3:sm:text-2xl prose-h3:mb-4 prose-h3:mt-8
                        prose-p:text-gray-600 prose-p:mb-6 prose-p:leading-8

                        [&_ul]:my-3 [&_ul]:space-y-1 [&_ol]:my-3 [&_ol]:space-y-1
                        [&_li>p]:mb-1 [&_li>p:last-child]:mb-0

                        prose-img:rounded-3xl prose-img:shadow-2xl prose-img:my-12
                        prose-blockquote:border-l-8 prose-blockquote:border-(--primary) prose-blockquote:bg-blue-50/50 prose-blockquote:rounded-r-2xl prose-blockquote:py-6 prose-blockquote:px-8 prose-blockquote:italic prose-blockquote:text-lg prose-blockquote:text-blue-900
                        
                        [&_strong]:text-gray-900 [&_strong]:font-bold [&_strong]:block [&_strong]:mt-6 [&_strong]:mb-2 [&_strong]:text-sm [&_strong]:tracking-tight"
                          dangerouslySetInnerHTML={{
                            __html: descriptionTabs[activeTab]?.content || "",
                          }}
                        />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </div>
              </div>

              {/* Get Started Form - sidebar on desktop, bottom on mobile */}
              <div className="w-full lg:w-[30%] shrink-0 flex flex-col h-auto lg:h-[650px]">
                <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 flex flex-col h-full overflow-y-auto no-scrollbar">
                  <h3 className="text-xl font-bold mb-2 text-(--primary)">
                    Get Started
                  </h3>
                  <p className="text-gray-600 mb-5 text-sm">
                    Fill in your details and our expert will contact you
                    shortly.
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
                          setFormData((prev) => ({
                            ...prev,
                            phoneNumber: value,
                          }));
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
                    {serviceData.packages &&
                      serviceData.packages.length > 0 && (
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
                    <div className="py-4 space-y-4">
                      <div className="flex items-center gap-3 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-200">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                          <IoShieldCheckmarkOutline size={18} />
                        </div>
                        <p>
                          Your data is encrypted and handled by certified
                          professionals only.
                        </p>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="text-center p-2 rounded-lg bg-blue-50 border border-blue-100">
                          <p className="text-[10px] text-blue-600 font-bold uppercase">
                            Response Time
                          </p>
                          <p className="text-sm font-black text-blue-900">
                            30 Mins
                          </p>
                        </div>
                        <div className="text-center p-2 rounded-lg bg-indigo-50 border border-indigo-100">
                          <p className="text-[10px] text-indigo-600 font-bold uppercase">
                            Expert Advice
                          </p>
                          <p className="text-sm font-black text-indigo-900">
                            Free
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full bg-(--primary) text-white px-6 py-4 rounded-xl font-black hover:bg-(--primary-hover) shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 transition-all duration-300 disabled:opacity-70 text-base mt-auto"
                    >
                      {isSubmitting ? "Submitting..." : "Submit Request Now"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Mobile sticky bottom CTA - only on smaller screens, only when top form is scrolled out of view */}
        {descriptionTabs.length > 0 && !isTopFormVisible && (
          <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs text-gray-500 truncate">
                Interested in this service?
              </p>
              <p className="text-sm font-semibold text-(--primary) truncate">
                {serviceData?.serviceName}
              </p>
            </div>
            <button
              onClick={() =>
                formRef.current?.scrollIntoView({
                  behavior: "smooth",
                  block: "center",
                })
              }
              className="shrink-0 bg-(--primary) text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-(--primary-hover) transition-colors"
            >
              Get Started
            </button>
          </div>
        )}
        {/* Why Choose Us */}
        {getWhyChooseUsCards(serviceData).length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center text-gray-900 mb-3">
              Why Choose Us
            </h2>
            <p className="text-sm sm:text-base text-gray-600 text-center mb-8 sm:mb-12 max-w-2xl mx-auto">
              Discover what makes us the trusted choice for your business needs
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 divide-x divide-gray-300 border border-gray-200 rounded-lg p-6">
              {getWhyChooseUsCards(serviceData).map((card, index) => {
                const cardIcons = [IoShieldCheckmarkOutline, FaUsers, FaTrophy, IoRibbonOutline];
                const Icon = cardIcons[index % cardIcons.length];
                return (
                  <div key={index} className="px-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-bold text-gray-900">{card.title}</h3>
                      <div className=" rounded-xl bg-blue-50 text-(--primary)">
                        <Icon size={22} />
                      </div>
                    </div>
                    {card.description && (
                      <p className="text-sm text-gray-600 leading-relaxed flex-1">{card.description}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Related Services — Coverflow carousel (matches Home Featured) */}
        {relatedServices.length > 0 && (
          <section className="relative overflow-hidden bg-(--background) py-12 md:py-16">
            <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
              <div className="mx-auto mb-9 max-w-3xl text-center">
                <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm">
                  <IoMdStar className="text-sm" /> You May Also Like
                </span>
                <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
                  Related Services
                </h2>
                <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
                  Explore services that complement{" "}
                  <span className="font-medium text-(--brand-ink)">
                    {serviceData?.serviceName}
                  </span>
                </p>
              </div>

              {isLoadingRelated ? (
                <div className="py-12 text-center text-lg text-(--secondary)">
                  Loading related services...
                </div>
              ) : (
                <div
                  className="relative mx-auto max-w-5xl"
                  onMouseEnter={() => setIsHoveringRelated(true)}
                  onMouseLeave={() => setIsHoveringRelated(false)}
                >
                  {relatedServices.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={() =>
                          setRelatedServicesIndex((prev) =>
                            prev <= 0 ? relatedServices.length - 1 : prev - 1
                          )
                        }
                        className="absolute -left-8 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-left-20 lg:-left-32"
                        aria-label="Previous related service"
                      >
                        <FaChevronLeft size={18} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setRelatedServicesIndex((prev) =>
                            prev >= relatedServices.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="absolute -right-8 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-right-20 lg:-right-32"
                        aria-label="Next related service"
                      >
                        <FaChevronRight size={18} />
                      </button>
                    </>
                  )}

                  <div className="relative flex min-h-[20rem] items-center justify-center sm:min-h-[21rem] md:min-h-[22rem]">
                    {relatedServices.map((service, index) => {
                      let diff = index - relatedServicesIndex;
                      if (diff > relatedServices.length / 2)
                        diff -= relatedServices.length;
                      if (diff < -relatedServices.length / 2)
                        diff += relatedServices.length;
                      if (Math.abs(diff) > 2) return null;

                      const isActive = diff === 0;
                      const zIndex = 30 - Math.abs(diff);
                      const scale = isActive ? 1 : 1 - Math.abs(diff) * 0.12;
                      const translateX = diff * relatedOffset;
                      const opacity =
                        isActive ? 1 : Math.abs(diff) === 1 ? 0.85 : 0.6;
                      const gradient =
                        coverGradients[index % coverGradients.length];

                      return (
                        <motion.div
                          key={service._id}
                          initial={false}
                          animate={{ x: translateX, scale, zIndex, opacity }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 26,
                          }}
                          className="absolute w-[15rem] cursor-pointer sm:w-[17rem] md:w-[19rem]"
                          onClick={() => {
                            if (!isActive) setRelatedServicesIndex(index);
                          }}
                        >
                          <div
                            className={`relative flex h-[19rem] flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${isActive
                                ? "shadow-2xl ring-1 ring-(--primary)/10"
                                : "shadow-md"
                              }`}
                          >
                            <div
                              className="h-1.5 w-full shrink-0"
                              style={{
                                background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})`,
                              }}
                              aria-hidden
                            />
                            <div className="flex flex-1 flex-col p-5 sm:p-6">
                              <div className="mb-3 flex items-start justify-between">
                                <h3 className="line-clamp-2 flex-1 text-lg font-bold text-(--brand-ink) sm:text-xl">
                                  {service.serviceName}
                                </h3>
                                <span
                                  className="ml-2 text-xl"
                                  style={{ color: gradient.from }}
                                >
                                  <IoMdStar />
                                </span>
                              </div>
                              <p className="mb-4 line-clamp-3 flex-1 text-sm text-(--secondary)">
                                {service.shortDescription ||
                                  "Comprehensive service for your business needs."}
                              </p>
                              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs">
                                <span className="rounded-full bg-(--primary)/10 px-3 py-1 font-medium text-(--primary)">
                                  {service.category?.name || "Category"}
                                </span>
                              </div>
                              <Link
                                to={`/service/${service._id}`}
                                onClick={(e) => {
                                  if (!isActive) e.preventDefault();
                                }}
                                className="mt-auto flex items-center justify-center gap-2 rounded-lg border-2 border-(--primary) px-4 py-2 text-sm font-semibold text-(--primary) transition hover:bg-(--primary) hover:text-white"
                              >
                                View Details{" "}
                                <FaArrowRightLong className="h-4 w-4" />
                              </Link>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                  {relatedServices.length > 1 && (
                    <div className="mt-6 flex justify-center gap-2">
                      {relatedServices.map((service, index) => (
                        <button
                          key={service._id}
                          type="button"
                          onClick={() => setRelatedServicesIndex(index)}
                          className={`h-1.5 rounded-full transition-all ${relatedServicesIndex === index
                              ? "w-8 bg-(--primary)"
                              : "w-1.5 bg-slate-300 hover:bg-slate-400"
                            }`}
                          aria-label={`Go to related service ${index + 1}`}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        )}

        {/* What Clients Say + FAQ — 1×2 grid */}
        {(reviews.length > 0 || (serviceData.faqs && serviceData.faqs.length > 0)) && (
          <div
            ref={faqSectionRef}
            className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-10 md:py-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">
              {/* What Our Clients Say */}
              {reviews.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8 h-full">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    What Our Clients Say
                  </h2>
                  <p className="text-sm text-gray-500 mb-6">
                    Trusted feedback from businesses we have helped.
                  </p>

                  {visibleReviews.map((review, index) => (
                    <div key={index} className="bg-gray-50 rounded-xl p-4 sm:p-5 border border-gray-100">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-11 h-11 rounded-full bg-(--primary) text-white flex items-center justify-center font-semibold shrink-0">
                          {review.fullName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <h3 className="font-semibold text-gray-900 truncate">{review.fullName}</h3>
                          <p className="text-xs text-gray-500 truncate">
                            {review.serviceAvailed?.serviceName || "Service"}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: review.starRating }).map((_, i) => (
                          <span key={i} className="text-yellow-400 text-sm">★</span>
                        ))}
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">"{review.message}"</p>
                    </div>
                  ))}

                  {reviews.length > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-5">
                      <button
                        onClick={handleReviewPrev}
                        className="text-(--primary) hover:text-(--primary-hover) transition"
                        aria-label="Previous review"
                      >
                        <FaChevronLeft size={20} />
                      </button>
                      <div className="flex gap-2">
                        {Array.from({ length: maxReviewIndex + 1 }).map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setReviewIndex(idx)}
                            className={`w-2 h-2 rounded-full transition ${reviewIndex === idx ? "bg-(--primary)" : "bg-gray-300"
                              }`}
                            aria-label={`Go to review ${idx + 1}`}
                          />
                        ))}
                      </div>
                      <button
                        onClick={handleReviewNext}
                        className="text-(--primary) hover:text-(--primary-hover) transition"
                        aria-label="Next review"
                      >
                        <FaChevronRight size={20} />
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* FAQ */}
              {serviceData.faqs && serviceData.faqs.length > 0 && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-5 sm:p-6 md:p-8 h-full">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                    Frequently Asked Questions
                  </h2>
                  <div className="h-[50vh] space-y-3 overflow-y-auto no-scrollbar pr-1">
                    {serviceData.faqs.map((faq, index) => (
                      <details
                        key={index}
                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 text-sm sm:text-base">
                          {faq.question}
                        </summary>
                        <p className="mt-2 text-gray-600 text-sm leading-relaxed">
                          {faq.answer}
                        </p>
                      </details>
                    ))}

                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Modal - triggers only when FAQ section is scrolled into view */}
        {isModalOpen && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto no-scrollbar">
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
