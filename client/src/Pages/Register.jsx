import React from "react";
import { useState } from "react";
import CommonData from "../assets/common.json";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router-dom";
import axios from "../config/api";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Register = () => {

  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [registerData, setRegisterData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setRegisterData((prevData) => ({ ...prevData, [name]: value }));
  };

  const validate = () => {
    let isValid = true;
    const error = {};

    if(
      !/^[a-zA-Z ]+$/.test(registerData.fullName) || registerData.fullName.length < 2 
    ){error.fullName = "Full name must contain only letters and be at least 2 characters long";
    isValid = false;
    }

    if(
      !/^[a-zA-Z0-9._]+@gmail.com$/.test(registerData.email)) {
      error.email = "Email must be a valid Gmail address";
      isValid = false;
    }
    if(
      !/^[6-9]\d{9}$/.test(registerData.phone) ||
      registerData.phone.length !== 10
    ){
      error.phone = "Phone number must be 10 digits long and start with 6-9";
      isValid = false;
    }

    if (
      !registerData.password ||
      registerData.password.length < 6 ||
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*?.,_]).{6,20}$/.test(
        registerData.password
      )
    ) {
      error.password =
        "Password must be at least 6 characters long and contains uppercase letter, lowercase letter, number and special Character";
      isValid = false;
    }

    if (registerData.password !== registerData.confirmPassword) {
      error.confirmPassword = "Passwords do not match";
      isValid = false;
    }
    setError(error);
    return isValid;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!validate()) {
      return;
    }

    try {
      const res = await axios.post("/auth/register", {
        fullName: registerData.fullName,
        email: registerData.email,
        phone: registerData.phone,
        password: registerData.password,
      });
      toast.success("Registration successful! Redirecting to login...");
      setRegisterData({
        fullName: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error(error.response?.data?.message || "Registration failed. Please try again.");
    }
  };

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

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Full name
              </label>
              <input
                type="text"
                id = "fullName"
                name="fullName"
                required
                value={registerData.fullName || ""}
                onChange={handleChange}
                placeholder="Your name"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>
            {error.fullName && (
              <div className="text-red-500 text-sm mb-2">{error.fullName}</div>
            )}
            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Email
              </label>
              <input
                type="email"
                id = "email"
                name="email"
                required
                value={registerData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>
            {error.email && (
              <div className="text-red-500 text-sm mb-2">{error.email}</div>
            )}

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Phone
              </label>
              <input
                type="tel"
                id = "phone"
                name="phone"
                required
                value={registerData.phone || ""}
                onChange={handleChange}
                placeholder="94**********"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>
            {error.phone && (
              <div className="text-red-500 text-sm mb-2">{error.phone}</div>
            )}

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Password
              </label>
              <input
                type="password"
                id = "password"
                name="password"
                required
                value={registerData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>
            {error.password && (
              <div className="text-red-500 text-sm mb-2">{error.password}</div>
            )}

            <div>
              <label className="block text-sm mb-1 text-(--secondary)">
                Confirm Password
              </label>
              <input
                type="password"
                id = "confirmPassword"
                name="confirmPassword"
                required
                value={registerData.confirmPassword || ""}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none bg-white text-(--text) border-gray-200"
              />
            </div>
            {error.confirmPassword && (
              <div className="text-red-500 text-sm mb-2">{error.confirmPassword}</div>
            )}

            <div className="flex items-center justify-between">
              <label className="flex items-center text-sm text-(--secondary) space-x-1">
                <input 
                  type="checkbox" 
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                />
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
              disabled={!termsAccepted}
              className={`w-full py-2 rounded-lg text-white font-medium transition-opacity ${
                termsAccepted
                  ? 'bg-(--primary) hover:bg-(--primary-hover) cursor-pointer'
                  : 'bg-(--primary) cursor-not-allowed opacity-50'
              }`}
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
