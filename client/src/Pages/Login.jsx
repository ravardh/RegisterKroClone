import React from "react";
import { useState } from "react";
import axios from "../config/api";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const { setUser, setIsLoggedIn, setIsAdmin, setIsRM } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState({});
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("/auth/login", loginData);
      toast.success("Login successful!");
      setUser(res.data.data);
      sessionStorage.setItem("user", JSON.stringify(res.data.data));
      setIsLoggedIn(true);
      if (res.data.data.role === "SuperAdmin") {
        navigate("/adminDashboard");
        setIsAdmin(true);
        setIsRM(false);
      } else if (res.data.data.role === "rm") {
        setIsAdmin(false);
        setIsRM(true);
        navigate("/rmDashboard");
      } else {
        setIsAdmin(false);
        setIsRM(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error during login:", error);
    }

    setLoginData({
      email: "",
      password: "",
    });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-(--root) px-4">
        <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-(--root)">
              Sign in to your account
            </h2>
            <p className="text-sm text-(--secondary)">
              Welcome back — please enter your details.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-(--root) mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded-md input-focus"
              />
            </div>
            {error.email && (
              <div className="text-sm text-red-500 mt-1">{error.email}</div>
            )}

            <div>
              <label className="block text-sm font-medium text-(--root) mb-1">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full px-4 py-2 border rounded-md input-focus"
              />
            </div>
            {error.password && (
              <div className="text-sm text-red-500 mt-1">{error.password}</div>
            )}

            <div className="flex items-center justify-between text-sm">
              <label className="inline-flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-(--secondary)">Remember me</span>
              </label>
              <a href="#" className="text-sm text-(--primary)">
                Forgot?
              </a>
            </div>

            <button
              type="submit"
              className="w-full py-2 rounded-md bg-(--primary) text-white"
            >
              Sign in
            </button>
          </form>

          <div className="relative my-6 h-0.5 border-t-0 bg-transparent bg-linear-to-r from-transparent via-neutral-900 to-transparent opacity-75 dark:via-neutral-400">
            <span className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-(--background) px-2">
              OR
            </span>
          </div>

          <div className="flex items-center gap-4 ">
            <button className="flex-1 py-2 rounded-lg border flex items-center justify-center gap-2 border-gray-200 bg-white text-(--text) hover:shadow-md">
              <FcGoogle className="w-5 h-5" />
              Google
            </button>
          </div>
          <div className="mt-6 text-center text-sm">
            <span className="text-(--secondary)">Don't have an account? </span>
            <a
              href="/register"
              className="text-(--primary-light) hover:text-(--primary-hover) font-medium"
            >
              Create one
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
