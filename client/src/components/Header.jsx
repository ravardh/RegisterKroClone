import React, { useState } from "react";
import { IoMenuSharp, IoClose } from "react-icons/io5";
import { Link } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", to: "/" },
    { name: "About", to: "/about" },
    { name: "Services", to: "/services" },
    { name: "Contact", to: "/contact" },
  ];

  return (
    <>
      <header className="bg-(--background) shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="shrink-0">
              <Link to="/" className="text-2xl font-bold text-(--primary)">
                RegisterKaro
              </Link>
            </div>

            <nav className="hidden md:flex space-x-8">
              {navLinks.map((link) => (
                <Link
                  to={link.to}
                  className="text-gray-700 hover:text-(--primary-hover) font-medium"
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Login Button */}
            <div className="hidden md:block">
              <Link
                to="/login"
                className="bg-(--primary) text-white px-6 py-2 rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 font-medium"
              >
                Login
              </Link>
            </div>

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-md text-gray-700 hover:text-(--primary) hover:bg-gray-100 focus:outline-none"
            >
              {isMenuOpen ? (
                <IoClose className="h-6 w-6" />
              ) : (
                <IoMenuSharp className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="md:hidden pb-4">
              <div className="flex flex-col space-y-3">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    to={link.to}
                    className="text-gray-700 hover:text-(--primary) transition-colors duration-200 font-medium px-2 py-2"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}

                <Link
                  to="/login"
                  className="bg-(--primary) text-white px-6 py-2 rounded-lg hover:bg-(--primary-hover) transition-colors duration-200 font-medium text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
