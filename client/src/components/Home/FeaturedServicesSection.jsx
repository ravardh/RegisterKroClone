import React, { useState, useEffect, useMemo, useRef } from "react";
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
  const [isMobile, setIsMobile] = useState(false);
  const mobileTrackRef = useRef(null);
  const mobileCardRefs = useRef([]);
  const isAutoScrollingRef = useRef(false);
  const scrollUnlockTimerRef = useRef(null);
  const loopSnapPendingRef = useRef(false);

  const hasMobileLoop = featuredServices.length > 1;
  const mobileSlides = useMemo(() => {
    if (!hasMobileLoop) return featuredServices;
    const first = featuredServices[0];
    const last = featuredServices[featuredServices.length - 1];
    return [last, ...featuredServices, first];
  }, [featuredServices, hasMobileLoop]);
  const shouldLockDesktopFeatured = !isMobile && featuredServices.length <= 3;
  const desktopFeaturedVisibleDepth = featuredServices.length === 4 ? 1 : 2;
  const showFeaturedArrows = isMobile
    ? featuredServices.length > 1
    : featuredServices.length > 3;

  const { featuredServices: featuredData, featuredLoaded } = useAppData();

  useEffect(() => {
    if (!featuredLoaded) return;
    setFeaturedServices(featuredData || []);
    setIsLoadingFeatured(false);
  }, [featuredData, featuredLoaded]);

  useEffect(() => {
    const onResize = () => {
      const w = window.innerWidth;
      setIsMobile(w < 640);
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
    if (shouldLockDesktopFeatured) {
      setFeaturedIndex(0);
    }
  }, [shouldLockDesktopFeatured]);

  useEffect(() => {
    return () => clearTimeout(scrollUnlockTimerRef.current);
  }, []);

  const loopFromEndToStartOnMobile = () => {
    const container = mobileTrackRef.current;
    const firstRealCard = mobileCardRefs.current[1];

    if (!container || !firstRealCard || featuredServices.length <= 1) {
      setFeaturedIndex(0);
      return;
    }

    const gap = 8;
    const step = firstRealCard.offsetWidth + gap;
    const cloneFirstVisualIndex = featuredServices.length + 1;

    isAutoScrollingRef.current = true;
    loopSnapPendingRef.current = true;
    clearTimeout(scrollUnlockTimerRef.current);
    container.scrollTo({ left: cloneFirstVisualIndex * step, behavior: "smooth" });

    // Fallback in case a browser does not emit enough scroll events at the end.
    scrollUnlockTimerRef.current = setTimeout(() => {
      container.scrollTo({ left: step, behavior: "auto" });
      loopSnapPendingRef.current = false;
      setFeaturedIndex(0);
      isAutoScrollingRef.current = false;
    }, 700);
  };

  useEffect(() => {
    if (featuredServices.length <= 1) return;
    if (shouldLockDesktopFeatured) return;
    if (!isMobile && featuredPaused) return;

    const timer = setTimeout(() => {
      if (isMobile && hasMobileLoop && featuredIndex >= featuredServices.length - 1) {
        loopFromEndToStartOnMobile();
        return;
      }

      setFeaturedIndex((prev) =>
        prev >= featuredServices.length - 1 ? 0 : prev + 1
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [featuredIndex, featuredPaused, featuredServices.length, isMobile, hasMobileLoop, shouldLockDesktopFeatured]);

  useEffect(() => {
    if (!isMobile) return;

    const releaseAutoScrollLock = (delay = 450) => {
      clearTimeout(scrollUnlockTimerRef.current);
      scrollUnlockTimerRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, delay);
    };

    const container = mobileTrackRef.current;
    const firstCard = mobileCardRefs.current[hasMobileLoop ? 1 : 0];
    if (!container || !firstCard) return;

    const cardWidth = firstCard.offsetWidth;
    const gap = 8;
    const baseIndex = hasMobileLoop ? 1 : 0;
    const left = (featuredIndex + baseIndex) * (cardWidth + gap);
    isAutoScrollingRef.current = true;
    container.scrollTo({ left, behavior: "smooth" });
    releaseAutoScrollLock();

    return () => clearTimeout(scrollUnlockTimerRef.current);
  }, [featuredIndex, hasMobileLoop, isMobile]);

  useEffect(() => {
    if (!isMobile || !hasMobileLoop) return;
    const container = mobileTrackRef.current;
    const firstRealCard = mobileCardRefs.current[1];
    if (!container || !firstRealCard) return;

    const cardWidth = firstRealCard.offsetWidth;
    const gap = 8;
    container.scrollTo({ left: cardWidth + gap, behavior: "auto" });
  }, [isMobile, hasMobileLoop, mobileSlides.length]);

  const handleMobileTrackScroll = () => {
    if (!isMobile || !mobileTrackRef.current || featuredServices.length <= 1) return;

    const container = mobileTrackRef.current;
    const firstCard = mobileCardRefs.current[hasMobileLoop ? 1 : 0];
    if (!firstCard) return;

    const releaseAutoScrollLock = (delay = 120) => {
      clearTimeout(scrollUnlockTimerRef.current);
      scrollUnlockTimerRef.current = setTimeout(() => {
        isAutoScrollingRef.current = false;
      }, delay);
    };

    const cardWidth = firstCard.offsetWidth;
    const gap = 8;

    const step = cardWidth + gap;
    const visualIndex = Math.round(container.scrollLeft / step);

    if (loopSnapPendingRef.current) {
      if (visualIndex >= mobileSlides.length - 1) {
        isAutoScrollingRef.current = true;
        container.scrollTo({ left: step, behavior: "auto" });
        loopSnapPendingRef.current = false;
        setFeaturedIndex(0);
        releaseAutoScrollLock();
      }
      return;
    }

    if (isAutoScrollingRef.current) return;

    if (hasMobileLoop && visualIndex <= 0) {
      isAutoScrollingRef.current = true;
      container.scrollTo({ left: featuredServices.length * step, behavior: "auto" });
      setFeaturedIndex(featuredServices.length - 1);
      releaseAutoScrollLock();
      return;
    }

    if (hasMobileLoop && visualIndex >= mobileSlides.length - 1) {
      isAutoScrollingRef.current = true;
      container.scrollTo({ left: step, behavior: "auto" });
      setFeaturedIndex(0);
      releaseAutoScrollLock();
      return;
    }

    const logicalIndex = hasMobileLoop ? visualIndex - 1 : visualIndex;
    const boundedIndex = Math.max(0, Math.min(logicalIndex, featuredServices.length - 1));
    if (boundedIndex !== featuredIndex) {
      setFeaturedIndex(boundedIndex);
    }
  };

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
            className="relative mx-auto max-w-6xl lg:max-w-7xl"
            onMouseEnter={() => {
              if (!isMobile) setFeaturedPaused(true);
            }}
            onMouseLeave={() => {
              if (!isMobile) setFeaturedPaused(false);
            }}
          >
            {showFeaturedArrows && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setFeaturedIndex((prev) =>
                      prev <= 0 ? featuredServices.length - 1 : prev - 1
                    )
                  }
                  className="absolute -left-5 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-left-6 lg:-left-8"
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
                  className="absolute -right-5 top-1/2 z-40 -translate-y-1/2 rounded-full bg-white/85 p-2.5 text-(--primary) shadow-md backdrop-blur-sm transition hover:bg-(--primary) hover:text-white sm:-right-6 lg:-right-8"
                  aria-label="Next featured service"
                >
                  <FaChevronRight size={18} />
                </button>
              </>
            )}

            {isMobile ? (
              <div
                ref={mobileTrackRef}
                className="flex snap-x snap-mandatory gap-2 overflow-x-auto px-0 pb-2 no-scrollbar"
                onScroll={handleMobileTrackScroll}
              >
                {mobileSlides.map((service, index) => {
                  const gradient = coverGradients[index % coverGradients.length];
                  return (
                    <div
                      key={`${service._id}-${index}`}
                      ref={(el) => {
                        mobileCardRefs.current[index] = el;
                      }}
                      className="min-w-[85%] max-w-[85%] snap-start"
                    >
                      <div className="relative flex h-72 flex-col overflow-hidden rounded-2xl bg-white shadow-md ring-1 ring-(--primary)/10">
                        <div
                          className="h-1.5 w-full shrink-0"
                          style={{ background: `linear-gradient(90deg, ${gradient.from}, ${gradient.to})` }}
                          aria-hidden
                        />
                        <div className="flex flex-1 flex-col p-4">
                          <div className="mb-2 flex items-start justify-between">
                            <h3 className="line-clamp-2 flex-1 text-base font-bold text-(--brand-ink)">
                              {service.serviceName}
                            </h3>
                            <span className="ml-2 text-lg" style={{ color: gradient.from }}>
                              <IoMdStar />
                            </span>
                          </div>
                          <p className="mb-3 line-clamp-3 flex-1 text-xs text-(--secondary)">
                            {service.shortDescription || "Comprehensive service for your business needs."}
                          </p>
                          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px]">
                            <span className="rounded-full bg-(--primary)/10 px-2.5 py-1 font-medium text-(--primary)">
                              {service.category?.name || "Category"}
                            </span>
                          </div>
                          <Link
                            to={`/service/${service._id}`}
                            className="mt-auto flex items-center justify-center gap-2 rounded-lg border-2 border-(--primary) px-3 py-2 text-xs font-semibold text-(--primary) transition hover:bg-(--primary) hover:text-white"
                          >
                            View Details <FaArrowRightLong className="h-3.5 w-3.5" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
            <div className="relative flex min-h-80 items-center justify-center overflow-hidden px-10 sm:min-h-84 sm:px-0 md:min-h-88">
              {featuredServices.map((service, index) => {
                let diff = index - featuredIndex;
                if (diff > featuredServices.length / 2) diff -= featuredServices.length;
                if (diff < -featuredServices.length / 2) diff += featuredServices.length;
                if (!isMobile && Math.abs(diff) > desktopFeaturedVisibleDepth) return null;

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
                    className="absolute w-full max-w-70 cursor-pointer sm:w-68 sm:max-w-none md:w-76"
                    onClick={() => {
                      if (!isActive && featuredServices.length > 3) setFeaturedIndex(index);
                    }}
                  >
                    <div
                      className={`relative flex h-76 flex-col overflow-hidden rounded-2xl bg-white transition-all duration-300 ${
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
                            if (!isActive && featuredServices.length > 3) {
                              e.preventDefault();
                            }
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
            )}

          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedServicesSection;
