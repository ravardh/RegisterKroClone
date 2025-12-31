import React from 'react'

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
              <span className="text-xl font-semibold">RegisterKaro</span>
            </div>
            <p className="mt-4 text-sm text-gray-400 max-w-sm">
              Simple, fast and reliable company registration, GST and compliance services - expert help at every step.
            </p>

            <div className="flex space-x-3 mt-4">
              <a href="#" aria-label="Facebook" className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M22 12a10 10 0 10-11.5 9.9v-7h-2.2v-2.9h2.2V9.4c0-2.2 1.3-3.5 3.3-3.5.9 0 1.8.1 1.8.1v2h-1c-1 0-1.3.6-1.3 1.2v1.5h2.2l-.3 2.9h-1.9v7A10 10 0 0022 12z" />
                </svg>
              </a>
              <a href="#" aria-label="Twitter" className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M22 5.8c-.6.3-1.2.5-1.9.6a3.3 3.3 0 001.4-1.8 6.6 6.6 0 01-2.1.8 3.3 3.3 0 00-5.6 3c-2.8-.1-5.3-1.5-6.9-3.6A3.3 3.3 0 004.1 9c0 1 .5 1.9 1.2 2.4-.5 0-1-.1-1.5-.4v.1c0 1.6 1.1 3 2.6 3.3-.5.1-1 .2-1.5.1.4 1.3 1.6 2.3 3 2.3A6.6 6.6 0 012 19.5 9.3 9.3 0 007.2 21c6.2 0 9.6-5.2 9.6-9.6v-.4c.7-.5 1.3-1.1 1.8-1.8-.6.3-1.3.5-2 .6z" />
                </svg>
              </a>
              <a href="#" aria-label="LinkedIn" className="p-2 bg-gray-800 rounded hover:bg-gray-700">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-gray-300">
                  <path d="M4.98 3.5A2.5 2.5 0 112.5 6a2.5 2.5 0 012.48-2.5zM3 8.98h4v12H3v-12zM9 8.98h3.8v1.6h.1c.5-.9 1.7-1.8 3.4-1.8 3.6 0 4.2 2.4 4.2 5.6v6.6h-4v-5.9c0-1.4 0-3.2-2-3.2-2 0-2.3 1.6-2.3 3.1v6h-4v-12z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:w-2/3">
            <div>
              <h4 className="font-semibold mb-3">Company</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Services</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Company Registration</a></li>
                <li><a href="#" className="hover:text-white">GST Registration</a></li>
                <li><a href="#" className="hover:text-white">Compliance</a></li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">Support</h4>
              <ul className="text-sm text-gray-400 space-y-2">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">FAQ</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-800 pt-6">
          <div className="max-w-6xl mx-auto px-6 text-sm text-gray-500 flex flex-col md:flex-row justify-between items-center">
            <span>© {new Date().getFullYear()} RegisterKro. All rights reserved.</span>
            <div className="flex space-x-4 mt-4 md:mt-0">
              <a href="#" className="hover:text-white">Privacy</a>
              <a href="#" className="hover:text-white">Terms</a>
              <a href="#" className="hover:text-white">Sitemap</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Footer