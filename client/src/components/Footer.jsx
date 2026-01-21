import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import CommonData from "../assets/common.json";
import { useAuth } from "../context/AuthContext.jsx";
import ServiceModal from "./ServiceModal.jsx";

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);

  const handleServiceClick = (categoryName) => {
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);
  };

  return (
    <div>
      <footer className="bg-gray-900 text-gray-200 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 px-4 md:px-6 md:justify-between md:items-start">
          <div className="mb-8 md:mb-0 md:w-1/3">
            <Link className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded flex items-center justify-center font-bold text-white">
                TP
              </div>
              <span to={"/"} className="text-xl font-semibold">
                {CommonData.companyName}
              </span>
            </Link>
            <p className="mt-4 text-sm text-gray-400 max-w-sm">
              {CommonData.tagline}
            </p>

            <div className="flex space-x-3 mt-4">
              <a
                href={CommonData.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                <FaFacebook className="text-gray-300 text-lg" />
              </a>
              <a
                href={CommonData.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                <FaTwitter className="text-gray-300 text-lg" />
              </a>
              <a
                href={CommonData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700"
              >
                <FaLinkedin className="text-gray-300 text-lg" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:w-2/3">
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <button
                    onClick={() => handleServiceClick("Company Registration")}
                    className="hover:text-white text-left cursor-pointer"
                  >
                    Company Registration
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleServiceClick("GST Registration")}
                    className="hover:text-white text-left cursor-pointer"
                  >
                    GST Registration
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => handleServiceClick("Compliance")}
                    className="hover:text-white text-left cursor-pointer"
                  >
                    Compliance
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="hover:text-white">
                    Post a Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/trackStatus" className="hover:text-white">
                    Track Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="mx-auto px-4 md:px-6 text-xs md:text-sm text-gray-500 flex flex-col gap-4 md:gap-0 md:flex-row md:justify-between md:items-center text-center md:text-left">
            <span className="order-3 md:order-1 w-full md:w-auto">
              © {new Date().getFullYear()} {CommonData.companyName}. All rights
              reserved.
            </span>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center md:justify-start order-2 md:order-2 items-center">
              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>

              <Link to="/sitemap" className="hover:text-white">
                Sitemap
              </Link>
            </div>
            <div className="order-1 md:order-3 text-xs md:text-sm">
              Developed by{" "}
              <a
                href="https://www.linkedin.com/in/ravardh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                Raj Vardhan
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/loveleshrathore/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                Lovelesh Rathore
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/porwalaastha/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                Aastha Porwal
              </a>
            </div>
          </div>
        </div>
      </footer>
      <ServiceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryName={selectedCategoryName}
      />
    </div>
  );
};

export default Footer;
