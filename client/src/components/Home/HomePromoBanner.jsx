import React, { useState, useEffect } from "react";
import PromoBanner from "../PromoBanner";
import axios from "../../config/api";

const backendBase = (import.meta.env.VITE_BACKEND_URL || "").replace(/\/$/, "");
const assetUrl = (p) => (p ? `${backendBase}${p.startsWith("/") ? p : `/${p}`}` : "");

const HomePromoBanner = () => {
  const [specialOffer, setSpecialOffer] = useState(null);

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
    return () => {
      cancelled = true;
    };
  }, []);

  if (!specialOffer?.imageUrl) return null;

  return (
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
  );
};

export default HomePromoBanner;
