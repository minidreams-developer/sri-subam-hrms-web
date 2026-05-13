import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuthenticated, getAccessToken } from "../helpers/auth_helper";

/**
 * Authentication Middleware Component
 * Protects routes by checking for valid authentication
 */
const Authmiddleware = ({ children }) => {
  const location = useLocation();

  // Check if user is authenticated with valid token
  if (!isAuthenticated()) {
    // Redirect to login page with the return url
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Verify we have an access token
  const accessToken = getAccessToken();
  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // User is authenticated, render children
  return children;
};

export default Authmiddleware;
