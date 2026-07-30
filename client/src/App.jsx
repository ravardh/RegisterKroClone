import React, { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import TopHeader from "./components/TopHeader";
import Header from "./components/Header";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import { Toaster } from "react-hot-toast";
import CommonData from "./assets/common.json";
import WhatsAppIcon from "./assets/whatsapp.png";
import { DataProvider } from "./context/DataContext";

/* Non-home routes — code-split so Home's initial JS stays small */
const About = lazy(() => import("./pages/About"));
const Services = lazy(() => import("./pages/Services"));
const ServiceDetail = lazy(() => import("./pages/ServiceDetail"));
const TrackStatus = lazy(() => import("./pages/TrackStatus"));
const Contact = lazy(() => import("./pages/Contact"));
const Feedback = lazy(() => import("./pages/Feedback"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Refund = lazy(() => import("./pages/Refund"));
const CookiePolicy = lazy(() => import("./pages/CookiePolicy"));
const Disclaimer = lazy(() => import("./pages/Disclaimer"));
const Sitemap = lazy(() => import("./pages/Sitemap"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogDetail = lazy(() => import("./pages/BlogDetail"));
const CreateBlog = lazy(() => import("./pages/CreateBlog"));
const EventsWebinars = lazy(() => import("./pages/EventsWebinars"));
const MediaPress = lazy(() => import("./pages/MediaPress"));
const SuperAdminDashboard = lazy(() => import("./pages/dashboards/AdminDashboard"));
const RMDashboard = lazy(() => import("./pages/dashboards/RMDashboard"));
const BloggerDashboard = lazy(() => import("./pages/dashboards/BloggerDashboard"));
const ManagerDashboard = lazy(() => import("./pages/dashboards/ManagerDashboard"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Careers = lazy(() => import("./pages/Careers"));

const PageFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center" aria-busy="true">
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-(--primary) border-t-transparent" />
  </div>
);

const DASHBOARD_PATHS = [
  "/superAdminDashboard",
  "/adminDashboard",
  "/rmDashboard",
  "/bloggerDashboard",
  "/managerDashboard",
];

const Layout = () => {
  const location = useLocation();
  const isDashboard = DASHBOARD_PATHS.includes(location.pathname);

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
        <Suspense fallback={<PageFallback />}>
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
        </Suspense>
      </main>

      {!isDashboard && <Footer />}

      {!isDashboard && (
        <a
          href={`https://wa.me/${CommonData.phones.whatsapp}?text=Hi%20There%0AI%20went%20through%20your%20website%20and%20found%20it%20to%20be%20interesting.%0AI%20want%20more%20information%20about%20the%20services%20you%20offer.%0AThank%20You`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-4 right-4 z-50 max-sm:bottom-[max(1rem,env(safe-area-inset-bottom))] max-sm:right-[max(1rem,env(safe-area-inset-right))] sm:bottom-5 sm:right-5"
          aria-label="Chat on WhatsApp"
        >
          <img
            src={WhatsAppIcon}
            alt=""
            className="h-11 w-11 duration-300 hover:scale-110 sm:h-12 sm:w-12"
            loading="lazy"
            decoding="async"
            width={48}
            height={48}
          />
        </a>
      )}
    </>
  );
};

const App = () => {
  return (
    <DataProvider>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </DataProvider>
  );
};

export default App;
