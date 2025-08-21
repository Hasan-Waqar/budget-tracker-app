import React from "react";
import { Layout, Button, Avatar, Space } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logoPath from "../../assets/logo/logo.png";

const { Header, Content } = Layout;

const HeaderLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f7f8fc" }}>
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

        {/* Right side of the header */}
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

      <Content style={{ padding: "0px 20px" }}>{children}</Content>
    </Layout>
  );
};

export default HeaderLayout;
