import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/dashboards/AdminDashboard";

const Layout = () => {
  const location = useLocation();
  const isDashboard = location.pathname === "/adminDashboard";

  return (
    <>
      <Header />

      <main className={!isDashboard ? "pt-16" : ""}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/adminDashboard" element={<AdminDashboard />} />
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
