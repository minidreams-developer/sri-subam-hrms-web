import React from "react";
// import { Navigate, useLocation } from 'react-router-dom';

const Authmiddleware = ({ children }) => {
  //   const location = useLocation();
  //   const authUser = localStorage.getItem('authUser');
  //   if (!authUser) {
  //     // Redirect to login page with the return url
  //     return <Navigate to="/" state={{ from: location }} replace />;
  //   }
  //   try {
  //     // Parse the auth user data
  //     const userData = JSON.parse(authUser);
  //     // Check if we have valid tokens
  //     if (!userData.tokens?.access?.token) {
  //       localStorage.removeItem('authUser');
  //       return <Navigate to="/" state={{ from: location }} replace />;
  //     }
  //     // Check if access token is expired
  //     const accessTokenExpiry = new Date(userData.tokens.access.expires).getTime();
  //     if (accessTokenExpiry < Date.now()) {
  //       // Token is expired, clear storage and redirect to login
  //       localStorage.removeItem('authUser');
  //       return <Navigate to="/" state={{ from: location }} replace />;
  //     }
  //     return children;
  //   } catch {
  //     // If there's any error parsing the auth data, redirect to login
  //     localStorage.removeItem('authUser');
  //     return <Navigate to="/" state={{ from: location }} replace />;
  //   }
  return children;
};

export default Authmiddleware;
