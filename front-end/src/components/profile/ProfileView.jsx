import React from "react";
import { Card, Descriptions, Typography } from "antd";
import { useAuth } from "../../context/AuthContext";
import dayjs from "dayjs";

const { Paragraph } = Typography;

const ProfileView = () => {
  const { user } = useAuth(); // <-- 2. Get user from context

  if (!user) {
    return <Card loading={true}></Card>;
  }

  const formattedDob = user.dob
    ? dayjs(user.dob).format("DD MMM YYYY")
    : "Not provided";
  const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim();

  return (
    <div>
      <Card title="About Me" style={{ background: "#fff", marginBottom: 16 }}>
        <Paragraph>{user.aboutMe || "No bio provided."}</Paragraph>
      </Card>
      <Card title="Personal Details" style={{ background: "#fff" }}>
        <Descriptions layout="vertical" column={2}>
          <Descriptions.Item label="Full Name">{fullName}</Descriptions.Item>
          <Descriptions.Item label="Father Name">
            {user.fatherName || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">
            {user.gender || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Phone">
            {user.phone || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Zip Code">
            {user.zipCode || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Education">
            {user.education || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {formattedDob}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={1}>
            {user.streetAddress || "Not provided"}
          </Descriptions.Item>
          <Descriptions.Item label="Budget Limit">
            {user.budgetLimit
              ? `${user.budgetLimit.toLocaleString()} PKR`
              : "Not set"}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
  return (
    <div>
      {/* Manually add a smaller margin-bottom to the first card */}
      <Card title="About Me" style={{ background: "#fff", marginBottom: 16 }}>
        <Paragraph style={{ margin: 0 }}>{user.bio}</Paragraph>
      </Card>
      <Card title="Personal Details" style={{ background: "#fff" }}>
        <Descriptions layout="vertical" column={2}>
          <Descriptions.Item label="Full Name">
            {user.fullName}
          </Descriptions.Item>
          <Descriptions.Item label="Father Name">
            {user.fatherName}
          </Descriptions.Item>
          <Descriptions.Item label="Gender">{user.gender}</Descriptions.Item>
          <Descriptions.Item label="Phone">{user.phone}</Descriptions.Item>
          <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
          <Descriptions.Item label="Zip Code">{user.zipCode}</Descriptions.Item>
          <Descriptions.Item label="Education">
            {user.education}
          </Descriptions.Item>
          <Descriptions.Item label="Date of Birth">
            {user.dob}
          </Descriptions.Item>
          <Descriptions.Item label="Address" span={1}>
            {user.address}
          </Descriptions.Item>
          <Descriptions.Item label="Budget Limit">
            {user.budgetLimit}
          </Descriptions.Item>
        </Descriptions>
      </Card>
    </div>
  );
};

export default ProfileView;
