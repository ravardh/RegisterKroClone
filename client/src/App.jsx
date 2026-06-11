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
import Refund from "./pages/Refund";
import CookiePolicy from "./pages/CookiePolicy";
import Disclaimer from "./pages/Disclaimer";
import Sitemap from "./pages/Sitemap";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import CreateBlog from "./pages/CreateBlog";
import EventsWebinars from "./pages/EventsWebinars";
import MediaPress from "./pages/MediaPress";
import SuperAdminDashboard from "./pages/dashboards/AdminDashboard";
import RMDashboard from "./pages/dashboards/RMDashboard";
import BloggerDashboard from "./pages/dashboards/BloggerDashboard";
import ManagerDashboard from "./pages/dashboards/ManagerDashboard";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";
import Careers from "./pages/Careers";
import CommonData from "./assets/common.json";
import WhatsAppIcon from "./assets/whatsapp.png";
import { DataProvider } from "./context/DataContext";
const isDashboard = location.pathname.includes("Dashboard");

const Layout = () => {
  const location = useLocation();
  const isDashboard = ["/superAdminDashboard", "/adminDashboard", "/rmDashboard", "/bloggerDashboard", "/managerDashboard"].includes(
    location.pathname,
  );
  //console.log("App Started");

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0 });
  }, [location.pathname, location.search, location.hash]);

  return (
    <>
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        toastOptions={{
          duration: 5000,
          style: {
            background: "#363636",
            color: "#fff",
          },
          success: {
            duration: 5000,
            theme: {
              primary: "#4aed88",
            },
          },
          error: {
            duration: 5000,
            theme: {
              primary: "#ff4b4b",
            },
          },
        }}
      />
      <TopHeader />
      <Header />

      <main className="w-full max-w-[100vw] overflow-x-clip">
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
          <Route path="/refund" element={<Refund />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/create-blog" element={<CreateBlog />} />
          <Route path="/events-webinars" element={<EventsWebinars />} />
          <Route path="/media-press" element={<MediaPress />} />
          <Route
            path="/adminDashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/superAdminDashboard"
            element={
              <ProtectedRoute requiredRole="superAdmin">
                <SuperAdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/managerDashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <ManagerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/bloggerDashboard"
            element={
              <ProtectedRoute requiredRole="blogger">
                <BloggerDashboard />
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
          <Route path="/careers" element={<Careers />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout />

        {!isDashboard && (
          <a
            href={`https://wa.me/${CommonData.phones.whatsapp}?text=Hi%20There%0AI%20went%20through%20your%20website%20and%20found%20it%20to%20be%20interesting.%0AI%20want%20more%20information%20about%20the%20services%20you%20offer.%0AThank%20You`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-4 left-4 z-50 max-sm:bottom-[max(1rem,env(safe-area-inset-bottom))] max-sm:left-[max(1rem,env(safe-area-inset-left))] sm:bottom-5 sm:left-5"
            aria-label="Chat on WhatsApp"
          >
            <img
              src={WhatsAppIcon}
              alt=""
              className="h-11 w-11 sm:h-12 sm:w-12 hover:scale-110 duration-300"
            />
          </a>
        )}
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
