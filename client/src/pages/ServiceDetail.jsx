import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../config/api";
import SEOHelmet from "../components/SEOHelmet";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionTabs, setDescriptionTabs] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(false);
  const faqSectionRef = useRef(null);

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

  const tabNames = ["Overview", "Process", "Requirements", "Advantages", "Services"];

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate maxReviewIndex based on actual reviews from backend
  const maxReviewIndex = reviews.length > 0 ? Math.ceil(reviews.length / reviewsPerPage) - 1 : 0;

  useEffect(() => {
    const fetchServiceDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`/public/service/${serviceId}`);
        setServiceData(response.data.data);
        
        // Split description by # and create tabs
        if (response.data.data.description) {
          const parts = response.data.data.description
            .split('#')
            .filter(part => part.trim())
            .map(part => part.trim());
          setDescriptionTabs(parts);
        }
        
        setError(null);
      } catch (err) {
        console.error("Error fetching service details:", err);
        setError(err.response?.data?.message || "Failed to load service details");
      } finally {
        setLoading(false);
      }
    };

    if (serviceId) {
      fetchServiceDetails();
    }
  }, [serviceId]);

  // Fetch reviews/feedback for this service
  useEffect(() => {
    const fetchServiceReviews = async () => {
      if (!serviceData?.serviceName) return;
      
      try {
        setIsLoadingReviews(true);
        
        // Check sessionStorage first for cached feedback
        let allFeedback = [];
        const cachedFeedback = sessionStorage.getItem("allReviews");
        
        if (cachedFeedback) {
          allFeedback = JSON.parse(cachedFeedback);
        } else {
          // If not cached, fetch from API
          const response = await axiosInstance.get("/public/feedback");
          allFeedback = response.data.data || [];
          
          // Cache for session
          sessionStorage.setItem("allReviews", JSON.stringify(allFeedback));
        }
        
        // Filter feedback for this service
        const serviceReviews = allFeedback.filter(
          (feedback) => feedback.serviceAvailed?.serviceName === serviceData.serviceName
        );
        
        setReviews(serviceReviews);
      } catch (error) {
        console.error("Error fetching service reviews:", error);
      } finally {
        setIsLoadingReviews(false);
      }
    };

    if (serviceData?.serviceName) {
      fetchServiceReviews();
    }
  }, [serviceData?.serviceName]);

  // Intersection Observer for FAQ section - auto show modal
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsModalOpen(true);
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the FAQ section is visible
    );

    if (faqSectionRef.current) {
      observer.observe(faqSectionRef.current);
    }

    return () => {
      if (faqSectionRef.current) {
        observer.unobserve(faqSectionRef.current);
      }
    };
  }, [serviceData]);

  const handleGetStarted = () => {
    setIsModalOpen(true);
  };

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
    (reviewIndex + 1) * reviewsPerPage
  );

  const scrollToSection = (tabIndex) => {
    setActiveTab(tabIndex);
    const element = document.getElementById(`tab-${tabIndex}`);
    if (element) {
      const offset = 140; // Offset for fixed header (64px main header + 60px tab header + 16px padding)
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
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
    const allowedDomains = ['gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 'live.com', 'icloud.com', 'protonmail.com'];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      toast.error("Email is required");
      return;
    } else if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    } else {
      const emailDomain = formData.email.toLowerCase().split('@')[1];
      if (!allowedDomains.includes(emailDomain)) {
        toast.error("Invalid email domain");
        return;
      }
    }

    // Phone number validation - only 10 digits
    const phoneRegex = /^[0-9]{10}$/;
    if (!formData.phoneNumber.trim()) {
      toast.error("Phone number is required");
      return;
    } else if (!phoneRegex.test(formData.phoneNumber.replace(/\s/g, ''))) {
      toast.error("Invalid phone number. Please enter exactly 10 digits");
      return;
    }

    // State validation
    if (!formData.state) {
      toast.error("Please select your state");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axiosInstance.post("/public/lead", {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        interestedService: serviceData.serviceName,
        state: formData.state,
        assignedTo: null, // Will be assigned by admin
      });
      toast.success("Application submitted successfully! We'll contact you soon.");
      setFormData({ fullName: "", email: "", phoneNumber: "", state: "" });
      setIsModalOpen(false);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.response?.data?.message || "Failed to submit application");
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
            onClick={() => navigate('/services')}
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
            onClick={() => navigate('/services')}
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
        title={serviceData ? `${serviceData.serviceName} - Professional Business Services` : "Service Details"}
        description={serviceData ? serviceData.description || "Get expert assistance with our professional business services" : "Professional business services"}
        keywords={serviceData ? `${serviceData.serviceName}, business services, professional help` : "business services"}
        canonicalUrl={`https://taxprosolution.co.in/services/${serviceId}`}
        structuredData={{
          "@context": "https://schema.org",
          "@type": "Service",
          "name": serviceData?.serviceName || "Business Service",
          "description": serviceData?.description || "Professional business service",
          "provider": {
            "@type": "Organization",
            "name": "TaxProSolution"
          }
        }}
      />
      <div className="bg-(--background) -mt-20">

      {/* Hero Section */}
      <div className="bg-linear-to-r from-amber-50 to-blue-100  text-(--text) pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-(--primary) font-bold mb-3 sm:mb-4">{serviceData.serviceName}</h1>
              <p className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-(--text)">{serviceData.shortDescription}</p>
              
              {/* Highlights */}
              {serviceData.topPointers && serviceData.topPointers.length > 0 && (
                <div className="mb-4 sm:mb-6 flex justify-center md:justify-start">
                  <div className="space-y-2 sm:space-y-3 flex flex-col items-start">
                    {serviceData.topPointers.map((pointer, index) => (
                      <div key={index} className="flex items-center">
                        <span className="text-green-700 mr-2 sm:mr-3 text-lg sm:text-xl"><SiTicktick /></span>
                        <span className="text-(--text) font-medium text-sm sm:text-base">{pointer}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Category and Subcategory */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {serviceData.category?.name}
                </span>
                <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                  {serviceData.subCategory?.name}
                </span>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white text-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl">
              <h3 className="text-base sm:text-lg md:text-xl text-center font-bold mb-3 sm:mb-4 px-2 sm:px-4 text-(--primary)">Enter your details to receive a full quote and consultation</h3>
              <form onSubmit={handleFormSubmit} className="space-y-3 sm:space-y-4">
                <div>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleFormChange}
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setFormData((prev) => ({ ...prev, phoneNumber: value }));
                    }}
                    placeholder="10 digit phone number"
                    maxLength="10"
                    inputMode="numeric"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleFormChange}
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
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
                <div>
                  <div className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl bg-gray-50 text-gray-700">
                    {serviceData.category?.name} → {serviceData.subCategory?.name} → {serviceData.serviceName}
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-(--primary) text-base sm:text-lg text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-(--primary-hover) transition-colors disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Application"}
                </button>
              </form>
              <p className="text-xs text-gray-500 mt-3 sm:mt-4 text-center">
                Our expert will contact you within 24 hours
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {/* Tab Navigation */}
          <div className="border-b sticky top-16 bg-white z-10">
            <div className="flex overflow-x-auto scrollbar-hide">
              {descriptionTabs.map((_, index) => (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold capitalize whitespace-nowrap ${
                    activeTab === index
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tabNames[index] || `Tab ${index + 1}`}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - All sections displayed */}
          <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12">
            {descriptionTabs.map((content, index) => (
              <div key={index} id={`tab-${index}`} className="scroll-mt-32">
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
                  dangerouslySetInnerHTML={{ __html: content }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Us Banner */}
      <section className="cta-section max-w-7xl mx-auto my-10 md:my-20 py-6 md:py-8 bg-[url('/hero.jpg')] rounded-2xl opacity-90 bg-cover bg-center">
        <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-6 sm:px-12 md:px-20 lg:px-25 gap-4 md:gap-2">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white text-xl sm:text-2xl md:text-2xl font-bold mb-2 md:mb-3">
              Have Questions? Speak with Our Experts
            </h2>
            <p className="text-white text-sm sm:text-base md:text-lg">
              Get tailored advice on business registration, legal requirements, and compliance from our seasoned professional available to assist you anytime.
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
        <div ref={faqSectionRef} className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
          <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 md:p-8">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center text-gray-900">Frequently Asked Questions</h2>
            <div className="space-y-3 sm:space-y-4 max-w-4xl mx-auto">
              {serviceData.faqs.map((faq, index) => (
                <details key={index} className="bg-gray-50 rounded-lg p-4 sm:p-5 border border-gray-200 hover:border-blue-300 transition-colors">
                  <summary className="font-semibold text-gray-900 cursor-pointer hover:text-blue-600 text-base sm:text-lg">
                    {faq.question}
                  </summary>
                  <p className="mt-2 sm:mt-3 text-gray-600 pl-0 sm:pl-4 text-sm sm:text-base">{faq.answer}</p>
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
              Trusted by thousands of businesses across the country. Here's what they have to say about our services.
            </p>

            <div className="relative mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500 ease-in-out">
                {visibleReviews.map((review, index) => (
                  <div key={index} className="bg-white p-4 sm:p-6 rounded-2xl shadow-lg">
                    <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                      <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <div className="w-full h-full flex items-center justify-center bg-(--primary) text-white text-xl sm:text-2xl font-semibold">
                          {review.fullName.charAt(0)}
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-(--text)">{review.fullName}</h3>
                        <p className="text-(--secondary) text-xs sm:text-sm">{review.serviceAvailed?.serviceName || "Service"}</p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-2 sm:mb-3">
                      {Array.from({ length: review.starRating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-base sm:text-lg">★</span>
                      ))}
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
                    {Array.from({ length: maxReviewIndex + 1 }).map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => setReviewIndex(idx)}
                        className={`w-3 h-3 rounded-full transition ${
                          reviewIndex === idx ? 'bg-(--primary)' : 'bg-gray-300'
                        }`}
                        aria-label={`Go to page ${idx + 1}`}
                      />
                    ))}
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Get Started</h3>
            <p className="text-gray-600 mb-6">Fill in your details and our expert will contact you shortly.</p>
            
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
                    setFormData((prev) => ({ ...prev, phoneNumber: value }));
                  }}
                  placeholder="10 digit phone number"
                  maxLength="10"
                  inputMode="numeric"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleFormChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
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
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-70"
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
