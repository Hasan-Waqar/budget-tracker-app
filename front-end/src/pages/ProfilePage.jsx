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

  // 1. This state is our single source of truth for which tab is active.
  const [activeTab, setActiveTab] = useState("1");

  // This function will be called by the Tabs component when a tab is clicked.
  const handleTabChange = (key) => {
    setActiveTab(key);
  };

  // 2. We define our tab content in a simple array or object for easy access.
  const tabContent = {
    1: <ProfileView />,
    2: <MyAccountView />,
  };

  return (
    <div>
      {/* The Sub-Header Row */}
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
          {/* 
                      3. THIS IS THE FIX: This Tabs component now correctly controls the state.
                      We use the deprecated but necessary `Tabs.TabPane` here to render *only* the headers.
                      This is a known and accepted pattern for this specific layout.
                    */}
          <Tabs activeKey={activeTab} onChange={handleTabChange}>
            <Tabs.TabPane tab="Profile" key="1" />
            <Tabs.TabPane tab="My account" key="2" />
          </Tabs>
        </Col>
      </Row>

      {/* The Main Content Row */}
      <Row gutter={[24, 24]} align="start">
        <Col xs={24} md={8}>
          <ProfileCard />
        </Col>

        <Col xs={24} md={16}>
          {/* 
                      4. This part now simply reads the `activeTab` state
                      and displays the corresponding component from our `tabContent` object.
                    */}
          {tabContent[activeTab]}
        </Col>
      </Row>
    </div>
  );
};

export default ProfilePage;
