import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Space, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  PieChartOutlined,
  WalletOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logoPath from "../../assets/logo/logo.png";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import AppHeader from "./AppHeader";

const { Header, Sider, Content } = Layout;

const styles = {
  siderHeader: {
    height: "64px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0 16px",
    overflow: "hidden",
  },
  logo: {
    height: "32px",
    marginRight: "12px",
  },
  logoText: {
    color: "#333",
    fontWeight: 600,
    fontSize: "18px",
    whiteSpace: "nowrap",
    transition: "opacity 0.2s ease-in-out, width 0.2s ease-in-out",
  },
};

const AppLayout = ({ children }) => {
  const { user, setUser } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

  const menuItems = [
    {
      key: "/analysis",
      icon: <PieChartOutlined />,
      label: <Link to="/analysis">Analysis</Link>,
    },
    {
      key: "/expenses",
      icon: <WalletOutlined />,
      label: <Link to="/expenses">Expenses</Link>,
    },
  ];
  if (user && user.role === "Admin") {
    menuItems.push({
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    });
  }
  menuItems.push({
    key: "logout",
    icon: <LogoutOutlined />,
    label: "Logout",
    onClick: handleLogout,
  });

  const profileMenuItems = [
    {
      key: "profile",
      label: (
        <Link to="/profile">
          <Space>
            <UserOutlined /> Profile
          </Space>
        </Link>
      ),
    },
    {
      key: "logout",
      label: (
        <Space>
          <LogoutOutlined /> Logout
        </Space>
      ),
      onClick: handleLogout,
    },
  ];

  const dropdownHeader = (
    <div style={{ padding: "16px", borderBottom: "1px solid #f0f0f0" }}>
      <Space>
        <Avatar size="large" src={user?.pfp}>
          {user?.firstName?.charAt(0)}
        </Avatar>
        <div>
          <div
            style={{ fontWeight: 500 }}
          >{`${user?.firstName} ${user?.lastName}`}</div>
          <div style={{ color: "gray" }}>{user?.email}</div>
        </div>
      </Space>
    </div>
  );

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        theme="dark"
        width={250}
        style={{ background: "white" }}
      >
        <div style={styles.siderHeader}>
          <img src={logoPath} alt="Logo" style={styles.logo} />
          <span
            style={{
              ...styles.logoText,
              opacity: collapsed ? 0 : 1,
              width: collapsed ? 0 : "auto",
              marginLeft: collapsed ? 0 : "12px",
            }}
          >
            Budget Tracker
          </span>
        </div>
        <Menu
          theme="light"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          style={{ background: "white" }}
        />
      </Sider>
      <Layout>
        <AppHeader
          showSiderToggle={true}
          isSiderCollapsed={collapsed}
          onSiderToggle={() => setCollapsed(!collapsed)}
        />
        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: "#f0f2f5",
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
