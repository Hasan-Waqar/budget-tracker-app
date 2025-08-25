import React from "react";
import { Layout, Button, Avatar, Space, Dropdown } from "antd";
import {
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  LogoutOutlined,
  UserOutlined,
  BellOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
import logoPath from "../../assets/logo/logo.png";

const { Header } = Layout;

/**
 * A reusable application header.
 * @param {boolean} showSiderToggle - If true, shows the menu collapse/expand button.
 * @param {Function} onSiderToggle - The function to call when the sider toggle is clicked.
 * @param {boolean} isSiderCollapsed - The current collapsed state of the sider.
 */
const AppHeader = ({
  showSiderToggle = false,
  onSiderToggle,
  isSiderCollapsed,
}) => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate("/login");
  };

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
          <div style={{ fontWeight: 500 }}>
            {`${user?.firstName || ""} ${user?.lastName || ""}`.trim()}
          </div>
          <div style={{ color: "gray" }}>{user?.email}</div>
        </div>
      </Space>
    </div>
  );

  return (
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
      <Space align="center">
        {/*
          HERE IS THE FIX:
          The Sider Toggle button is now ALWAYS rendered if showSiderToggle is true.
          It no longer prevents the logo/title from rendering.
        */}
        {showSiderToggle && (
          <Button
            type="text"
            icon={
              isSiderCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />
            }
            onClick={onSiderToggle}
            style={{
              fontSize: "16px",
              width: 64,
              height: 64,
              marginRight: "16px",
            }}
          />
        )}

        {/* 
          The Logo and Title are now rendered based on whether we are in the main app layout.
          If we are toggling the sider, it means we are in AppLayout, so we don't need to show the logo here.
          The logo will be in the Sider itself.
          If we are NOT toggling the sider (i.e., in ProfileLayout), we show the logo.
        */}
        {!showSiderToggle && (
          <div style={{ display: "flex", alignItems: "center" }}>
            <img
              src={logoPath}
              alt="Logo"
              style={{ height: "32px", marginRight: "12px" }}
            />
            <span style={{ color: "#333", fontWeight: 600, fontSize: "18px" }}>
              Budget Tracker
            </span>
          </div>
        )}
      </Space>
      {/* Right Side: Icons and Profile Dropdown */}
      <Space size="middle">
        <Button type="text" shape="circle" icon={<BellOutlined />} />
        <Dropdown
          menu={{ items: profileMenuItems }}
          trigger={["click"]}
          dropdownRender={(menu) => (
            <div
              style={{
                background: "#fff",
                boxShadow: "0 6px 16px 0 rgba(0, 0, 0, 0.08)",
                borderRadius: "8px",
              }}
            >
              {dropdownHeader}
              {menu}
            </div>
          )}
        >
          <Avatar size="large" src={user?.pfp} style={{ cursor: "pointer" }}>
            {user?.firstName?.charAt(0)}
          </Avatar>
        </Dropdown>
      </Space>
    </Header>
  );
};

export default AppHeader;
