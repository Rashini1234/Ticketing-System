//import React from "react";
//import { Navigate } from "react-router-dom";

//const PrivateRoute = ({ children, role }) => {
  // Mock role for development
  //const mockRole = "CUSTOMER"; // Change to "VENDOR" or "CUSTOMER" as needed
  //const userRole = localStorage.getItem("role") || mockRole;

  // Comment out this block to disable redirection during development
  //if (role !== userRole) {
  //   return <Navigate to="/" />; // Redirect to login if roles don't match
  // }

 // return children; // Allow access to all routes during development
//};

//export default PrivateRoute;

import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, role }) => {
  const userRole = localStorage.getItem("role");

  if (!userRole) {
    console.log("User not logged in. Redirecting to login...");
    return <Navigate to="/" />; 
  }

  if (userRole !== role) {
    console.log(`Access denied. Required role: ${role}, but user role: ${userRole}`);
    return <Navigate to="/" />; 
  }

  return children;
};

export default PrivateRoute;




