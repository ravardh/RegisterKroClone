import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import TrackStatus from "./pages/TrackStatus";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboards/AdminDashboard";
import { Toaster } from "react-hot-toast";
import NotFound from "./pages/NotFound";

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/adminDashboard";

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
            path="/services/:category/:subcategory/:service"
            element={<ServiceDetail />}
          />
          <Route path="/trackStatus" element={<TrackStatus />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isDashboard && <Footer />}
    </>
  );
};

const App = () => {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
};

export default App;
