import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  FaFacebook,
  FaLinkedin,
  FaInstagram,
  FaYoutube,
  FaEye,
} from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";
import CommonData from "../assets/common.json";
import { useAppData } from "../context/DataContext";
import axiosInstance from "../config/api";

/** Main nav categories only (same as header) */
const MAX_FOOTER_CATEGORIES = 5;
/** Max service links per category; rest via "View all" */
const MAX_SERVICES_PER_CATEGORY = 8;

const getCategoryServices = (categoryId, subCategoriesData, servicesData) => {
  const subs = [...(subCategoriesData[categoryId] || [])].sort((a, b) => {
    const seqA = a.sequence ?? 999;
    const seqB = b.sequence ?? 999;
    if (seqA !== seqB) return seqA - seqB;
    return a.name.localeCompare(b.name);
  });

  const categoryServices = [];
  subs.forEach((sub) => {
    const subServices = [...(servicesData[sub._id] || [])].sort((a, b) => {
      const seqA = a.sequence ?? 999;
      const seqB = b.sequence ?? 999;
      if (seqA !== seqB) return seqA - seqB;
      return a.serviceName.localeCompare(b.serviceName);
    });
    categoryServices.push(...subServices);
  });
  return categoryServices;
};

const splitIntoColumns = (items, columnCount = 4) => {
  if (!items.length) {
    return Array.from({ length: columnCount }, () => []);
  }
  const perCol = Math.ceil(items.length / columnCount);
  return Array.from({ length: columnCount }, (_, i) =>
    items.slice(i * perCol, (i + 1) * perCol),
  );
};

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const { categories, subCategories, services, isDataLoaded } = useAppData();

  const fullAddress = `${CommonData.address.line1}, ${CommonData.address.city}, ${CommonData.address.state} ${CommonData.address.postalCode}, ${CommonData.address.country}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  const footerCategories = useMemo(() => {
    return [...categories]
      .filter((cat) => {
        const order = parseInt(cat.headerOrder, 10);
        return !Number.isNaN(order) && order >= 1 && order <= MAX_FOOTER_CATEGORIES;
      })
      .sort((a, b) => parseInt(a.headerOrder, 10) - parseInt(b.headerOrder, 10));
  }, [categories]);

  const categorySections = useMemo(() => {
    return footerCategories
      .map((category) => {
        const allServices = getCategoryServices(
          category._id,
          subCategories,
          services,
        );
        return {
          category,
          allServices,
          visibleServices: allServices.slice(0, MAX_SERVICES_PER_CATEGORY),
          hasMore: allServices.length > MAX_SERVICES_PER_CATEGORY,
        };
      })
      .filter((section) => section.visibleServices.length > 0);
  }, [footerCategories, subCategories, services]);

  useEffect(() => {
    const fetchVisitorCount = async () => {
      try {
        const hasVisited = sessionStorage.getItem("hasVisited");
        if (!hasVisited) {
          const res = await axiosInstance.post("/public/visitor-count/increment");
          setVisitorCount(res.data.count);
          sessionStorage.setItem("hasVisited", "true");
        } else {
          const res = await axiosInstance.get("/public/visitor-count");
          setVisitorCount(res.data.count);
        }
      } catch (error) {
        console.error("Error fetching visitor count:", error);
      }
    };
    fetchVisitorCount();
  }, []);

  return (
    <footer className="bg-gray-900 text-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 xl:gap-16">
          {/* Left sidebar */}
          <aside className="lg:w-[280px] xl:w-[300px] shrink-0">
            <Link to="/" className="inline-flex items-center">
              <img
                src="/taxpro-logo.png"
                alt={CommonData.companyName}
                className="site-logo site-logo--footer"
              />
            </Link>

            <p className="mt-5 text-sm leading-relaxed text-gray-400">
              {fullAddress}
            </p>

            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 text-sm font-medium text-(--primary-light) hover:text-white transition-colors"
            >
              Open on Google Maps
              <HiArrowRight className="text-base" />
            </a>

            <div className="flex gap-3 mt-6">
              {[
                { href: CommonData.social.facebook, icon: FaFacebook, label: "Facebook" },
                { href: CommonData.social.instagram, icon: FaInstagram, label: "Instagram" },
                { href: CommonData.social.linkedin, icon: FaLinkedin, label: "LinkedIn" },
              ].map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition text-gray-300 hover:text-(--primary-light)"
                >
                  <Icon className="text-lg" />
                </a>
              ))}
            </div>

            <nav className="mt-6 flex flex-col gap-2 text-sm text-gray-400">
              <Link to="/about" className="hover:text-(--primary-light) transition-colors">
                About Us
              </Link>
              <Link to="/blog" className="hover:text-(--primary-light) transition-colors">
                Blog
              </Link>
              <Link to="/services" className="hover:text-(--primary-light) transition-colors">
                Services
              </Link>
            </nav>

            <div className="mt-8">
              <p className="text-sm font-semibold text-(--primary-light) mb-3">
                Help Centre
              </p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <Link
                  to="/contact"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Contact Us
                </Link>
                <Link
                  to="/trackStatus"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Track Application
                </Link>
                <Link
                  to="/feedback"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Post Feedback
                </Link>
              </nav>
            </div>

            <div className="mt-6">
              <p className="text-sm font-semibold text-(--primary-light) mb-3">
                Legal
              </p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <Link
                  to="/terms"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Terms & Conditions
                </Link>
                <Link
                  to="/privacy"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Privacy Policy
                </Link>
                <Link
                  to="/refund"
                  className="hover:text-(--primary-light) transition-colors"
                >
                  Refund Policy
                </Link>
              </nav>
            </div>

            <div className="mt-6 flex items-center gap-2 px-3 py-1.5 bg-gray-800/60 rounded-full border border-gray-700/50 text-xs text-gray-400 w-fit">
              <FaEye className="text-(--primary-light)" />
              <span>Total Visitors:</span>
              <span className="text-white font-semibold tracking-wider">
                {visitorCount.toLocaleString()}
              </span>
            </div>
          </aside>

          {/* Category sections — services in 4 columns */}
          <div className="flex-1 min-w-0 space-y-10">
            {!isDataLoaded && (
              <p className="text-sm text-gray-500">Loading services...</p>
            )}

            {isDataLoaded && categorySections.length === 0 && (
              <p className="text-sm text-gray-500">No services available yet.</p>
            )}

            {categorySections.map(
              ({ category, visibleServices, hasMore, allServices }) => {
                const columns = splitIntoColumns(visibleServices, 4);
                return (
                  <section key={category._id}>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-widest text-(--primary) mb-2">
                      {category.name}
                    </h3>
                    <hr className="border-0 h-px mb-5 bg-(--primary)" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-x-6 gap-y-2">
                      {columns.map((column, colIndex) => (
                        <ul key={colIndex} className="space-y-2 min-w-0">
                          {column.map((service) => (
                            <li key={service._id}>
                              <Link
                                to={`/service/${service._id}`}
                                className="text-sm text-gray-400 hover:text-(--primary-light) transition-colors leading-snug block"
                              >
                                {service.serviceName}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      ))}
                    </div>
                    {hasMore && (
                      <Link
                        to="/services"
                        state={{ selectedCategoryName: category.name }}
                        className="inline-flex items-center gap-1.5 mt-4 text-sm font-medium text-(--primary-light) hover:text-white transition-colors"
                      >
                        View all {allServices.length} services
                        <HiArrowRight className="text-base" />
                      </Link>
                    )}
                  </section>
                );
              },
            )}

            {isDataLoaded && categorySections.length > 0 && (
              <Link
                to="/services"
                className="inline-flex items-center gap-1.5 text-sm font-semibold text-(--primary-light) hover:text-white transition-colors pt-2"
              >
                Browse all services
                <HiArrowRight className="text-base" />
              </Link>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 lg:mt-14 border-t border-gray-800 pt-6">
          <div className="text-xs text-gray-500 flex flex-col gap-3 sm:gap-4 md:flex-row md:justify-between md:items-center text-center md:text-left">
            <span className="order-3 md:order-1">
              © {new Date().getFullYear()} {CommonData.companyName}. All rights
              reserved.
            </span>
            <div className="flex flex-wrap gap-x-3 gap-y-2 justify-center md:justify-start order-2">
              <Link to="/terms" className="hover:text-(--primary-light) transition-colors">
                Terms & Conditions
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link to="/privacy" className="hover:text-(--primary-light) transition-colors">
                Privacy Policy
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link to="/refund" className="hover:text-(--primary-light) transition-colors">
                Refund Policy
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link to="/sitemap" className="hover:text-(--primary-light) transition-colors">
                Sitemap
              </Link>
            </div>
            <div className="order-1 md:order-3 text-xs leading-relaxed text-center md:text-right">
              Developed by{" "}
              <a
                href="https://www.linkedin.com/in/ravardh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-(--primary-light) transition-colors"
              >
                Raj Vardhan
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/amit-mulmule-5266011b2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-(--primary-light) transition-colors"
              >
                Amit S Mulmule
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/loveleshrathore/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-(--primary-light) transition-colors"
              >
                Lovelesh Rathore
              </a>
              , and{" "}
              <a
                href="https://www.linkedin.com/in/porwalaastha/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-(--primary-light) transition-colors"
              >
                Aastha Porwal
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
