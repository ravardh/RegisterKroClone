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
          const res = await axiosInstance.post(
            "/public/visitor-count/increment",
          );
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
        { label: "Employee Login", to: "/login" },
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
    <footer className="bg-(--brand-black) border-t border-(--border) font-inherit">
      {/* Top divider */}
      <div className="h-px bg-(--border)" />

      {/* Main content */}
      <div className="max-w-6xl mx-auto px-6 pt-10 sm:pt-8 lg:pt-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-7 lg:gap-10 items-start">
          <div className="flex flex-col gap-3">
            <Link to="/" className="inline-block leading-none">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center">
                <img
                  src="/TaxProLogo.png"
                  alt={CommonData.companyName}
                  className="w-full h-full object-cover "
                />
              </div>
              <h2 className="text-(--primary) text-md sm:text-lg font-semibold">
                {CommonData.companyName}
              </h2>
              </div>
            </Link>
            <p className="text-sm leading-6 text-(--text-light) m-0">{CommonData.tagline}</p>
            {/* Google Maps Embed – coordinates configured via .env */}
            <div className="w-full overflow-hidden rounded-lg border border-(--border) mt-1">
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
            <div key={col.title} className="flex flex-col gap-2.5">
              <h3 className="text-sm font-bold text-(--border) m-0 mb-1.5 tracking-normal">{col.title}</h3>
              <ul className="list-none m-0 p-0 flex flex-col gap-1.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link to={link.to} className="text-sm text-(--text-light) no-underline transition-colors duration-150 inline-block hover:text-(--primary)">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="h-px bg-(--border) mt-9" />
        <div className="flex flex-col items-center justify-center gap-1.5 py-3.5 lg:py-4 text-center">
          {/* Copyright */}
          <span className="text-xs text-(--text-light) text-center">
            © {new Date().getFullYear()} {CommonData.companyName}. All rights
            reserved.
          </span>
          {/* Developed by – below copyright */}
          <span className="text-xs text-(--text-light) text-center">
            Developed by{" "}
            <a
              href="https://www.linkedin.com/in/ravardh/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-light) no-underline transition-colors duration-150 hover:text-(--primary) hover:underline"
            >
              Raj Vardhan
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/amit-mulmule-5266011b2/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-light) no-underline transition-colors duration-150 hover:text-(--primary) hover:underline"
            >
              Amit S Mulmule
            </a>
            ,{" "}
            <a
              href="https://www.linkedin.com/in/loveleshrathore/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-light) no-underline transition-colors duration-150 hover:text-(--primary) hover:underline"
            >
              Lovelesh Rathore
            </a>
            , and{" "}
            <a
              href="https://www.linkedin.com/in/porwalaastha/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-(--text-light) no-underline transition-colors duration-150 hover:text-(--primary) hover:underline"
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
