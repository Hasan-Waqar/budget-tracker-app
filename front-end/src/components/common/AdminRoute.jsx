import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const AdminRoute = () => {
  const { user } = useAuth();
  return user && user.role === "Admin" ? (
    <Outlet />
  ) : (
    <Navigate to="/expenses" replace />
  );
};

export default AdminRoute;
