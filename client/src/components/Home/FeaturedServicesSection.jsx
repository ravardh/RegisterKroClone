import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { FaArrowRightLong } from "react-icons/fa6";
import { IoMdStar } from "react-icons/io";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/DataContext";

const coverGradients = [
  { from: "#6d28d9", to: "#7c3aed" },
  { from: "#f59e0b", to: "#d97706" },
  { from: "#10b981", to: "#059669" },
  { from: "#3b82f6", to: "#2563eb" },
  { from: "#ec4899", to: "#db2777" },
];

const FeaturedServicesSection = () => {
  const [featuredServices, setFeaturedServices] = useState([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredPaused, setFeaturedPaused] = useState(false);
  const [featuredOffset, setFeaturedOffset] = useState(220);

  const { featuredServices: featuredData, isDataLoaded } = useAppData();

  useEffect(() => {
    if (isDataLoaded) {
      setFeaturedServices(featuredData);
      setIsLoadingFeatured(false);
    }
  }, [featuredData, isDataLoaded]);

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

  useEffect(() => {
    if (featuredPaused || featuredServices.length <= 1) return;
    const timer = setTimeout(() => {
      setFeaturedIndex((prev) =>
        prev >= featuredServices.length - 1 ? 0 : prev + 1
      );
    }, 3000);
    return () => clearTimeout(timer);
  }, [featuredIndex, featuredPaused, featuredServices.length]);

  return (
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
                  className="absolute -left-8 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-left-20 lg:-left-32"
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
                  className="absolute -right-8 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/80 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-right-20 lg:-right-32"
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
  );
};

export default FeaturedServicesSection;
