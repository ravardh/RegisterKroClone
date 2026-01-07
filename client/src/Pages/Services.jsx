import React, { useState, useEffect } from "react";

const Services = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  
  const stats = [
    { number: "5000+", title: "Happy Clients", description: "Businesses served" },
    { number: "50+", title: "Expert Team", description: "Professionals" },
    { number: "98%", title: "Success Rate", description: "First attempt" },
    { number: "15+", title: "Years Experience", description: "Industry leader" },
    { number: "24/7", title: "Support", description: "Always available" }
  ];

  const serviceCategories = [
    "Company Registration",
    "GST Services",
    "Tax Filing",
    "Trademark & IP",
    "Licenses & Permits",
    "Accounting Services",
    "Legal Compliance",
    "Annual Filings"
  ];

  const servicesData = {
    "Company Registration": {
      "Private Limited Company": [
        "Private Limited Company Registration",
        "Director KYC",
        "Digital Signature Certificate (DSC)",
        "Annual Compliance"
      ],
      "Public Limited Company": [
        "Public Limited Company Registration",
        "Share Certificate Printing",
        "Board Meetings",
        "Annual General Meeting"
      ],
      "LLP": [
        "LLP Registration",
        "LLP Agreement",
        "Annual Filing",
        "Conversion to LLP"
      ],
      "Sole Proprietorship": [
        "Proprietorship Registration",
        "MSME Registration",
        "Shop Act License"
      ],
      "Partnership Firm": [
        "Partnership Deed",
        "Partnership Registration",
        "Partnership Modification"
      ]
    },
    "GST Services": {
      "GST Registration": [
        "New GST Registration",
        "GST Modification",
        "GST Cancellation",
        "GST Migration"
      ],
      "GST Returns": [
        "GSTR-1 Filing",
        "GSTR-3B Filing",
        "GSTR-9 Annual Return",
        "GST Refund"
      ],
      "GST Compliance": [
        "Input Tax Credit Reconciliation",
        "E-Way Bill Generation",
        "GST Notice Response"
      ]
    },
    "Tax Filing": {
      "Income Tax Returns": [
        "Individual ITR Filing",
        "Business ITR Filing",
        "Professional ITR Filing",
        "Capital Gains ITR"
      ],
      "TDS Returns": [
        "TDS Return Filing",
        "TDS Payment",
        "Form 16 Issuance",
        "Lower TDS Certificate"
      ]
    },
    "Trademark & IP": {
      "Trademark": [
        "Trademark Registration",
        "Trademark Search",
        "Trademark Objection Reply",
        "Trademark Renewal"
      ],
      "Copyright": [
        "Copyright Registration",
        "Copyright Assignment",
        "Copyright Infringement"
      ],
      "Patent": [
        "Patent Registration",
        "Patent Search",
        "Provisional Patent"
      ]
    },
    "Licenses & Permits": {
      "FSSAI License": [
        "Basic FSSAI Registration",
        "State FSSAI License",
        "Central FSSAI License",
        "FSSAI Renewal"
      ],
      "Import Export Code": [
        "IEC Registration",
        "IEC Modification",
        "DGFT Services"
      ],
      "Professional Tax": [
        "Professional Tax Registration",
        "PT Return Filing"
      ]
    },
    "Accounting Services": {
      "Bookkeeping": [
        "Monthly Bookkeeping",
        "Accounts Reconciliation",
        "Financial Statement Preparation"
      ],
      "Payroll": [
        "Payroll Processing",
        "PF/ESI Registration",
        "Salary Structure Design"
      ],
      "Audit": [
        "Statutory Audit",
        "Tax Audit",
        "Internal Audit"
      ]
    },
    "Legal Compliance": {
      "Company Law": [
        "Board Resolutions",
        "Shareholder Agreements",
        "MoA/AoA Amendments"
      ],
      "Contract Drafting": [
        "Employment Contracts",
        "Vendor Agreements",
        "NDA Agreements"
      ]
    },
    "Annual Filings": {
      "ROC Filings": [
        "Annual Return (MGT-7)",
        "Financial Statement Filing (AOC-4)",
        "DIR-3 KYC",
        "DPT-3 Filing"
      ],
      "Compliance Calendar": [
        "Compliance Tracking",
        "Due Date Reminders",
        "Penalty Calculation"
      ]
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    const subCategories = Object.keys(servicesData[category] || {});
    setSelectedSubCategory(subCategories[0] || null);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory(null);
    setSelectedSubCategory(null);
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="bg-linear-to-r from-blue-50 to-sky-50 py-10 px-4 sm:px-8 md:px-12 lg:px-20 min-h-screen -mt-16">
        {/* Statistics Carousel Header */}
      <div className="bg-(--primary) mt-16 py-4 px-4 sm:px-8 rounded-2xl shadow-lg">
        <div className="sm:max-w-3xl md:max-w-7xl mx-auto">
          <div className="flex items-center justify-between gap-4">
            {/* Desktop: Show all stats */}
            <div className="hidden md:flex justify-center items-center gap-8 w-full">
              {stats.map((stat, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stat.number}</div>
                    <h3 className="text-sm font-semibold text-white">{stat.title}</h3>
                    <p className="text-xs text-white/90">{stat.description}</p>
                  </div>
                  {index < stats.length - 1 && (
                    <div className="h-10 w-px bg-white/30"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Mobile: Carousel */}
            <div className="md:hidden w-full">
              <div className="flex items-center justify-center gap-4">
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-white mb-1">{stats[currentSlide].number}</div>
                  <h3 className="text-sm font-semibold text-white mb-1">{stats[currentSlide].title}</h3>
                  <p className="text-xs text-white/90">{stats[currentSlide].description}</p>
                </div>
              </div>
              <div className="flex justify-center gap-2 mt-3">
                {stats.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentSlide(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      currentSlide === index ? "w-8 bg-white" : "w-1.5 bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Service Categories Section */}
      <section className="px-4 sm:px-8 md:px-12 lg:px-20 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-(--primary) mb-4 sm:mb-8">Service Categories</h2>
            <p className="text-gray-600 text-base sm:text-lg">Explore our comprehensive range of business services</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {serviceCategories.map((category, index) => (
              <div 
                key={index}
                onClick={() => handleCategoryClick(category)}
                className="bg-white border-l-4 border-(--primary) p-6 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer"
              >
                <h3 className="text-lg font-semibold text-gray-800">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Service Details Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4" onClick={handleCloseModal}>
          <div className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-5xl max-h-[90vh] sm:max-h-[85vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="bg-(--primary) px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white">{selectedCategory}</h2>
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-gray-200 transition-colors text-3xl font-light"
              >
                ×
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex h-[calc(90vh-60px)] sm:h-[calc(85vh-80px)]">
              {/* Left Section - Sub-categories - Dropdown on small screens, sidebar on larger */}
              <div className="hidden sm:block w-1/3 bg-gray-50 border-r border-gray-200 overflow-y-auto">
                <div className="p-3 sm:p-4">
                  {servicesData[selectedCategory] && Object.keys(servicesData[selectedCategory]).map((subCat, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedSubCategory(subCat)}
                      onMouseEnter={() => setSelectedSubCategory(subCat)}
                      className={`w-full text-left px-3 sm:px-4 py-2 sm:py-3 rounded-lg sm:rounded-xl mb-2 transition-all duration-200 text-sm sm:text-base ${
                        selectedSubCategory === subCat
                          ? "bg-(--primary) text-white shadow-md"
                          : "text-gray-700"
                      }`}
                    >
                      {subCat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Right Section - Services */}
              <div className="w-full sm:w-2/3 overflow-y-auto">
                {/* Dropdown for mobile */}
                <div className="sm:hidden p-3 bg-gray-50 border-b border-gray-200 sticky top-0 z-10">
                  <select
                    value={selectedSubCategory}
                    onChange={(e) => setSelectedSubCategory(e.target.value)}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-(--primary)"
                  >
                    {servicesData[selectedCategory] && Object.keys(servicesData[selectedCategory]).map((subCat, index) => (
                      <option key={index} value={subCat}>
                        {subCat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 sm:p-4 md:p-6">
                  {servicesData[selectedCategory] && servicesData[selectedCategory][selectedSubCategory] && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
                      {servicesData[selectedCategory][selectedSubCategory].map((service, index) => (
                        <div
                          key={index}
                          className="bg-white p-2 sm:p-3 md:p-4 hover:underline hover:underline-offset-2 text-(--text) hover:text-(--primary) transition-all duration-200 cursor-pointer"
                        >
                          <p className="hover:text-(--primary) font-medium text-sm sm:text-base">{service}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </>
  );
};

export default Services;
