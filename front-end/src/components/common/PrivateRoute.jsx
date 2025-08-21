import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { Spin } from "antd"; // Import a loading spinner

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // If we are still checking for a user, show a loading screen
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" />
      </div>
    );
  }

  // After the check is done, redirect if there's no user
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
