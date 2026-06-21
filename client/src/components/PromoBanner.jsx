import React, { useState, useEffect, useCallback } from "react";

/**
 * PromoBanner — Peek-from-right floating promotional banner.
 *
 * Behaviour:
 *  • After `delay` ms the banner mounts and enters "peek" state:
 *    only ~20% of the panel is visible on the right edge with a
 *    continuous nudge animation to invite interaction.
 *  • Clicking the peeking edge expands the panel fully (+ backdrop blur).
 *  • The ✕ button / Escape / clicking the overlay collapses back to peek.
 *  • If no image is found at `imageSrc` the component renders nothing.
 *
 * Props:
 *  - imageSrc  : string  – e.g. "/img/img.jpeg"
 *  - alt       : string  – image alt text
 *  - delay     : number  – ms before banner peeks in (default 1000)
 */
const PromoBanner = ({
  imageSrc = "/img/img.jpeg",
  alt = "Special Offer",
  delay = 1000,
}) => {
  const [mounted, setMounted]         = useState(false);  // DOM presence
  const [peeking, setPeeking]         = useState(false);  // 20% visible
  const [expanded, setExpanded]       = useState(false);  // fully open
  const [imageExists, setImageExists] = useState(false);
  const [checking, setChecking]       = useState(true);

  /* ── 1. Verify image exists ── */
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
    return () => { cancelled = true; };
  }, [imageSrc]);

  /* ── 2. Mount then animate into peek state ── */
  useEffect(() => {
    if (checking || !imageExists) return;
    setMounted(true);
    const t = setTimeout(() => setPeeking(true), delay);
    return () => clearTimeout(t);
  }, [checking, imageExists, delay]);

  /* ── 3. Expand on click of peek strip ── */
  const handleExpand = useCallback(() => {
    if (!expanded) setExpanded(true);
  }, [expanded]);

  /* ── 4. Collapse back to peek (not unmount) ── */
  const handleCollapse = useCallback(() => {
    setExpanded(false);
  }, []);

  /* ── 5. ESC collapses ── */
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e) => { if (e.key === "Escape") handleCollapse(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded, handleCollapse]);

  if (!mounted) return null;

  /* Which CSS state classes to apply */
  const bannerCls = [
    "promo-peek-banner",
    peeking   ? "promo-peek-banner--peeking"  : "",
    expanded  ? "promo-peek-banner--expanded" : "",
  ].join(" ");

  return (
    <>
      {/* Backdrop — only when expanded */}
      {expanded && (
        <div
          className="promo-peek-overlay"
          onClick={handleCollapse}
          aria-hidden="true"
        />
      )}

      {/* Banner panel */}
      <aside
        className={bannerCls}
        role="complementary"
        aria-label="Promotional offer"
        aria-expanded={expanded}
      >
        {/* ── Peek-strip click target (left visible edge when collapsed) ── */}
        {!expanded && (
          <button
            className="promo-peek-banner__tab"
            onClick={handleExpand}
            aria-label="Open promotional offer"
            id="promo-banner-peek-btn"
          >
            {/* Vertical label on the peek strip */}
            <span className="promo-peek-banner__tab-label" aria-hidden="true">
              🎉 Offer
            </span>
            {/* Arrow chevron pointing left (inviting click) */}
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
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* ── Full panel content ── */}
        <div className="promo-peek-banner__panel">
          {/* Top gradient strip */}
          <div className="promo-peek-banner__strip" aria-hidden="true" />

          {/* Close button */}
          <button
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

          {/* Festive badge */}
          <div className="promo-peek-banner__badge" aria-hidden="true">
            🎉 Special Offer
          </div>

          {/* Banner image */}
          <div className="promo-peek-banner__img-wrap">
            <img
              src={imageSrc}
              alt={alt}
              className="promo-peek-banner__img"
              draggable={false}
            />
            <div className="promo-peek-banner__img-shimmer" aria-hidden="true" />
          </div>

          {/* CTA row */}
          <div className="promo-peek-banner__footer">
            <p className="promo-peek-banner__tagline">
              Limited time deal — don't miss it!
            </p>
            <a
              href="/services"
              className="promo-peek-banner__cta"
              id="promo-banner-cta-link"
            >
              Explore Now
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
