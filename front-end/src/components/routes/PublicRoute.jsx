import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const PublicRoute = () => {
  const { user } = useAuth();

  return user ? <Navigate to="/expenses" replace /> : <Outlet />;
};

export default PublicRoute;
