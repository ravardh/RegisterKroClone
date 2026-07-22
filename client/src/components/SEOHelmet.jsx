import React, { useEffect } from 'react';

const SEOHelmet = ({
  title = 'TaxProSolution - Professional Tax & Registration Services',
  description = 'Expert tax and registration services with 15+ years experience. Trusted by 2000+ businesses.',
  keywords = 'tax services, business registration, GST, corporate registration',
  canonicalUrl = 'https://taxprosolution.com/',
  ogImage = 'https://taxprosolution.com/og-image.jpg',
  ogType = 'website',
  structuredData = null,
}) => {
  useEffect(() => {
    // Update title
    document.title = title;

    // Update or create meta tags
    updateMetaTag('name', 'description', description);
    updateMetaTag('name', 'keywords', keywords);
    updateMetaTag('property', 'og:title', title);
    updateMetaTag('property', 'og:description', description);
    updateMetaTag('property', 'og:image', ogImage);
    updateMetaTag('property', 'og:type', ogType);
    updateMetaTag('property', 'twitter:title', title);
    updateMetaTag('property', 'twitter:description', description);

    // Update canonical URL
    updateCanonicalUrl(canonicalUrl);

    // Add structured data if provided
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [title, description, keywords, canonicalUrl, ogImage, ogType, structuredData]);

  // Scroll to top only on initial page load/route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [canonicalUrl]);

  const updateMetaTag = (attribute, name, content) => {
    let tag = document.querySelector(`meta[${attribute}="${name}"]`);
    if (!tag) {
      tag = document.createElement('meta');
      tag.setAttribute(attribute, name);
      document.head.appendChild(tag);
    }
    tag.setAttribute('content', content);
  };

  const updateCanonicalUrl = (url) => {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement('link');
      link.setAttribute('rel', 'canonical');
      document.head.appendChild(link);
    }
    link.setAttribute('href', url);
  };

  const updateStructuredData = (data) => {
    let script = document.querySelector('script[type="application/ld+json"]');
    if (!script) {
      script = document.createElement('script');
      script.setAttribute('type', 'application/ld+json');
      document.head.appendChild(script);
    }
    script.innerHTML = JSON.stringify(data);
  };

  return null; // This component doesn't render anything
};

export default SEOHelmet;
