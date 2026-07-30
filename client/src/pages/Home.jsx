import React, { lazy, Suspense, memo } from "react";
import commondata from "../assets/common.json";
import SEOHelmet from "../components/SEOHelmet";
import HeroSection from "../components/Home/HeroSection";

/* Below-the-fold sections — split into separate chunks, loaded after first paint */
const HomePromoBanner = lazy(() => import("../components/Home/HomePromoBanner"));
const FeaturedServicesSection = lazy(() =>
  import("../components/Home/FeaturedServicesSection")
);
const OurProcessSection = lazy(() =>
  import("../components/Home/OurProcessSection")
);
const HowItWorksSection = lazy(() =>
  import("../components/Home/HowItWorksSection")
);
const WhatSetsUsApartSection = lazy(() =>
  import("../components/Home/WhatSetsUsApartSection")
);
const TestimonialsSection = lazy(() =>
  import("../components/Home/TestimonialsSection")
);
const QuestionsCtaSection = lazy(() =>
  import("../components/Home/QuestionsCtaSection")
);

const SectionFallback = memo(function SectionFallback() {
  return (
    <div
      className="mx-auto my-8 h-40 max-w-5xl animate-pulse rounded-2xl bg-slate-100/80"
      aria-hidden
    />
  );
});

const homeSchemaData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Tax Pro Solutions",
  description: "Professional tax and registration services for businesses",
  url: "https://taxprosolution.co.in",
  telephone: commondata.phones?.phone || "+91-XXXXXXXXXX",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Your Address",
    addressLocality: "Your City",
    addressRegion: "Your State",
    postalCode: "Your Code",
    addressCountry: "IN",
  },
  priceRange: "₹",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.8",
    reviewCount: "250",
  },
};

const Home = () => {
  return (
    <>
      <Suspense fallback={null}>
        <HomePromoBanner />
      </Suspense>

      <SEOHelmet
        title="Tax Pro Solutions - Get Your Business Registered in 7 Days"
        description="Fast, reliable business registration and setup services. Get your business registered in just 7 days with expert consultation. Trusted by 2000+ happy clients."
        keywords="business registration, company registration, GST registration, startup registration, business setup"
        canonicalUrl="https://taxprosolution.co.in/"
        structuredData={homeSchemaData}
      />

      {/* Above the fold — eager */}
      <HeroSection />

      {/* Below the fold — lazy chunks */}
      <Suspense fallback={<SectionFallback />}>
        <FeaturedServicesSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <OurProcessSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <HowItWorksSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <WhatSetsUsApartSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <TestimonialsSection />
      </Suspense>
      <Suspense fallback={<SectionFallback />}>
        <QuestionsCtaSection />
      </Suspense>
    </>
  );
};

export default Home;
