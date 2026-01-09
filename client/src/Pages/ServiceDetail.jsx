import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SiTicktick } from "react-icons/si";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const ServiceDetail = () => {
  const { category, subcategory, service } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);

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

  // Demo service data - will be replaced with dynamic data later
  const serviceData = {
    title: "Private Limited Company Registration",
    category: "Company Registration",
    rating: 4.8,
    reviews: 1250,
    completedOrders: 5000,
    description: "Register your Private Limited Company with ease. Get your business legally incorporated and start operations with complete compliance.",
    highlights: [
      "100% Online Process",
      "Quick 7-10 Days Registration",
      "Expert CA/CS Assistance",
      "Government Fee Included",
      "Free Consultation",
      "Post Registration Support"
    ],
    whatYouGet: [
      "Company Incorporation Certificate",
      "PAN & TAN",
      "Digital Signature Certificate (2 DSC)",
      "DIN for 2 Directors",
      "Company Name Approval",
      "MOA & AOA Drafting",
      "Share Certificates",
      "First Year Annual Filing Support"
    ],
    process: [
      {
        step: 1,
        title: "Submit Documents",
        description: "Upload required documents through our secure portal"
      },
      {
        step: 2,
        title: "Name Approval",
        description: "We get your company name approved from MCA"
      },
      {
        step: 3,
        title: "DSC & DIN",
        description: "Digital Signature and Director Identification Number"
      },
      {
        step: 4,
        title: "File Incorporation",
        description: "File SPICe+ form with Registrar of Companies"
      },
      {
        step: 5,
        title: "Get Certificate",
        description: "Receive Certificate of Incorporation & PAN/TAN"
      }
    ],
    requirements: [
      "PAN Card of all Directors",
      "Aadhaar Card of all Directors",
      "Passport size photographs",
      "Address proof of registered office",
      "Electricity bill or rent agreement",
      "NOC from property owner"
    ],
    advantages: [
      {
        title: "Limited Liability Protection",
        description: "Shareholders' personal assets are protected from business liabilities"
      },
      {
        title: "Separate Legal Entity",
        description: "Company exists as a separate legal entity independent of its owners"
      },
      {
        title: "Easy Fundraising",
        description: "Easier to raise funds from investors, banks, and financial institutions"
      },
      {
        title: "Perpetual Succession",
        description: "Company continues to exist even if shareholders change"
      },
      {
        title: "Credibility & Trust",
        description: "Enhanced brand value and credibility with customers and partners"
      },
      {
        title: "Tax Benefits",
        description: "Various tax exemptions and deductions available for companies"
      }
    ],
    ourServices: [
      {
        title: "Complete Documentation",
        description: "We handle all paperwork including MOA, AOA, and incorporation forms",
        icon: "📄"
      },
      {
        title: "Name Approval Assistance",
        description: "Expert guidance in selecting and getting approval for your company name",
        icon: "✅"
      },
      {
        title: "DSC & DIN Processing",
        description: "Quick processing of Digital Signature Certificate and Director Identification Number",
        icon: "🔐"
      },
      {
        title: "Compliance Support",
        description: "First year compliance support including annual filing assistance",
        icon: "📋"
      },
      {
        title: "Expert Consultation",
        description: "Free consultation with CA/CS for business structure planning",
        icon: "👨‍💼"
      },
      {
        title: "Post-Registration Support",
        description: "Ongoing support for bank account opening and other requirements",
        icon: "🤝"
      }
    ],
    faqs: [
      {
        question: "What is a Private Limited Company?",
        answer: "A Private Limited Company is a type of business entity that offers limited liability protection to its shareholders and restricts the transfer of shares."
      },
      {
        question: "How long does registration take?",
        answer: "The entire process typically takes 7-10 working days, subject to government processing time and document availability."
      },
      {
        question: "What are the minimum requirements?",
        answer: "You need minimum 2 directors, 2 shareholders, and a registered office address in India."
      },
      {
        question: "Is physical presence required?",
        answer: "No, the entire process can be completed online without any physical visit."
      }
    ]
  };

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

  const scrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 100; // Offset for fixed header
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-(--background) -mt-16">

      {/* Hero Section */}
      <div className="bg-linear-to-r from-amber-50 to-blue-100 min-h-screen text-(--text) pt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 py-8 sm:py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 items-start">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl text-(--primary) font-bold mb-3 sm:mb-4">{serviceData.title}</h1>
              <p className="text-base sm:text-lg font-medium mb-4 sm:mb-6 text-(--text)">{serviceData.description}</p>
              
              {/* Highlights */}
              <div className="mb-4 sm:mb-6 flex justify-center md:justify-start">
                <div className="space-y-2 sm:space-y-3 flex flex-col items-start">
                  {serviceData.highlights.map((highlight, index) => (
                    <div key={index} className="flex items-center">
                      <span className="text-green-700 mr-2 sm:mr-3 text-lg sm:text-xl"><SiTicktick /></span>
                      <span className="text-(--text) font-medium text-sm sm:text-base">{highlight}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rating and Stats */}
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-3 sm:gap-6 justify-center md:justify-start">
                <div className="flex items-center">
                  <span className="text-xl sm:text-2xl mr-2">⭐</span>
                  <span className="text-base sm:text-lg font-semibold">{serviceData.rating}</span>
                  <span className="text-(--text) ml-2 text-sm sm:text-base">({serviceData.reviews} reviews)</span>
                </div>
                <div className="sm:border-l border-(--) sm:pl-6">
                  <span className="text-base sm:text-lg font-semibold">{serviceData.completedOrders}+</span>
                  <span className="text-(--text) ml-2 text-sm sm:text-base">Orders Completed</span>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <div className="bg-white text-gray-900 rounded-xl p-4 sm:p-6 shadow-2xl">
              <h3 className="text-base sm:text-lg md:text-xl text-center font-bold mb-3 sm:mb-4 px-2 sm:px-4 text-(--primary)">Enter your details to receive a full quote and consultation</h3>
              <form className="space-y-3 sm:space-y-4">
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Full Name *</label>
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Email Address *</label>
                  <input
                    type="email"
                    placeholder="your.email@example.com"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    placeholder="+91 00000 00000"
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs sm:text-sm font-medium text-(--text) mb-1">Select Service *</label>
                  <select
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-sm sm:text-base border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    defaultValue={serviceData.title}
                    required
                  >
                    <option value={serviceData.title}>{serviceData.title}</option>
                    <option value="Public Limited Company Registration">Public Limited Company Registration</option>
                    <option value="LLP Registration">LLP Registration</option>
                    <option value="Sole Proprietorship Registration">Sole Proprietorship Registration</option>
                    <option value="Partnership Firm Registration">Partnership Firm Registration</option>
                    <option value="GST Registration">GST Registration</option>
                    <option value="Trademark Registration">Trademark Registration</option>
                    <option value="Income Tax Return Filing">Income Tax Return Filing</option>
                    <option value="Accounting Services">Accounting Services</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="w-full bg-(--primary) text-base sm:text-lg text-white px-4 sm:px-6 py-3 sm:py-4 rounded-2xl font-semibold hover:bg-(--primary-hover) transition-colors"
                >
                  Submit Application
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
              {["overview", "process", "requirements", "advantages", "services"].map((tab) => (
                <button
                  key={tab}
                  onClick={() => scrollToSection(tab)}
                  className={`px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold capitalize whitespace-nowrap ${
                    activeTab === tab
                      ? "border-b-2 border-blue-600 text-blue-600"
                      : "text-gray-600 hover:text-blue-600"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content - All sections displayed */}
          <div className="p-4 sm:p-6 md:p-8 space-y-8 sm:space-y-10 md:space-y-12">
            {/* Overview Section */}
            <div id="overview" className="scroll-mt-32">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Overview</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                A Private Limited Company is the most popular business structure in India. It provides 
                limited liability protection, easier funding opportunities, and enhanced credibility. 
                Perfect for startups and growing businesses looking to scale. This registration process 
                ensures your business is legally incorporated and compliant with all regulatory requirements.
              </p>
            </div>

            {/* Process Section */}
            <div id="process" className="scroll-mt-32">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Process</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                The registration process is simple and streamlined. First, we help you select and get approval 
                for your company name from the Ministry of Corporate Affairs. Then we obtain Digital Signature 
                Certificates (DSC) and Director Identification Numbers (DIN) for the directors. Next, we prepare 
                and file all necessary incorporation documents including Memorandum of Association (MOA) and 
                Articles of Association (AOA). Finally, once approved, you receive your Certificate of 
                Incorporation along with PAN and TAN. The entire process typically takes 7-10 working days.
              </p>
            </div>

            {/* Requirements Section */}
            <div id="requirements" className="scroll-mt-32">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Requirements</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                To register a Private Limited Company, you need minimum 2 directors and 2 shareholders. 
                Required documents include PAN cards and Aadhaar cards of all directors, passport-sized 
                photographs, proof of registered office address (rent agreement or property documents), 
                latest utility bills, and a No Objection Certificate (NOC) from the property owner. 
                All documents should be clear, valid, and self-attested. Our team will guide you through 
                the document preparation process.
              </p>
            </div>

            {/* Advantages Section */}
            <div id="advantages" className="scroll-mt-32">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Advantages</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                Private Limited Companies offer numerous benefits including limited liability protection 
                for shareholders, perpetual succession regardless of ownership changes, enhanced credibility 
                with customers and investors, easier access to funding from banks and venture capitalists, 
                separate legal entity status, and various tax benefits and deductions. The structure is 
                ideal for businesses planning to scale, raise investment, or build long-term brand value 
                in the market.
              </p>
            </div>

            {/* Services Section */}
            <div id="services" className="scroll-mt-32">
              <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-gray-900">Our Services</h2>
              <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                We provide end-to-end support for your company registration. Our services include complete 
                documentation assistance, expert guidance on name selection and approval, processing of 
                Digital Signature Certificates and DIN, preparation of MOA and AOA, incorporation filing, 
                obtaining PAN and TAN, share certificate issuance, and first-year compliance support. We 
                also offer free consultation with experienced CAs and CSs, post-registration assistance for 
                bank account opening, and ongoing compliance reminders to keep your business on track.
              </p>
            </div>
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
