import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import toast from "react-hot-toast";
import axiosInstance from "../config/api";

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
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [descriptionTabs, setDescriptionTabs] = useState([]);
  
  const tabNames = ["Overview", "Process", "Requirements", "Advantages", "Services"];

  useEffect(() => {
    const handleResize = () => {
      setReviewsPerPage(window.innerWidth < 768 ? 1 : 3);
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const reviews = [
    {
      name: "Rajesh Kumar",
      company: "Tech Solutions Pvt Ltd",
      rating: 5,
      text: "Exceptional service! They handled our company registration seamlessly. The team was professional, responsive, and made the entire process stress-free. Highly recommended!",
      image: ""
    },
    {
      name: "Priya Sharma",
      company: "Creative Designs Studio",
      rating: 5,
      text: "Amazing experience with their tax filing services. The experts were knowledgeable and guided us through every step. Our business is now fully compliant thanks to them!",
      image: ""
    },
    {
      name: "Amit Patel",
      company: "Global Traders Inc",
      rating: 5,
      text: "Outstanding support for GST registration and compliance. The relationship manager assigned to us was incredibly helpful and always available to answer our questions.",
      image: ""
    },
    {
      name: "Sneha Reddy",
      company: "Fashion Boutique",
      rating: 5,
      text: "I was worried about the trademark registration process, but they made it so simple. Great communication, timely updates, and professional service throughout.",
      image: ""
    },
    {
      name: "Vikram Singh",
      company: "Manufacturing Hub",
      rating: 5,
      text: "Best decision we made was choosing them for our business setup. From documentation to final approval, everything was handled efficiently. Five-star service!",
      image: ""
    }
  ];

  const maxReviewIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;

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
    
    if (!formData.fullName.trim()) {
      toast.error("Please enter your full name");
      return;
    }

    if (!formData.email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!formData.phoneNumber.trim()) {
      toast.error("Please enter your phone number");
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, leads will be created without assignment (admin will assign)
      // If you want to auto-assign, modify the backend to handle null assignedTo
      const response = await axiosInstance.post("/public/lead", {
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        interestedService: serviceData.serviceName,
        assignedTo: null, // Will be assigned by admin
      });
      toast.success("Application submitted successfully! We'll contact you soon.");
      setFormData({ fullName: "", email: "", phoneNumber: "" });
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
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Full Name *</label>
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
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Email Address *</label>
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
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phoneNumber"
                    value={formData.phoneNumber}
                    onChange={handleFormChange}
                    placeholder="9876543210"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Selected Service</label>
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
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8">
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

      {/* Reviews Section */}
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
                      {review.image ? (
                        <img src={review.image} alt={review.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-(--primary) text-white text-xl sm:text-2xl font-semibold">
                          {review.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="text-lg sm:text-xl font-semibold text-(--text)">{review.name}</h3>
                      <p className="text-(--secondary) text-xs sm:text-sm">{review.company}</p>
                    </div>
                  </div>
                  <div className="flex gap-1 mb-2 sm:mb-3">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <span key={i} className="text-yellow-400 text-base sm:text-lg">★</span>
                    ))}
                  </div>
                  <p className="text-(--secondary) text-sm sm:text-base leading-relaxed">
                    "{review.text}"
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handleReviewPrev}
                className="text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Previous reviews"
              >
                <FaChevronLeft size={24} />
              </button>

              <div className="flex gap-3">
                {Array.from({ length: maxReviewIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setReviewIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      reviewIndex === index ? 'bg-(--primary)' : 'bg-gray-300'
                    }`}
                    aria-label={`Go to page ${index + 1}`}
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
          </div>
        </div>
      </section>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-8 relative">
            <button
              onClick={handleCloseModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-2xl"
            >
              ×
            </button>
            
            <h3 className="text-2xl font-bold mb-4 text-gray-900">Get Started</h3>
            <p className="text-gray-600 mb-6">Fill in your details and our expert will contact you shortly.</p>
            
            <form className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="email"
                placeholder="Email Address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <textarea
                placeholder="Any specific requirements? (Optional)"
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              ></textarea>
              
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
              >
                Submit Request
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceDetail;
