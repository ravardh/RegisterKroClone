import React from 'react'
import { Link } from 'react-router-dom'
import CommonData from '../assets/common.json'

const TopHeader = () => {
  const whatsappNumber = CommonData.phones.primary.replace(/\s+/g, '')
  const email = CommonData.emails.support
  
  return (
    <div className="bg-[#1c2023] border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-8 py-2 sm:py-2.5 justify-between items-center">
          <div className="flex flex-wrap gap-2 sm:gap-3 items-center justify-center text-white text-xs sm:text-sm font-medium">
            <span className="hidden sm:inline">Call Us:</span>
            <a 
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-yellow-400 transition-colors duration-300"
            >
              {CommonData.phones.primary}
            </a>
            <span className="hidden sm:inline">|</span>
            <a 
              href={`mailto:${email}`}
              className="hover:text-yellow-400 transition-colors duration-300 truncate max-w-[180px] sm:max-w-none"
            >
              {email}
            </a>
          </div>
          
          <nav className="flex gap-3 sm:gap-6 md:gap-8 items-center flex-wrap justify-center">
            <Link 
              to="/about" 
              className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
            >
              Contact
            </Link>
            <Link 
              to="/trackStatus" 
              className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300 whitespace-nowrap"
            >
              Track Status
            </Link>
            <Link 
              to="/login" 
              className="text-white text-xs sm:text-sm font-medium hover:text-yellow-400 transition-colors duration-300"
            >
              Login
            </Link>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default TopHeader
