import React from "react";
import { Layout, Button, Avatar, Space } from "antd";
import { BellOutlined, UserOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import logoPath from "../../assets/logo/logo.png";
import AppHeader from "./AppHeader";

const { Header, Content } = Layout;

const HeaderLayout = ({ children }) => {
  const navigate = useNavigate();

  return (
    <Layout style={{ minHeight: "100vh", background: "#f7f8fc" }}>
      <AppHeader />

      <Content style={{ padding: "0px 20px" }}>{children}</Content>
    </Layout>
  );
};

export default HeaderLayout;
