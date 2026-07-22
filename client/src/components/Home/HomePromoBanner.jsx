import React, { useState, useEffect, lazy, Suspense } from "react";
import axios from "../../config/api";

const PromoBanner = lazy(() => import("../PromoBanner"));

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

const HomePromoBanner = () => {
  const [specialOffer, setSpecialOffer] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;

    // Defer promo fetch so it doesn't compete with hero/critical API calls
    const startFetch = () => {
      axios
        .get("/public/special-offer")
        .then((res) => {
          if (!cancelled) setSpecialOffer(res.data.data || null);
        })
        .catch(() => {
          if (!cancelled) setSpecialOffer(null);
        })
        .finally(() => {
          if (!cancelled) setReady(true);
        });
    };

    const idleId =
      typeof window !== "undefined" && "requestIdleCallback" in window
        ? window.requestIdleCallback(startFetch, { timeout: 2000 })
        : null;
    const timeoutId = idleId == null ? window.setTimeout(startFetch, 600) : null;

    return () => {
      cancelled = true;
      if (idleId != null && "cancelIdleCallback" in window) {
        window.cancelIdleCallback(idleId);
      }
      if (timeoutId != null) window.clearTimeout(timeoutId);
    };
  }, []);

  if (!ready || !specialOffer?.imageUrl) return null;

  return (
    <Suspense fallback={null}>
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
    </Suspense>
  );
};

export default HomePromoBanner;
