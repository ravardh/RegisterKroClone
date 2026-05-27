import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isLoggedIn, isAdmin, isSuperAdmin, isRM, isBlogger } = useAuth();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole === "superAdmin" && !isSuperAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "admin" && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "rm" && !isRM) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === "blogger" && !isBlogger && !isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
