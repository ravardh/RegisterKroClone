import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import TrackStatus from "./pages/TrackStatus";
import Contact from "./pages/Contact";
import Feedback from "./pages/Feedback";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import Sitemap from "./pages/Sitemap";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import RMDashboard from "./pages/dashboards/RMDashboard";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import axiosInstance from "./config/api";

const Layout = () => {
  const location = useLocation();
  const isDashboard = ["/adminDashboard", "/rmDashboard"].includes(location.pathname);
  console.log("App Started");
  
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <Toaster />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route
            path="/service/:serviceId"
            element={<ServiceDetail />}
          />
          <Route path="/trackStatus" element={<TrackStatus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rmDashboard"
            element={
              <ProtectedRoute requiredRole="rm">
                <RMDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  useEffect(() => {
    const initializeAppData = async () => {
      try {
        // Check if data already exists in session storage
        if (sessionStorage.getItem("appDataInitialized")) {
          return;
        }

        // Fetch all categories
        const categoriesResponse = await axiosInstance.get("/public/categories");
        const categories = categoriesResponse.data.data || [];
        
        // Fetch all subcategories and services
        const allSubCategories = {};
        const allServices = {};

        for (const category of categories) {
          const subCategoriesResponse = await axiosInstance.get(
            `/public/categories/${category._id}/subcategories`
          );
          const subCategories = subCategoriesResponse.data.data || [];
          
          allSubCategories[category._id] = subCategories;

          for (const subCategory of subCategories) {
            const servicesResponse = await axiosInstance.get(
              `/public/subcategories/${subCategory._id}/services`
            );
            const services = servicesResponse.data.data || [];
            allServices[subCategory._id] = services;
          }
        }

        // Store all data in session storage
        sessionStorage.setItem("categories", JSON.stringify(categories));
        sessionStorage.setItem("subCategories", JSON.stringify(allSubCategories));
        sessionStorage.setItem("services", JSON.stringify(allServices));
        sessionStorage.setItem("appDataInitialized", "true");
      } catch (error) {
        console.error("Error initializing app data:", error);
      }
    };

    initializeAppData();
  }, []);

  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
