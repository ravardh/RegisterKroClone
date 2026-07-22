import React, { useState, useEffect, useCallback } from "react";

/**
 * PromoBanner — Peek promotional banner.
 * Desktop: peeks from the right edge.
 * Mobile: bottom sheet with a clear open tab + up arrow.
 */
const PromoBanner = ({
  imageSrc = "/img/img.jpeg",
  alt = "Special Offer",
  badgeText = "🎉 Special Offer",
  tabLabel = "🎉 Offer",
  tagline = "Limited time deal — don't miss it!",
  ctaText = "Explore Now",
  ctaLink = "/services",
  delay = 1000,
}) => {
  const [mounted, setMounted] = useState(false);
  const [peeking, setPeeking] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [imageExists, setImageExists] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      try {
        const res = await fetch(imageSrc, { method: "HEAD" });
        if (!cancelled) setImageExists(res.ok);
      } catch {
        if (!cancelled) setImageExists(false);
      } finally {
        if (!cancelled) setChecking(false);
      }
    };
    check();
    return () => {
      cancelled = true;
    };
  }, [imageSrc]);

  useEffect(() => {
    if (checking || !imageExists) return;
    setMounted(true);
    const t = setTimeout(() => setPeeking(true), delay);
    return () => clearTimeout(t);
  }, [checking, imageExists, delay]);

  const handleExpand = useCallback(() => {
    setExpanded(true);
  }, []);

  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => {
      if (e.key === "Escape") handleCollapse();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, handleCollapse]);

  if (!mounted) return null;

  const bannerCls = [
    "promo-peek-banner",
    peeking && !expanded ? "promo-peek-banner--peeking" : "",
    expanded ? "promo-peek-banner--expanded" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {expanded && (
        <div
          className="promo-peek-overlay"
          onClick={handleCollapse}
          aria-hidden="true"
        />
      )}

      <aside
        className={bannerCls}
        role="complementary"
        aria-label="Promotional offer"
        aria-expanded={expanded}
        onClick={!expanded ? handleExpand : undefined}
      >
        {/* Peek / open tab — always first so it sits on top for mobile bottom-sheet peek */}
        {!expanded && (
          <button
            type="button"
            className="promo-peek-banner__tab"
            onClick={(e) => {
              e.stopPropagation();
              handleExpand();
            }}
            aria-label="Open promotional offer"
            id="promo-banner-peek-btn"
          >
            <span className="promo-peek-banner__tab-label" aria-hidden="true">
              {tabLabel}
            </span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className="promo-peek-banner__tab-arrow"
            >
              {/* Up chevron on mobile (CSS rotates); left chevron on desktop */}
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        <div
          className="promo-peek-banner__panel"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="promo-peek-banner__strip" aria-hidden="true" />

          {expanded && (
            <button
              type="button"
              className="promo-peek-banner__close"
              onClick={handleCollapse}
              aria-label="Close promotional banner"
              id="promo-banner-close-btn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                width="16"
                height="16"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          )}

          <div className="promo-peek-banner__badge" aria-hidden="true">
            {badgeText}
          </div>

          <div className="promo-peek-banner__img-wrap">
            <img
              src={imageSrc}
              alt={alt}
              className="promo-peek-banner__img"
              draggable={false}
            />
            <div className="promo-peek-banner__img-shimmer" aria-hidden="true" />
          </div>

          <div className="promo-peek-banner__footer">
            <p className="promo-peek-banner__tagline">{tagline}</p>
            <a
              href={ctaLink}
              className="promo-peek-banner__cta"
              id="promo-banner-cta-link"
            >
              {ctaText}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
                width="14"
                height="14"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </a>
          </div>
        </div>
      </aside>
    </>
  );
};

export default PromoBanner;
