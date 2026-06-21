import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaYoutube } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import CommonData from "../assets/common.json";
import { useAppData } from "../context/DataContext";
import axiosInstance from "../config/api";

const Footer = () => {
  const [visitorCount, setVisitorCount] = useState(0);
  const { isDataLoaded } = useAppData();

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

  const columns = [
    {
      title: CommonData.companyName,
      links: [
        { label: "About Us", to: "/about" },
        { label: "Learning Center", to: "/blog" },
        { label: "Contact Us", to: "/contact" },
        { label: "Careers", to: "/careers" },
        { label: "Media & Press", to: "/media-press" },
      ],
    },
    {
      title: "Platforms",
      links: [
        { label: "Business Search", to: "/services" },
        { label: "Track Application", to: "/trackStatus" },
        { label: "Events & Webinars", to: "/events-webinars" },
        { label: "Developer Resources", to: "/about" },
      ],
    },
    {
      title: "Usage",
      links: [
        { label: "Terms & Conditions", to: "/terms" },
        { label: "Privacy Policy", to: "/privacy" },
        { label: "Refund Policy", to: "/refund" },
        { label: "Cookie Policy", to: "/cookie-policy" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Confidentiality Policy", to: "/privacy" },
        { label: "Disclaimer Policy", to: "/disclaimer" },
        { label: "Sitemap", to: "/sitemap" },
        { label: "Feedback", to: "/feedback" },
      ],
    },
  ];

  const socialLinks = [
    {
      href: CommonData.social.facebook,
      icon: FaFacebook,
      label: "Facebook",
    },
    {
      href: CommonData.social.twitter,
      icon: FaTwitter,
      label: "Twitter",
    },
    {
      href: `mailto:${CommonData.emails.support}`,
      icon: MdEmail,
      label: "Email",
    },
  ];

  return (
    <footer className="footer-root">
      {/* Top divider */}
      <div className="footer-top-divider" />

      {/* Main content */}
      <div className="footer-container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="footer-logo-link">
              <img
                src="/taxpro-logo-rect.webp"
                alt={CommonData.companyName}
                className="site-logo site-logo--footer-light"
              />
            </Link>
            <p className="footer-tagline">
              {CommonData.tagline}
            </p>
            {/* Google Maps Embed – coordinates configured via .env */}
            <div className="footer-map-wrap">
              <iframe
                title={`${CommonData.companyName} Location`}
                src={`https://maps.google.com/maps?q=${import.meta.env.VITE_MAP_LAT},${import.meta.env.VITE_MAP_LNG}&t=&z=${import.meta.env.VITE_MAP_ZOOM ?? 16}&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="140"
                style={{ border: 0, borderRadius: "0.75rem" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* ── Right: Nav columns ── */}
          {columns.map((col) => (
            <div key={col.title} className="footer-col">
              <h3 className="footer-col-title">{col.title}</h3>
              <ul className="footer-col-links">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="footer-link">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom-divider" />
        <div className="footer-bottom-bar">
          {/* Copyright */}
          <span className="footer-copyright">
            © {new Date().getFullYear()} {CommonData.companyName}. All rights reserved.
          </span>
          {/* Developed by – below copyright */}
          <span className="footer-developed-by">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/ravardh/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dev-link"
            >
              Raj Vardhan
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/amit-mulmule-5266011b2/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dev-link"
            >
              Amit S Mulmule
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/loveleshrathore/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dev-link"
            >
              Lovelesh Rathore
            </a>
            , and{" "}
            <a
              href="https://www.linkedin.com/in/porwalaastha/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-dev-link"
            >
              Aastha Porwal
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
