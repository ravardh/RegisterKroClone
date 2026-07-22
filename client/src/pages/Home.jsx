import React from "react";
import commondata from "../assets/common.json";
import SEOHelmet from "../components/SEOHelmet";
import {
  HomePromoBanner,
  HeroSection,
  FeaturedServicesSection,
  OurProcessSection,
  HowItWorksSection,
  WhatSetsUsApartSection,
  TestimonialsSection,
  QuestionsCtaSection,
} from "../components/Home";

const Home = () => {
  const homeSchemaData = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "TaxProSolution",
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

  return (
    <>
      <HomePromoBanner />

      <SEOHelmet
        title="TaxProSolution - Get Your Business Registered in 7 Days"
        description="Fast, reliable business registration and setup services. Get your business registered in just 7 days with expert consultation. Trusted by 2000+ happy clients."
        keywords="business registration, company registration, GST registration, startup registration, business setup"
        canonicalUrl="https://taxprosolution.co.in/"
        structuredData={homeSchemaData}
      />

      <HeroSection />
      <FeaturedServicesSection />
      <OurProcessSection />
      <HowItWorksSection />
      <WhatSetsUsApartSection />
      <TestimonialsSection />
      <QuestionsCtaSection />
    </>
  );
};

export default Home;
