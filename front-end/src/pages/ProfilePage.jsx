import React, { useState } from "react";
import { Row, Col, Tabs, Typography, Button, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import ProfileCard from "../components/profile/ProfileCard";
import ProfileView from "../components/profile/ProfileView";
import MyAccountView from "../components/profile/MyAccountView";

const { Title } = Typography;

const ProfilePage = () => {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("1");

  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  const tabContent = {
    1: <ProfileView />,
    2: <MyAccountView />,
  };

  return (
    <div>
      <Row
        justify="space-between"
        align="middle"
        style={{ marginBottom: "24px" }}
      >
        <Col>
          <Space align="center">
            <Button
              type="text"
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate(-1)}
            />
            <Title level={3} style={{ margin: 0 }}>
              Profile
            </Title>
          </Space>
        </Col>

        <Col>
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <Tabs.TabPane tab="Profile" key="1" />
            <Tabs.TabPane tab="My account" key="2" />
          </Tabs>
        </Col>
      </Row>

      <Row gutter={[24, 24]} align="start">
        <Col xs={24} md={8}>
          <ProfileCard />
        </Col>
        <Col xs={24} md={16}>
          {tabContent[activeTab]}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
