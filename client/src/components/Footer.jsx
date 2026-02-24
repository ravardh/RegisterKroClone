import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import CommonData from "../assets/common.json";
import { useAuth } from "../context/AuthContext.jsx";
import ServiceModal from "./ServiceModal.jsx";
import { useAppData } from "../context/DataContext";

const Footer = () => {
  const { isLoggedIn } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState(null);
  const [popularCategories, setPopularCategories] = useState([]);
  const { categories: allCategories } = useAppData();

  // Filter categories by headerOrder 1-5
  useEffect(() => {
    if (allCategories.length > 0) {
      const mainCategories = allCategories
        .filter(cat => {
          const order = parseInt(cat.headerOrder);
          return !isNaN(order) && order >= 1 && order <= 5;
        })
        .sort((a, b) => parseInt(a.headerOrder) - parseInt(b.headerOrder));
      setPopularCategories(mainCategories);
    }
  }, [allCategories]);

  const handleServiceClick = (categoryName) => {
    setSelectedCategoryName(categoryName);
    setIsModalOpen(true);
  };

  return (
    <div>
      <footer className="bg-gray-900 text-gray-200 py-8 md:py-12">
        <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-12 px-4 sm:px-6 md:px-6 md:justify-between md:items-start">
          <div className="mb-6 sm:mb-8 md:mb-0 md:w-1/3 min-w-0">
            <Link className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded flex items-center justify-center font-bold text-white flex-shrink-0">
                TP
              </div>
              <span to={"/"} className="text-lg sm:text-xl font-semibold truncate">
                {CommonData.companyName}
              </span>
            </Link>
            <p className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-400 max-w-sm">
              {CommonData.tagline}
            </p>

            <div className="flex space-x-2 sm:space-x-3 mt-3 sm:mt-4">
              <a
                href={CommonData.social.facebook}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                <FaFacebook className="text-gray-300 text-base sm:text-lg" />
              </a>
              <a
                href={CommonData.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                <FaTwitter className="text-gray-300 text-base sm:text-lg" />
              </a>
              <a
                href={CommonData.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="p-2 bg-gray-800 rounded hover:bg-gray-700 transition"
              >
                <FaLinkedin className="text-gray-300 text-base sm:text-lg" />
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6 md:gap-8 md:w-2/3 w-full">
            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Company</h4>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2">
                <li>
                  <Link to="/about" className="hover:text-white break-words">
                    About
                  </Link>
                </li>
                <li>
                  <Link to="/services" className="hover:text-white break-words">
                    Services
                  </Link>
                </li>
              </ul>
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Popular Services</h4>
              {popularCategories.length > 0 ? (
                <ul className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2">
                  {popularCategories.map((category) => (
                    <li key={category._id}>
                      <button
                        onClick={() => handleServiceClick(category.name)}
                        className="hover:text-white text-left cursor-pointer break-words"
                      >
                        {category.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>

            <div className="min-w-0">
              <h4 className="font-semibold text-sm sm:text-base mb-2 sm:mb-3">Support</h4>
              <ul className="text-xs sm:text-sm text-gray-400 space-y-1 sm:space-y-2">
                <li>
                  <Link to="/contact" className="hover:text-white break-words">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/feedback" className="hover:text-white break-words">
                    Post a Feedback
                  </Link>
                </li>
                <li>
                  <Link to="/trackStatus" className="hover:text-white break-words">
                    Track Status
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 border-t border-gray-800 pt-4 sm:pt-6">
          <div className="px-4 sm:px-6 text-xs text-gray-500 flex flex-col gap-3 sm:gap-4 md:gap-0 md:flex-row md:justify-between md:items-center text-center md:text-left">
            <span className="order-3 md:order-1 w-full md:w-auto">
              © {new Date().getFullYear()} {CommonData.companyName}. All rights
              reserved.
            </span>
            <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center md:justify-start order-2 md:order-2 items-center">
              <Link to="/privacy" className="hover:text-white">
                Privacy
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link to="/terms" className="hover:text-white">
                Terms
              </Link>
              <span className="hidden sm:inline text-gray-600">•</span>
              <Link to="/sitemap" className="hover:text-white">
                Sitemap
              </Link>
            </div>
            <div className="order-1 md:order-3 text-xs leading-relaxed">
              Developed by{" "}
              <a
                href="https://www.linkedin.com/in/ravardh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white break-words"
              >
                Raj Vardhan
              </a>
              ,{" "}
              <a
                href="https://www.linkedin.com/in/loveleshrathore/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white break-words"
              >
                Lovelesh Rathore
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/porwalaastha/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white break-words"
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
