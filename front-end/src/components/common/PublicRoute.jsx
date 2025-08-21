import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  // If a user exists, redirect them away from the public auth pages
  return user ? <Navigate to="/expenses" replace /> : <Outlet />;
};

export default PublicRoute;
