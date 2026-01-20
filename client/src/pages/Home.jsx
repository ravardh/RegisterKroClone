import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { Link } from "react-router-dom";
import axios from "../config/api";
import toast from "react-hot-toast";
import Step1 from "../assets/step1.png";
import Step2 from "../assets/step2.png";
import Step3 from "../assets/step3.png";
import Step4 from "../assets/step4.png";
import axiosInstance from "../config/api";
import commondata from "../assets/common.json";
import SEOHelmet from "../components/SEOHelmet";

const Home = () => {
  const homeSchemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "TaxProSolution",
    "description": "Professional tax and registration services for businesses",
    "url": "https://taxprosolution.co.in",
    "telephone": commondata.phones?.phone || "+91-XXXXXXXXXX",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Your Address",
      "addressLocality": "Your City",
      "addressRegion": "Your State",
      "postalCode": "Your Code",
      "addressCountry": "IN"
    },
    "priceRange": "₹",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "250"
    }
  };
  const [categories, setCategories] = useState([]);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  console.log("Home Page");
  
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("/public/feedback");
        setReviews(response.data.data);
      } catch (error) {
        console.error("Failed to fetch reviews", error);
        toast.error("Failed to load reviews");
      } finally {
        setIsLoadingReviews(false);
      }
    };

    fetchReviews();
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const servicesPerPage = 3;
  const maxIndex = Math.ceil(categories.length / servicesPerPage) - 1;

  const [reviewIndex, setReviewIndex] = useState(0);
  const reviewsPerPage = 3;
  const maxReviewIndex = Math.ceil(reviews.length / reviewsPerPage) - 1;

  useEffect(() => {
    // Fetch categories from the backend
    const fetchCategories = async () => {
      try {
        const response = await axiosInstance.get("/public/categories");
        setCategories(response.data.data || []);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setReviewIndex((prev) => (prev >= maxReviewIndex ? 0 : prev + 1));
    }, 3000); // Auto-slide every 3 seconds

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

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < maxIndex ? prev + 1 : 0));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : maxIndex));
  };

  const visibleCategories = categories.slice(
    currentIndex * servicesPerPage,
    (currentIndex + 1) * servicesPerPage
  );

  return (
    <>
      <SEOHelmet
        title="TaxProSolution - Get Your Business Registered in 7 Days"
        description="Fast, reliable business registration and setup services. Get your business registered in just 7 days with expert consultation. Trusted by 5000+ happy clients."
        keywords="business registration, company registration, GST registration, startup registration, business setup"
        canonicalUrl="https://taxprosolution.co.in/"
        structuredData={homeSchemaData}
      />
      <section className="hero-section flex flex-col items-center justify-center h-screen -mt-20 bg-[url('/hero.jpg')] opacity-90 bg-cover bg-center">
        <div className="hero-content text-white px-6 sm:px-20 md:px-50 py-10 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold mb-4">
            Get Your Business Registered in 7 Days
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8">
            Fast, reliable, and tailored online business solutions with free
            expert consultation.
          </p>
          <button className="bg-(--primary) text-white px-6 py-3 rounded-2xl hover:bg-(--primary-hover) transition" onClick = {() => {
            window.location.href = '/services';
          }}>
            Get Started
          </button>
        </div>
      </section>

      <section className="services">
        <div className="services-section py-10 md:py-20 bg-(--background)">
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2">
            Our Services
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-8 md:mb-12 w-full sm:w-3/4 md:w-1/2 mx-auto px-4">
            One platform for legal consultation, business setup, compliance, and
            startup solutions built for businesses of every industry.
          </p>
          <div className="relative px-6 sm:px-12 md:px-20 lg:px-25 mx-auto">
            <div className="services-grid grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
              {visibleCategories.map((category) => (
                <div
                  key={category._id}
                  className="service-card bg-white p-6 rounded-2xl shadow-md text-center h-64 flex flex-col"
                >
                  <h3 className="text-(--text) text-2xl font-semibold mb-4">
                    {category.name}
                  </h3>
                  <p className="text-(--secondary) flex-1 overflow-hidden line-clamp-3">
                    {category.shortDescription ||
                      "Explore our comprehensive services in this category."}
                  </p>
                  <Link
                    to="/services"
                    className="mt-4 flex text-(--primary) hover:text-(--primary-hover) font-medium justify-center"
                  >
                    Learn More <FaArrowRightLong className="pt-2 w-6 h-5" />
                  </Link>
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={handlePrev}
                className=" text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Previous services"
              >
                <FaChevronLeft size={20} />
              </button>

              <div className="flex gap-2">
                {Array.from({ length: maxIndex + 1 }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-3 h-3 rounded-full transition ${
                      currentIndex === index ? "bg-(--primary)" : "bg-gray-300"
                    }`}
                    aria-label={`Go to page ${index + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={handleNext}
                className="text-(--primary) hover:text-(--primary-hover) transition"
                aria-label="Next services"
              >
                <FaChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="process-section py-10 md:py-20 bg-[url('/process-bg.jpg')] bg-cover bg-center">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-50">
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Grow Your Business in Just a Few Clicks
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-10 md:mb-16 w-full sm:w-3/4 md:w-2/3 mx-auto px-4">
            Simple, guided, and fully online—from application to completion, we
            handle everything for you.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 mb-12 md:mb-20">
            <div className="w-full md:w-1/2">
              <img
                src={Step1}
                alt="Choose a Service"
                className="rounded-2xl shadow-lg w-100 h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-xl md:text-2xl font-medium text-white bg-(--primary) rounded-full shrink-0">
                  1
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Choose a Service & Submit Your Application
                </h3>
              </div>
              <ul className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-(--secondary) mb-4 md:mb-6">
                <li>• Select the service you need from our platform</li>
                <li>• Fill in a quick and simple application form</li>
                <li>• Share only essential details—no complexity</li>
                <li>• Your information stays safe, secure, and private</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-3 md:px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-base md:text-lg"
              onClick={() => {
                window.location.href = '/services';
              }}>
                Start Application <FaArrowRightLong />
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-20">
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  2
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Lead Generation & Manager Assignment
                </h3>
              </div>
              <ul className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-(--secondary) mb-4 md:mb-6">
                <li>
                  • Your application instantly creates a lead in our system
                </li>
                <li>
                  • An experienced Relationship Manager (RM) is assigned to you
                </li>
                <li>• Your RM becomes your single point of contact</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-3 md:px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-base md:text-lg"
              onClick={() => {
                window.location.href = '/services';
              }}>
                Proceed <FaArrowRightLong />
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src={Step2}
                alt="Lead Generation"
                className="rounded-2xl shadow-lg w-100 h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12 mb-12 md:mb-20">
            <div className="w-full md:w-1/2">
              <img
                src={Step3}
                alt="Document Collection"
                className="rounded-2xl shadow-lg w-100 h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  3
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Document Collection & Expert Handling
                </h3>
              </div>
              <ul className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-(--secondary) mb-4 md:mb-6">
                <li>• Your RM contacts you personally</li>
                <li>• Required documents are collected and verified</li>
                <li>
                  • Experts take care of filings, compliance, and processing
                </li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-3 md:px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-base md:text-lg"
              onClick={() => {
                window.location.href = '/services';
              }}>
                Continue <FaArrowRightLong />
              </button>
            </div>
          </div>

          <div className="flex flex-col-reverse md:flex-row items-center gap-8 md:gap-12">
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  4
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Track Progress & Get Confirmation
                </h3>
              </div>
              <ul className="space-y-2 md:space-y-3 text-sm sm:text-base md:text-lg text-(--secondary) mb-4 md:mb-6">
                <li>• Lead status is updated at every stage</li>
                <li>
                  • Track your application anytime via our tracking dashboard
                </li>
                <li>
                  • Receive confirmations, updates, and documents on email
                </li>
                <li>• Get expert support whenever you need it</li>
              </ul>
              <button className="inline-flex border-2 border-(--primary) py-2 px-3 md:px-4 rounded-2xl items-center gap-2 text-(--primary) hover:bg-(--primary-hover) hover:text-white font-semibold text-base md:text-lg"
              onClick={() => {
                window.location.href = '/trackStatus';
              }}>
                Track Application <FaArrowRightLong />
              </button>
            </div>
            <div className="w-full md:w-1/2">
              <img
                src={Step4}
                alt="Track Progress"
                className="rounded-2xl shadow-lg w-100 h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-10 md:my-20 py-6 md:py-8 bg-[url('/hero.jpg')] rounded-2xl opacity-90 bg-cover bg-center">
        <div className="container flex flex-col md:flex-row items-center justify-between mx-auto px-6 sm:px-12 md:px-20 lg:px-25 gap-4 md:gap-2">
          <div className="flex-1 text-center md:text-left">
            <h2 className="text-white text-xl sm:text-2xl md:text-2xl font-bold mb-2 md:mb-3">
              Have Questions? Speak with Our Experts
            </h2>
            <p className="text-white text-sm sm:text-base md:text-lg">
              Get tailored advice on business registration, legal requirements,
              and compliance from our seasoned professional available to assist
              you anytime.
            </p>
          </div>
          <div className="md:ml-8">
            <button className="bg-(--primary) text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-base md:text-lg font-medium hover:bg-(--primary-hover) transition whitespace-nowrap">
              <a href={`tel:${commondata.phones.primary}`}>Call us Now</a>
            </button>
          </div>
        </div>
      </section>

      <section className="reviews-section py-10 md:py-20 bg-(--background)">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-8 md:mb-12 w-full sm:w-3/4 md:w-2/3 mx-auto px-4">
            Trusted by thousands of businesses across the country. Here's what
            they have to say about our services.
          </p>

          {isLoadingReviews ? (
            <div className="text-center py-12">
              <p className="text-(--secondary) text-lg">Loading reviews...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-(--secondary) text-lg">
                No reviews available yet.
              </p>
            </div>
          ) : (
            <div className="relative mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-500 ease-in-out">
                {visibleReviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="bg-white p-6 rounded-2xl shadow-lg h-80 flex flex-col"
                  >
                    <div className="flex items-center gap-4 mb-4 shrink-0">
                      <div className="w-16 h-16 rounded-full bg-gray-200 overflow-hidden shrink-0">
                        <div className="w-full h-full flex items-center justify-center bg-(--primary) text-white text-2xl font-semibold">
                          {review.fullName.charAt(0)}
                        </div>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-xl font-semibold text-(--text) truncate">
                          {review.fullName}
                        </h3>
                        <p className="text-(--secondary) text-sm truncate">
                          {review.serviceAvailed?.serviceName || "Service"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3 shrink-0">
                      {Array.from({ length: review.starRating }).map((_, i) => (
                        <span key={i} className="text-yellow-400 text-2xl">
                          ★
                        </span>
                      ))}
                    </div>
                    <p className="text-(--secondary) text-base leading-relaxed flex-1 overflow-hidden line-clamp-5">
                      "{review.message}"
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
                  {Array.from({ length: maxReviewIndex + 1 }).map(
                    (_, index) => (
                      <button
                        key={index}
                        onClick={() => setReviewIndex(index)}
                        className={`w-3 h-3 rounded-full transition ${
                          reviewIndex === index
                            ? "bg-(--primary)"
                            : "bg-gray-300"
                        }`}
                        aria-label={`Go to page ${index + 1}`}
                      />
                    )
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
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Home;
