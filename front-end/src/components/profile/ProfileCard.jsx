import React, { useState } from "react";
import {
  Card,
  Avatar,
  Typography,
  Space,
  Button,
  Upload,
  message,
  App,
} from "antd";
import {
  PhoneOutlined,
  MailOutlined,
  GlobalOutlined,
  EnvironmentOutlined,
  EditOutlined,
  CameraOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";

const { Title, Text } = Typography;

const avatarContainerStyle = {
  position: "relative", // Necessary for positioning the overlay
  width: 128,
  height: 128,
  margin: "0 auto 16px auto", // Center the container
  cursor: "pointer",
};

// Style for the semi-transparent overlay that appears on hover
const avatarOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  background: "rgba(0, 0, 0, 0.4)",
  color: "white",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  borderRadius: "50%", // Make it a circle to match the avatar
  opacity: 0, // Hidden by default
  transition: "opacity 0.3s ease-in-out",
  fontSize: "24px",
};

const ProfileCard = () => {
  const { user, setUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  const { message: messageApi } = App.useApp();

  if (!user) {
    return <Card loading={true}></Card>;
  }

  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();
  const location = [user.city, user.state].filter(Boolean).join(", ");
  /*
  const handleBeforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload a JPG/PNG file!");
      return;
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must be smaller than 2MB!");
      return;
    }

    if (isJpgOrPng && isLt2M) {
      // Here you would typically upload the file to your server
      console.log("File is valid, ready to upload:", file);
      // We would call an API service function here, e.g., authService.uploadPfp(file);
      message.success("Profile picture updated (simulation)!");
    }

    return false; // Prevent the default upload behavior
  };
*/
  const handleUpload = async (options) => {
    const { file } = options;

    // --- VALIDATION ---
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      messageApi.error("You can only upload a JPG/PNG file!");
      return; // Stop the function
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      messageApi.error("Image must be smaller than 2MB!");
      return; // Stop the function
    }

    // --- API CALL ---
    try {
      setUploading(true);
      const updatedUser = await authService.uploadPfp(file);
      setUser(updatedUser);
      messageApi.success("Profile picture updated!");
    } catch (error) {
      console.error("Upload failed:", error); // Log the actual error
      messageApi.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card style={{ background: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <Upload name="pfp" showUploadList={false} customRequest={handleUpload}>
          <div
            style={avatarContainerStyle}
            onMouseEnter={(e) => {
              e.currentTarget.querySelector(
                ".avatar-overlay"
              ).style.opacity = 1;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.querySelector(
                ".avatar-overlay"
              ).style.opacity = 0;
            }}
          >
            <Avatar
              size={128}
              src={user.pfp || null}
              style={{ border: "4px solid #f0f0f0" }}
            >
              {!user.pfp && !uploading ? fullName.charAt(0) : null}
            </Avatar>
            <div className="avatar-overlay" style={avatarOverlayStyle}>
              {!uploading && <CameraOutlined />}
            </div>
          </div>
        </Upload>
        <Title level={4}>{fullName}</Title>
        <Text type="secondary">{user.jobTitle || "Job Title Not Set"}</Text>
      </div>
      <Space direction="vertical" style={{ width: "100%", marginTop: 24 }}>
        <Text>
          <PhoneOutlined style={{ marginRight: 8 }} />{" "}
          {user.phone || "Not provided"}
        </Text>
        <Text>
          <MailOutlined style={{ marginRight: 8 }} /> {user.email}
        </Text>
        <Text>
          <EnvironmentOutlined style={{ marginRight: 8 }} />{" "}
          {location || "Not provided"}
        </Text>
      </Space>
    </Card>
  );
  return (
    <Card style={{ background: "#fff" }}>
      <div style={{ textAlign: "center" }}>
        <Avatar
          size={128}
          src={user.avatar}
          style={{ border: "4px solid #f0f0f0", marginBottom: 16 }}
        />
        <Title level={4}>{user.name}</Title>
        <Text type="secondary">{user.jobTitle}</Text>
      </div>
      <Space direction="vertical" style={{ width: "100%", marginTop: 24 }}>
        <Text>
          <PhoneOutlined style={{ marginRight: 8 }} /> {user.phone}
        </Text>
        <Text>
          <MailOutlined style={{ marginRight: 8 }} /> {user.email}
        </Text>
        <Text>
          <EnvironmentOutlined style={{ marginRight: 8 }} /> {user.location}
        </Text>
        <Text>
          <GlobalOutlined style={{ marginRight: 8 }} /> {user.website}
        </Text>
      </Space>
      <div style={{ textAlign: "center", marginTop: 24 }}>
        <Button icon={<EditOutlined />}>Edit Avatar</Button>
      </div>
    </Card>
  );
};

export default ProfileCard;
