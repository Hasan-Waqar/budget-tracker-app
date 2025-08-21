import React, { useState } from "react";
import { Layout, Menu, Button, Avatar, Space } from "antd";
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
  const { logout } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const { setUser } = useAuth();
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
    {
      key: "/users",
      icon: <UserOutlined />,
      label: <Link to="/users">Users</Link>,
    },
    {
      key: "/logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

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
        <Header
          style={{
            padding: "0 24px",
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />
          <Space size="middle">
            <Button type="text" shape="circle" icon={<BellOutlined />} />
            <Button
              type="text"
              shape="circle"
              style={{ padding: 0 }}
              onClick={() => navigate("/profile")}
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </Button>
          </Space>
        </Header>
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
