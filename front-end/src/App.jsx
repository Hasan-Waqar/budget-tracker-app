import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import { ConfigProvider, App } from "antd";
import AppLayout from "./components/layout/AppLayout";
import HeaderLayout from "./components/layout/HeaderLayout";
import PrivateRoute from "./components/routes/PrivateRoute";
import PublicRoute from "./components/routes/PublicRoute";
import AdminRoute from "./components/routes/AdminRoute";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import ExpensesPage from "./pages/ExpensesPage";
import UsersPage from "./pages/UsersPage";
import ProfilePage from "./pages/ProfilePage";
import AnalysisPage from "./pages/AnalysisPage";
import { AuthProvider } from "./context/AuthContext";
import "antd/dist/reset.css";
import "./index.css";

const theme = {
  token: {
    colorPrimary: "#6c63ff",
    borderRadius: 6,
    colorBgContainer: "#f0f2f5",
    colorLink: "#6c63ff",
    colorLinkHover: "#8a82ff",
  },
  components: {
    Menu: {
      itemSelectedBg: "#6c63ff",
      itemSelectedColor: "#fff",
      itemHoverBg: "rgba(108, 99, 255, 0.1)",
    },
    Descriptions: {
      colorFillAlter: "#fff",
    },
  },
};

const MainAppLayout = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);
const ProfileLayoutRoute = () => (
  <HeaderLayout>
    <Outlet />
  </HeaderLayout>
);

function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
      </Route>

      <Route element={<PrivateRoute />}>
        <Route element={<MainAppLayout />}>
          <Route path="/" element={<Navigate to="/expenses" />} />
          <Route path="/expenses" element={<ExpensesPage />} />
          <Route element={<AdminRoute />}>
            <Route path="/users" element={<UsersPage />} />
          </Route>
          <Route path="/analysis" element={<AnalysisPage />} />
        </Route>

        <Route element={<ProfileLayoutRoute />}>
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>
    </Routes>
  );
}

function AppWrapper() {
  return (
    <Router>
      <AuthProvider>
        <ConfigProvider theme={theme}>
          <App>
            <AppRoutes />
          </App>
        </ConfigProvider>
      </AuthProvider>
    </Router>
  );
}

export default AppWrapper;
