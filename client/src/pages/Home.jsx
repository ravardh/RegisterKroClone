import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPhoneAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { Link } from "react-router-dom";
import Step1 from "../assets/step1.png";
import Step2 from "../assets/step2.png";
import Step3 from "../assets/step3.png";
import Step4 from "../assets/step4.png";
import commondata from "../assets/common.json";
import SEOHelmet from "../components/SEOHelmet";
import WhyChooseUsSection from "../components/WhyChooseUsSection";
import PromoBanner from "../components/PromoBanner";
import { useAppData } from "../context/DataContext";
import axios from "../config/api";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

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
  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [specialOffer, setSpecialOffer] = useState(null);

  const { categories: allCategoriesData, featuredServices: featuredData, reviews: reviewsData, isDataLoaded } = useAppData();

  // Sync from DataContext
  useEffect(() => {
    if (allCategoriesData.length > 0) {
      setCategories(allCategoriesData);
    }
  }, [allCategoriesData]);

  useEffect(() => {
    if (isDataLoaded) {
      setFeaturedServices(featuredData);
      setIsLoadingFeatured(false);
    }
  }, [featuredData, isDataLoaded]);

  useEffect(() => {
    if (isDataLoaded) {
      setReviews(reviewsData);
      setIsLoadingReviews(false);
    }
  }, [reviewsData, isDataLoaded]);

  useEffect(() => {
    let cancelled = false;
    const fetchSpecialOffer = async () => {
      try {
        const res = await axios.get("/public/special-offer");
        if (!cancelled) {
          setSpecialOffer(res.data.data || null);
        }
      } catch {
        if (!cancelled) setSpecialOffer(null);
      }
    };
    fetchSpecialOffer();
    return () => { cancelled = true; };
  }, []);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [servicesPerPage, setServicesPerPage] = useState(3);
  const maxIndex = categories.length > 0 ? Math.ceil(categories.length / servicesPerPage) - 1 : 0;

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPerPage, setFeaturedPerPage] = useState(3);
  const maxFeaturedIndex = featuredServices.length > 0 ? Math.ceil(featuredServices.length / featuredPerPage) - 1 : 0;

  const [reviewIndex, setReviewIndex] = useState(0);
  const [reviewsPerPage, setReviewsPerPage] = useState(3);
  const maxReviewIndex = reviews.length > 0 ? Math.ceil(reviews.length / reviewsPerPage) - 1 : 0;

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      const perPage = w < 640 ? 1 : w < 1280 ? 2 : 3;
      setServicesPerPage(perPage);
      setFeaturedPerPage(perPage);
      setReviewsPerPage(perPage);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setReviewIndex((prev) => Math.min(prev, maxReviewIndex));
  }, [maxReviewIndex]);

  useEffect(() => {
    setFeaturedIndex((prev) => Math.min(prev, maxFeaturedIndex));
  }, [maxFeaturedIndex]);

  useEffect(() => {
    setCurrentIndex((prev) => Math.min(prev, maxIndex));
  }, [maxIndex]);

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

  const handleFeaturedNext = () => {
    setFeaturedIndex((prev) => (prev < maxFeaturedIndex ? prev + 1 : 0));
  };

  const handleFeaturedPrev = () => {
    setFeaturedIndex((prev) => (prev > 0 ? prev - 1 : maxFeaturedIndex));
  };

  const visibleCategories = categories.slice(
    currentIndex * servicesPerPage,
    (currentIndex + 1) * servicesPerPage
  );

  const visibleFeaturedServices = featuredServices.slice(
    featuredIndex * featuredPerPage,
    (featuredIndex + 1) * featuredPerPage
  );

  return (
    <>
      {specialOffer?.imageUrl && (
        <PromoBanner
          imageSrc={assetUrl(specialOffer.imageUrl)}
          alt={specialOffer.alt}
          badgeText={specialOffer.badgeText}
          tabLabel={specialOffer.tabLabel}
          tagline={specialOffer.tagline}
          ctaText={specialOffer.ctaText}
          ctaLink={specialOffer.ctaLink}
          delay={specialOffer.delay ?? 1200}
        />
      )}

      <SEOHelmet
        title="TaxProSolution - Get Your Business Registered in 7 Days"
        description="Fast, reliable business registration and setup services. Get your business registered in just 7 days with expert consultation. Trusted by 5000+ happy clients."
        keywords="business registration, company registration, GST registration, startup registration, business setup"
        canonicalUrl="https://taxprosolution.co.in/"
        structuredData={homeSchemaData}
      />
      <section className="hero-section flex flex-col items-center justify-center min-h-[92svh] -mt-20 pt-24 pb-8 sm:pt-28 sm:pb-10 bg-[url('/hero.webp')] opacity-90 bg-cover bg-center">
        <div className="hero-content text-white px-4 sm:px-12 md:px-20 lg:px-32 xl:px-48 py-4 sm:py-6 text-center max-w-5xl w-full mx-auto">
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

      <section className="featured-services relative overflow-hidden py-8 md:py-14 bg-linear-to-b from-[color-mix(in_srgb,var(--brand-pale)_40%,white)] via-white to-[color-mix(in_srgb,var(--brand-pale)_25%,white)]">
        <div
          className="pointer-events-none absolute -top-24 right-0 h-72 w-72 rounded-full bg-(--primary)/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-16 left-0 h-64 w-64 rounded-full bg-(--secondary)/10 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="mx-auto mb-7 max-w-3xl text-center md:mb-9">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white/90 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm backdrop-blur-sm">
              <IoMdStar className="text-sm" />
              Popular Picks
            </span>
            <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-4">
              Featured Services
            </h2>
            <p className="text-(--secondary) text-base sm:text-lg md:text-xl leading-relaxed">
              Explore our most popular and trusted services chosen by thousands of
              businesses.
            </p>
          </div>

          {isLoadingFeatured ? (
            <div className="text-center py-12">
              <p className="text-(--secondary) text-lg">
                Loading featured services...
              </p>
            </div>
          ) : featuredServices.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-(--secondary) text-lg">
                No featured services available.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="featured-services-grid grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8">
                {visibleFeaturedServices.map((service, index) => (
                  <div
                    key={service._id}
                    className="featured-service-card bg-linear-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl shadow-lg border-2 border-indigo-100 hover:shadow-xl hover:border-indigo-300 transition min-h-[18rem] sm:min-h-[20rem] xl:h-80 flex flex-col"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-(--primary) text-xl sm:text-2xl font-bold flex-1">
                        {service.serviceName}
                      </h3>
                      <span className="text-(--accent) text-2xl ml-2"><IoMdStar/></span>
                    </div>
                    <p className="text-(--secondary) flex-1 overflow-hidden line-clamp-4 mb-4">
                      {service.shortDescription ||
                        "Comprehensive service for your business needs."}
                    </p>
                    <div className="flex gap-2 items-center text-xs md:text-sm text-(--secondary) mb-4">
                      <span className="bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full font-medium">
                        {service.category?.name || "Category"}
                      </span>
                      <span className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full font-medium">
                        {service.subCategory?.name || "Sub-category"}
                      </span>
                    </div>
                    <Link
                      to={`/service/${service._id}`}
                      className="mt-auto flex text-(--primary) hover:text-(--primary-hover) font-semibold justify-center items-center gap-2 py-2 px-4 border-2 border-(--primary) rounded-lg hover:bg-(--primary) hover:text-white transition"
                    >
                      View Details <FaArrowRightLong className="w-4 h-4" />
                    </Link>
                  </div>
                ))}
              </div>

              {/* Navigation Buttons */}
              {maxFeaturedIndex >= 0 && (
                <div className="flex justify-center items-center gap-4 mt-8">
                  <button
                    onClick={handleFeaturedPrev}
                    className="text-(--primary) hover:text-(--primary-hover) transition"
                    aria-label="Previous featured services"
                  >
                    <FaChevronLeft size={24} />
                  </button>

                  <div className="flex gap-2">
                    {Array.from({ length: maxFeaturedIndex + 1 }).map(
                      (_, index) => (
                        <button
                          key={index}
                          onClick={() => setFeaturedIndex(index)}
                          className={`w-3 h-3 rounded-full transition ${
                            featuredIndex === index
                              ? "bg-(--primary)"
                              : "bg-gray-300"
                          }`}
                          aria-label={`Go to page ${index + 1}`}
                        />
                      )
                    )}
                  </div>

                  <button
                    onClick={handleFeaturedNext}
                    className="text-(--primary) hover:text-(--primary-hover) transition"
                    aria-label="Next featured services"
                  >
                    <FaChevronRight size={24} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="process-section py-8 md:py-12 bg-[url('/process-bg.webp')] bg-cover bg-center">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-32">
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            Grow Your Business in Just a Few Clicks
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-7 md:mb-10 w-full sm:w-3/4 md:w-2/3 mx-auto px-4">
            Simple, guided, and fully online—from application to completion, we
            handle everything for you.
          </p>

          <div className="flex flex-col md:flex-row items-center gap-5 md:gap-8 mb-8 md:mb-12">
            <div className="w-full md:w-1/2">
              <img
                src={Step1}
                alt="Choose a Service"
                className="rounded-2xl shadow-lg w-full max-w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 text-xl md:text-2xl font-medium text-white bg-(--primary) rounded-full shrink-0">
                  1
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Choose a Service &amp; Submit Your Application
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

          <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-9 mb-8 md:mb-12">
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  2
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Lead Generation &amp; Manager Assignment
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
                className="rounded-2xl shadow-lg w-full max-w-full h-auto"
              />
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-9 mb-8 md:mb-12">
            <div className="w-full md:w-1/2">
              <img
                src={Step3}
                alt="Document Collection"
                className="rounded-2xl shadow-lg w-full max-w-full h-auto"
              />
            </div>
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  3
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Document Collection &amp; Expert Handling
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

          <div className="flex flex-col-reverse md:flex-row items-center gap-6 md:gap-9">
            <div className="w-full md:w-1/2">
              <div className="flex md:grid items-center gap-3 md:gap-4 mb-4">
                <span className="flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-full bg-(--primary) text-white text-xl md:text-2xl font-medium shrink-0">
                  4
                </span>
                <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-(--text)">
                  Track Progress &amp; Get Confirmation
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
                className="rounded-2xl shadow-lg w-full max-w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="cta-section mx-4 sm:mx-8 md:mx-12 lg:mx-20 my-6 md:my-10 py-5 md:py-6 bg-[url('/hero.webp')] rounded-2xl opacity-90 bg-cover bg-center">
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
          <div className="shrink-0 md:ml-6">
            <a
              href={`tel:${commondata.phones.primary}`}
              className="call-cta-btn group inline-flex items-center gap-2.5 bg-white text-(--primary) px-4 py-2 rounded-full text-sm font-semibold shadow-md shadow-black/10 ring-2 ring-white/40 transition duration-300 hover:bg-(--primary) hover:text-white hover:shadow-lg hover:scale-105 active:scale-95"
            >
              <span className="call-cta-icon-wrap relative flex h-7 w-7 items-center justify-center rounded-full bg-(--primary)/10 text-(--primary) transition-colors group-hover:bg-white/20 group-hover:text-white">
                <FaPhoneAlt className="call-cta-phone h-3.5 w-3.5" />
              </span>
              Call Us Now
            </a>
          </div>
        </div>
      </section>

      <section className="reviews-section py-8 md:py-12 bg-(--background)">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <h2 className="text-(--primary) text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4">
            What Our Clients Say
          </h2>
          <p className="text-(--secondary) text-base sm:text-lg md:text-xl text-center mb-6 md:mb-8 w-full sm:w-3/4 md:w-2/3 mx-auto px-4">
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
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-8 transition-all duration-500 ease-in-out">
                {visibleReviews.map((review, index) => (
                  <div
                    key={review._id || index}
                    className="bg-white p-6 rounded-2xl shadow-lg min-h-[18rem] sm:min-h-[20rem] xl:h-80 flex flex-col"
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

      <WhyChooseUsSection />
    </>
  );
};

export default Home;
