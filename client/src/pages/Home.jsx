import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight, FaPhoneAlt, FaMapMarkerAlt } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import {
  FaWpforms,
  FaUserTie,
  FaFolderOpen,
  FaClipboardCheck,
  FaRocket,
  FaHandshake,
  FaHeadset,
  FaShieldHalved,
} from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import commondata from "../assets/common.json";
import SEOHelmet from "../components/SEOHelmet";
import PromoBanner from "../components/PromoBanner";
import { useAppData } from "../context/DataContext";
import axios from "../config/api";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

const heroStats = [
  { value: "5000+", label: "Businesses Served" },
  { value: "4.8", label: "Average Rating" },
  { value: "7 Days", label: "Avg. Turnaround" },
  { value: "98%", label: "Success Rate" },
];

const processSteps = [
  {
    icon: FaWpforms,
    title: "Choose a Service & Apply",
    description:
      "Pick the service you need and fill a quick, simple form. Share only essential details—kept safe and private.",
  },
  {
    icon: FaUserTie,
    title: "Lead & Manager Assignment",
    description:
      "Your application instantly creates a lead and a dedicated Relationship Manager becomes your single point of contact.",
  },
  {
    icon: FaFolderOpen,
    title: "Documents & Expert Handling",
    description:
      "Your RM collects and verifies documents while our experts take care of filings, compliance, and processing.",
  },
  {
    icon: FaClipboardCheck,
    title: "Track Progress & Confirm",
    description:
      "Follow your application live via the tracking dashboard and receive confirmations and documents on email.",
  },
];

const differentiators = [
  {
    no: "01",
    icon: FaRocket,
    title: "Expert-Led Guidance",
    description:
      "Seasoned professionals handle the complex legal work end-to-end, so you can focus on your business.",
  },
  {
    no: "02",
    icon: FaHandshake,
    title: "Transparent Process",
    description:
      "Clear, upfront pricing and real-time status updates at every stage—no hidden fees, no surprises.",
    featured: true,
  },
  {
    no: "03",
    icon: FaHeadset,
    title: "Friendly Support",
    description:
      "A dedicated Relationship Manager and support team ready to help whenever you need them.",
  },
];

const journeySteps = [
  {
    no: "1",
    title: "You Can Trust",
    desc: "With over 12 years of experience, our team of CA experts helps you end to end.",
  },
  {
    no: "2",
    title: "Personalize Discovery Call for You",
    desc: "We believe in the power of personalized assistance. Your business journey should reflect your unique desires & approach.",
  },
  {
    no: "3",
    title: "Safety and Quality",
    desc: "Your finance is the heart of your business & we take care of everything which comes under it with the highest safety.",
  },
];

