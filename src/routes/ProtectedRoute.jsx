import React from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isAuth = localStorage.getItem("vv_auth");
  const location = useLocation();

  if (!isAuth) {
    // Save the current path to redirect back after login
    localStorage.setItem("vv_redirect", location.pathname);
    return <Navigate to="/auth" replace />;
  }

  return children;
};

export default ProtectedRoute;
