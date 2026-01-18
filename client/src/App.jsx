import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TopHeader from "./components/TopHeader";
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
import CommonData from './assets/common.json'
import { FaWhatsappSquare } from "react-icons/fa";
import WhatsAppIcon from './assets/whatsapp.png'

const Layout = () => {
  const location = useLocation();
  const isDashboard = ["/adminDashboard", "/rmDashboard"].includes(
    location.pathname,
  );
  console.log("App Started");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <Toaster />
      <TopHeader />
      <Header />

      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/service/:serviceId" element={<ServiceDetail />} />
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
        const categoriesResponse =
          await axiosInstance.get("/public/categories");
        const categories = categoriesResponse.data.data || [];

        // Fetch all subcategories and services
        const allSubCategories = {};
        const allServices = {};

        for (const category of categories) {
          const subCategoriesResponse = await axiosInstance.get(
            `/public/categories/${category._id}/subcategories`,
          );
          const subCategories = subCategoriesResponse.data.data || [];

          allSubCategories[category._id] = subCategories;

          for (const subCategory of subCategories) {
            const servicesResponse = await axiosInstance.get(
              `/public/subcategories/${subCategory._id}/services`,
            );
            const services = servicesResponse.data.data || [];
            allServices[subCategory._id] = services;
          }
        }

        // Store all data in session storage
        sessionStorage.setItem("categories", JSON.stringify(categories));
        sessionStorage.setItem(
          "subCategories",
          JSON.stringify(allSubCategories),
        );
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

      <a
        href={`https://wa.me/${CommonData.phones.whatsapp}?text=Hi%20There%0AI%20went%20through%20your%20website%20and%20found%20it%20to%20be%20interesting.%0AI%20want%20more%20information%20about%20the%20services%20you%20offer.%0AThank%20You`}
        target="_blank"
        className="fixed bottom-5 left-5"
      >
        <img src={WhatsAppIcon} alt="" className="h-12 w-12 hover:scale-110 duration-300" />
      </a>
    </BrowserRouter>
  );
};

export default App;
