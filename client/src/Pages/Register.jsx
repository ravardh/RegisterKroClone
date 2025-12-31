import React from "react";
import CommonData from "../assets/common.json";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";

const Register = () => {
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-(--background) text-(--text)">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-3 mb-6 text-center">
            <h1 className="text-2xl font-semibold text-(--text)">
              Create your account
            </h1>
            <p className="text-sm text-(--secondary)">
              Join {CommonData.companyName} — it only takes a minute.
            </p>
          </div>

          <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Full name
              </label>
              <input
                type="text"
                name="name"
                required
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Email
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Phone
              </label>
              <input
                type="tel"
                name="number"
                required
                placeholder="94**********"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-(--secondary) space-x-1">
                <input type="checkbox" />
                <span>I Agree to the </span>
                <Link to="/terms" className="text-(--primary) hover:underline">
                  Terms
                </Link>{" "}
                <span>and</span>
                <Link
                  to="/privacy"
                  className="text-(--primary) hover:underline"
                >
                  Privacy Policy
                </Link>
              </label>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-lg text-white font-medium transition-opacity bg-(--primary) hover:bg-(--primary-hover)"
            >
              Create account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