const coverGradients = [
  { from: "#6d28d9", to: "#7c3aed" },
  { from: "#f59e0b", to: "#d97706" },
  { from: "#10b981", to: "#059669" },
  { from: "#3b82f6", to: "#2563eb" },
  { from: "#ec4899", to: "#db2777" },
];

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

  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);

  const [reviews, setReviews] = useState([]);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);
  const [specialOffer, setSpecialOffer] = useState(null);

  const { featuredServices: featuredData, reviews: reviewsData, isDataLoaded } = useAppData();

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

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [featuredOffset, setFeaturedOffset] = useState(220);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setFeaturedOffset(w < 640 ? 150 : w < 1024 ? 190 : 230);
    };
    onResize();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setFeaturedIndex((prev) =>
      featuredServices.length ? Math.min(prev, featuredServices.length - 1) : 0
    );
  }, [featuredServices.length]);

  // Auto-slide featured services (coverflow)
  useEffect(() => {
    if (featuredPaused || featuredServices.length <= 1) return;
    const timer = setTimeout(() => {
      setFeaturedIndex((prev) =>
        prev >= featuredServices.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [featuredIndex, featuredPaused, featuredServices.length]);

  // Build a seamless, auto-scrolling testimonial track
  const reviewBase = (() => {
    if (!reviews.length) return [];
    let base = [...reviews];
    while (base.length < 4) base = [...base, ...reviews];
    return base;
  })();
  const marqueeReviews = reviewBase.length ? [...reviewBase, ...reviewBase] : [];
  const marqueeDuration = Math.max(28, reviewBase.length * 6);

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

      {/* ── Hero ───────────────────────────────────────────────── */}
      {/* Pull up so the gradient bleeds behind the floating sticky header */}
      <section className="relative -mt-20 overflow-hidden bg-linear-to-b from-[color-mix(in_srgb,var(--brand-pale)_60%,white)] via-white to-white sm:-mt-24">
        <div
          className="pointer-events-none absolute -top-10 -right-16 h-80 w-80 rounded-full bg-(--primary)/15 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute top-40 -left-24 h-72 w-72 rounded-full bg-(--brand-light)/25 blur-3xl"
          aria-hidden
        />

        <div className="container relative mx-auto px-6 pt-28 pb-16 text-center sm:px-12 sm:pt-32 md:px-20 md:pt-40 md:pb-20 lg:px-32">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm backdrop-blur-sm">
            <IoMdStar className="text-sm" />
            Trusted by 5000+ businesses
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-tight tracking-tight text-(--brand-ink) sm:text-5xl md:text-6xl">
            Launch Your Business in Just{" "}
            <span className="bg-linear-to-r from-(--primary) to-(--accent) bg-clip-text text-transparent">
              7 Days
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-(--secondary) sm:text-lg md:text-xl">
            Fast, reliable, and tailored online business solutions with free expert
            consultation—from registration to compliance, we handle it all.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-2xl bg-(--primary) px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-(--primary)/30 transition hover:bg-(--primary-hover) hover:shadow-xl sm:text-base"
            >
              Get Started <FaArrowRightLong className="h-4 w-4" />
            </Link>
            <a
              href={`tel:${commondata.phones.primary}`}
              className="inline-flex items-center gap-2 rounded-2xl border-2 border-(--primary)/30 bg-white px-7 py-3.5 text-sm font-semibold text-(--primary) transition hover:border-(--primary) hover:bg-(--primary)/5 sm:text-base"
            >
              <FaPhoneAlt className="h-3.5 w-3.5" /> Talk to an Expert
            </a>
          </div>

          {/* Trust stats strip */}
          <div className="mx-auto mt-12 grid max-w-3xl grid-cols-2 gap-3 sm:mt-14 sm:grid-cols-4 sm:gap-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-(--primary)/10 bg-white/80 px-4 py-4 shadow-sm backdrop-blur-sm"
              >
                <p className="text-2xl font-extrabold text-(--primary) sm:text-3xl">{stat.value}</p>
                <p className="mt-1 text-xs text-(--secondary) sm:text-sm">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Services ─────────────────────────────────── */}
      <section className="relative overflow-hidden bg-(--background) py-12 md:py-16">
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="mx-auto mb-9 max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm">
              <IoMdStar className="text-sm" /> Popular Picks
            </span>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
              Featured Services
            </h2>
            <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
              Explore our most popular and trusted services chosen by thousands of businesses.
            </p>
          </div>

          {isLoadingFeatured ? (
            <div className="py-12 text-center text-lg text-(--secondary)">Loading featured services...</div>
          ) : featuredServices.length === 0 ? (
            <div className="py-12 text-center text-lg text-(--secondary)">No featured services available.</div>
          ) : (
            <div
              className="relative mx-auto max-w-5xl"
              onMouseEnter={() => setFeaturedPaused(true)}
              onMouseLeave={() => setFeaturedPaused(false)}
            >
              {featuredServices.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIndex((prev) =>
                        prev <= 0 ? featuredServices.length - 1 : prev - 1
                      )
                    }
                    className="absolute -left-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-left-12 lg:-left-20"
                    aria-label="Previous featured service"
                  >
                    <FaChevronLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setFeaturedIndex((prev) =>
                        prev >= featuredServices.length - 1 ? 0 : prev + 1
                      )
                    }
                    className="absolute -right-4 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-right-12 lg:-right-20"
                    aria-label="Next featured service"
                  >
                    <FaChevronRight size={18} />
                  </button>
                </>
              )}

              <div className="relative flex min-h-[20rem] items-center justify-center sm:min-h-[21rem] md:min-h-[22rem]">
                {featuredServices.map((service, index) => {
                  let diff = index - featuredIndex;
                  if (diff > featuredServices.length / 2) diff -= featuredServices.length;
                  if (diff < -featuredServices.length / 2) diff += featuredServices.length;
                  if (Math.abs(diff) > 2) return null;

                  const isActive = diff === 0;
                  const zIndex = 30 - Math.abs(diff);
                  const scale = isActive ? 1 : 1 - Math.abs(diff) * 0.12;
                  const translateX = diff * featuredOffset;
                  const opacity = isActive ? 1 : Math.abs(diff) === 1 ? 0.85 : 0.6;
                  const gradient = coverGradients[index % coverGradients.length];

                  return (
                    <motion.div
                      key={service._id}
                      initial={false}
                      animate={{ x: translateX, scale, zIndex, opacity }}
                      transition={{ type: "spring", stiffness: 260, damping: 26 }}
                      className="absolute w-[15rem] cursor-pointer sm:w-[17rem] md:w-[19rem]"
                      onClick={() => {
                        if (!isActive) setFeaturedIndex(index);
                      }}
                    >
                      <div
                        className={`relative flex h-[19rem] flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
                          isActive ? "shadow-2xl ring-1 ring-(--primary)/10" : "shadow-md"
                        }`}
                      >
                        <div
                          className="h-1.5 w-full shrink-0"
                          style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
                          aria-hidden
                        />
                        <div className="flex flex-1 flex-col p-5 sm:p-6">
                          <div className="mb-3 flex items-start justify-between">
                            <h3 className="line-clamp-2 flex-1 text-lg font-bold text-(--brand-ink) sm:text-xl">
                              {service.serviceName}
                            </h3>
                            <span className="ml-2 text-xl" style={{ color: gradient.from }}>
                              <IoMdStar />
                            </span>
                          </div>
                          <p className="mb-4 line-clamp-3 flex-1 text-sm text-(--secondary)">
                            {service.shortDescription || "Comprehensive service for your business needs."}
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
                            View Details <FaArrowRightLong className="h-4 w-4" />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {featuredServices.length > 1 && (
                <div className="mt-6 flex justify-center gap-2">
                  {featuredServices.map((service, index) => (
                    <button
                      key={service._id}
                      type="button"
                      onClick={() => setFeaturedIndex(index)}
                      className={`h-1.5 rounded-full transition-all ${
                        featuredIndex === index
                          ? "w-8 bg-(--primary)"
                          : "w-1.5 bg-slate-300 hover:bg-slate-400"
                      }`}
                      aria-label={`Go to featured service ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── How It Works / Our Process ────────────────────────── */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16">
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-14">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-(--primary)/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary)">
              Our Process
            </span>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
              How Does TaxPro Solution Work?
            </h2>
            <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
              Simple, guided, and fully online—from application to completion, we handle everything for you.
            </p>
          </div>

          <div className="relative grid gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
            {processSteps.map((step, index) => (
              <div
                key={step.title}
                className={`relative flex flex-col items-center text-center ${
                  index % 2 === 1 ? "lg:mt-28" : ""
                }`}
              >
                <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-linear-to-br from-(--primary)/15 to-(--brand-light)/25 text-(--primary) shadow-md shadow-(--primary)/10 ring-1 ring-(--primary)/10">
                  <step.icon className="h-8 w-8" />
                </div>
                <span className="mb-3 text-lg font-extrabold tracking-wide text-(--primary)">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mb-2 text-lg font-bold text-(--brand-ink)">{step.title}</h3>
                <p className="max-w-xs text-sm leading-relaxed text-(--secondary)">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex justify-center md:mt-12">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 rounded-2xl bg-(--primary) px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-(--primary)/30 transition hover:bg-(--primary-hover) sm:text-base"
            >
              Start Your Application <FaArrowRightLong className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── Our Process (curved journey) ──────────────────────── */}
      {/* <section className="relative bg-white pt-4 pb-12 md:pb-16">
        <div className="container mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <h2 className="mb-4 text-center text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
            Our Process
          </h2>
          <p className="mx-auto mb-10 max-w-2xl text-center text-base leading-relaxed text-(--secondary) sm:text-lg">
            A simple, transparent journey—crafted around your business every step of the way.
          </p>

          <div className="relative mx-auto hidden aspect-[1000/460] w-full max-w-5xl lg:block">
            <svg
              viewBox="0 0 1000 460"
              fill="none"
              preserveAspectRatio="xMidYMid meet"
              className="absolute inset-0 h-full w-full"
            >
              <text x="205" y="408" textAnchor="middle" fontSize="250" fontWeight="800" fill="#EBEDF6">1</text>
              <text x="505" y="432" textAnchor="middle" fontSize="250" fontWeight="800" fill="#EBEDF6">2</text>
              <text x="812" y="214" textAnchor="middle" fontSize="250" fontWeight="800" fill="#EBEDF6">3</text>

              <path
                d="M40,360 C110,405 140,340 175,340 C300,340 340,250 505,250 C630,250 620,130 760,130 C850,130 905,95 965,80"
                stroke="#2b34e8"
                strokeWidth="7"
                strokeLinecap="round"
              />

              {[
                { cx: 175, cy: 340 },
                { cx: 505, cy: 250 },
                { cx: 760, cy: 130 },
              ].map((n) => (
                <g key={n.cx}>
                  <circle cx={n.cx} cy={n.cy} r="15" fill="#ffffff" stroke="#e5e7eb" strokeWidth="1" />
                  <circle cx={n.cx} cy={n.cy} r="9" fill="#16a34a" />
                </g>
              ))}
            </svg>

            <div className="absolute" style={{ left: "3%", top: "78%", width: "24%" }}>
              <h3 className="mb-2 text-xl font-bold text-(--brand-ink)">{journeySteps[0].title}</h3>
              <p className="text-sm leading-relaxed text-(--secondary) md:text-base">{journeySteps[0].desc}</p>
            </div>
            <div className="absolute text-left" style={{ left: "21%", top: "2%", width: "30%" }}>
              <h3 className="mb-2 text-xl font-bold text-(--brand-ink)">{journeySteps[1].title}</h3>
              <p className="text-sm leading-relaxed text-(--secondary) md:text-base">{journeySteps[1].desc}</p>
            </div>
            <div className="absolute" style={{ left: "68%", top: "34%", width: "30%" }}>
              <h3 className="mb-2 text-xl font-bold text-(--brand-ink)">{journeySteps[2].title}</h3>
              <p className="text-sm leading-relaxed text-(--secondary) md:text-base">{journeySteps[2].desc}</p>
            </div>
          </div>

          <div className="relative mx-auto max-w-md lg:hidden">
            <div className="absolute bottom-4 left-[27px] top-4 w-0.5 bg-linear-to-b from-(--primary) to-(--accent)" aria-hidden />
            <div className="space-y-8">
              {journeySteps.map((step) => (
                <div key={step.no} className="relative flex gap-5">
                  <div className="relative z-10 flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--primary) to-(--accent) text-xl font-extrabold text-white shadow-md shadow-(--primary)/30">
                    {step.no}
                  </div>
                  <div className="pt-1">
                    <h3 className="mb-1.5 text-lg font-bold text-(--brand-ink)">{step.title}</h3>
                    <p className="text-sm leading-relaxed text-(--secondary)">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      {/* ── What Sets Us Apart ────────────────────────────────── */}
      <section className="relative overflow-hidden bg-(--background) py-12 md:py-16">
        <div className="container relative mx-auto px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="mx-auto mb-10 max-w-3xl text-center md:mb-12">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-white px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary) shadow-sm">
              <FaShieldHalved className="text-sm" /> Why Choose Us
            </span>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
              What Sets Us Apart?
            </h2>
            <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
              We make complex legal work simple with expertise, transparency, and support at every step.
            </p>
          </div>

          <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-3">
            {differentiators.map((item) => (
              <article
                key={item.no}
                className={`group relative flex flex-col overflow-hidden rounded-3xl p-7 transition duration-300 hover:-translate-y-1.5 ${
                  item.featured
                    ? "bg-linear-to-br from-(--primary) via-(--accent) to-(--primary-hover) text-white shadow-xl shadow-(--primary)/30 md:-mt-4 md:mb-4"
                    : "border border-slate-100 bg-white text-(--brand-ink) shadow-sm hover:shadow-lg"
                }`}
              >
                <span
                  className={`text-4xl font-extrabold ${
                    item.featured ? "text-white/30" : "text-(--primary)/15"
                  }`}
                >
                  {item.no}
                </span>
                <div
                  className={`mb-4 mt-2 inline-flex h-12 w-12 items-center justify-center rounded-xl ${
                    item.featured
                      ? "bg-white/15 text-white ring-1 ring-white/25"
                      : "bg-(--primary)/10 text-(--primary)"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{item.title}</h3>
                <p
                  className={`text-sm leading-relaxed ${
                    item.featured ? "text-white/90" : "text-(--secondary)"
                  }`}
                >
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials (auto-scroll marquee) ────────────────── */}
      <section className="relative overflow-hidden bg-white py-12 md:py-16">
        <div className="container relative mx-auto mb-9 px-6 sm:px-12 md:px-20 lg:px-25">
          <div className="mx-auto max-w-3xl text-center">
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-(--primary)/20 bg-(--primary)/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-(--primary)">
              Testimonials
            </span>
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-(--brand-ink) sm:text-3xl md:text-4xl">
              What Our Clients Say
            </h2>
            <p className="text-base leading-relaxed text-(--secondary) sm:text-lg">
              Trusted by thousands of businesses across the country. Here's what they have to say.
            </p>
          </div>
        </div>

        {isLoadingReviews ? (
          <div className="py-12 text-center text-lg text-(--secondary)">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-12 text-center text-lg text-(--secondary)">No reviews available yet.</div>
        ) : (
          <div className="testimonial-viewport w-full overflow-hidden py-4">
            <div
              className="testimonial-track"
              style={{ "--marquee-duration": `${marqueeDuration}s` }}
            >
              {marqueeReviews.map((review, index) => (
                <div
                  key={`${review._id || review.fullName}-${index}`}
                  className="mx-3 flex w-[300px] shrink-0 flex-col rounded-3xl border border-(--primary)/10 bg-linear-to-br from-[color-mix(in_srgb,var(--brand-pale)_35%,white)] to-white p-6 shadow-sm sm:w-[350px]"
                >
                  <div className="mb-4 flex shrink-0 items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-(--primary) to-(--accent) text-2xl font-semibold text-white">
                      {review.fullName.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="truncate text-lg font-semibold text-(--brand-ink)">
                        {review.fullName}
                      </h3>
                      <p className="truncate text-sm text-(--secondary)">
                        {review.serviceAvailed?.serviceName || "Service"}
                      </p>
                    </div>
                  </div>
                  <div className="mb-3 flex shrink-0 gap-1">
                    {Array.from({ length: review.starRating }).map((_, i) => (
                      <IoMdStar key={i} className="text-xl text-amber-400" />
                    ))}
                  </div>
                  <p className="line-clamp-5 overflow-hidden text-base leading-relaxed text-(--secondary)">
                    "{review.message}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* ── Still Have Questions? CTA ─────────────────────────── */}
      <section className="bg-(--background) px-6 pb-14 pt-2 sm:px-12 md:px-20 lg:px-25">
        <div className="container mx-auto">
          <div className="grid gap-6 lg:grid-cols-5">
            <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-(--primary) via-(--accent) to-(--primary-hover) p-8 text-white shadow-xl shadow-(--primary)/30 lg:col-span-3 md:p-10">
              <div
                className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
              <h2 className="relative mb-3 text-2xl font-bold sm:text-3xl">Still Have Questions?</h2>
              <p className="relative mb-7 max-w-lg text-sm text-white/90 sm:text-base">
                Get tailored advice on business registration, legal requirements, and compliance
                from our seasoned professionals—available to assist you anytime.
              </p>
              <div className="relative flex flex-col gap-3 sm:flex-row">
                <a
                  href={`tel:${commondata.phones.primary}`}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-3 text-sm font-semibold text-(--primary) shadow-md transition hover:scale-[1.03] active:scale-95"
                >
                  <FaPhoneAlt className="h-3.5 w-3.5" /> Call Us Now
                </a>
                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-white/60 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/10"
                >
                  Contact Us <FaArrowRightLong className="h-4 w-4" />
                </Link>
              </div>
            </div>

            <div className="grid gap-4 lg:col-span-2">
              <a
                href={`tel:${commondata.phones.primary}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
                  <FaPhoneAlt className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-(--secondary)">Call Us</span>
                  <span className="block truncate font-semibold text-(--brand-ink)">{commondata.phones.primary}</span>
                </span>
              </a>
              <a
                href={`mailto:${commondata.emails.support}`}
                className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
                  <MdEmail className="h-5 w-5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-(--secondary)">Email Us</span>
                  <span className="block truncate font-semibold text-(--brand-ink)">{commondata.emails.support}</span>
                </span>
              </a>
              <div className="flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-(--primary)/10 text-(--primary)">
                  <FaMapMarkerAlt className="h-4 w-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-xs font-semibold uppercase tracking-wide text-(--secondary)">Visit Us</span>
                  <span className="block truncate font-semibold text-(--brand-ink)">
                    {commondata.address.city}, {commondata.address.state}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
