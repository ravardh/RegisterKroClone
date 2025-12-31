import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaLinkedin } from "react-icons/fa";
import CommonData from "../assets/common.json";

const Footer = () => {
  return (
    <div>
      <footer className="bg-gray-900 text-gray-200 py-12">
        <div className="ml-10 flex gap-50 px-6 md:flex md:justify-between md:items-start">
          <div className="mb-8 md:mb-0 md:w-1/3">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-indigo-500 rounded flex items-center justify-center font-bold text-white">
                RK
              </div>
              <span className="text-xl font-semibold">
                {CommonData.companyName}
              </span>
            </div>
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
                  <Link to="/careers" className="hover:text-white">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link to="/pricing" className="hover:text-white">
                    Pricing
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <Link
                    to="/services/company-registration"
                    className="hover:text-white"
                  >
                    Company Registration
                  </Link>
                </li>
                <li>
                  <Link
                    to="/services/gst-registration"
                    className="hover:text-white"
                  >
                    GST Registration
                  </Link>
                </li>
                <li>
                  <Link to="/services/compliance" className="hover:text-white">
                    Compliance
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li>
                  <Link to="/help" className="hover:text-white">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:text-white">
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link to="/faq" className="hover:text-white">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="max-w-8xl mx-auto px-10 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <span>
              © {new Date().getFullYear()} {CommonData.companyName}. All rights
              reserved.
            </span>
            <div className="flex space-x-4 mt-4 md:mt-0">
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
            <div>
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
                href="https://www.linkedin.com/in/ravardh/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white/60 hover:text-white"
              >
                Lovelesh Rathore
              </a>{" "}
              and{" "}
              <a
                href="https://www.linkedin.com/in/ravardh/"
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
    </div>
  );
};

export default Footer;
