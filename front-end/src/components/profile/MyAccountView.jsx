import React, { useState, useEffect } from "react";
import { Button, Space, Card, Form, App } from "antd";
import dayjs from "dayjs";

import GenericForm from "../common/GenericForm";
import PrimaryButton from "../common/PrimaryButton";
import { useAuth } from "../../context/AuthContext";
import authService from "../../services/authService";
const MyAccountView = () => {
  const { user, setUser } = useAuth();
  const { notification } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [isEditing, setIsEditing] = useState(false);

  const profileFormFields = (isDisabled) => [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "jobTitle",
      label: "Job Title",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "streetAddress",
      label: "Street Address",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "city",
      label: "City",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "state",
      label: "State",
      type: "text",
      span: 4,
      disabled: isDisabled,
    },
    {
      name: "zipCode",
      label: "Zip Code",
      type: "text",
      span: 4,
      disabled: isDisabled,
    },
    {
      name: "address",
      label: "Complete Address",
      type: "text",
      disabled: isDisabled,
    },
    {
      name: "phone",
      label: "Phone Number",
      type: "text",
      span: 12,
      disabled: isDisabled,
    },
    { name: "email", label: "Email", type: "email", span: 12, disabled: true },
    {
      name: "dob",
      label: "Date of Birth",
      type: "date",
      span: 8,
      disabled: isDisabled,
    },
    {
      name: "education",
      label: "Education",
      type: "text",
      span: 8,
      disabled: isDisabled,
    },
    { name: "gender", label: "Gender", type: "text", span: 8 },
    {
      name: "budgetLimit",
      label: "Budget Limit(PKR)",
      type: "number",
      disabled: isDisabled,
    },
    {
      name: "aboutMe",
      label: "About Me / Bio",
      type: "textarea",
      disabled: isDisabled,
    },
  ];

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const updatedUser = await authService.updateProfile(values);

      setUser(updatedUser);
      setIsEditing(false);
      notification.success({
        message: "Profile Updated",
        description: "Your profile has been updated successfully!",
      });
    } catch (error) {
      notification.error({
        message: "Update Failed",
        description: error.response?.data?.message || "An error occurred.",
      });
    } finally {
      setLoading(false);
    }
  };
  const handleCancel = () => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? dayjs(user.dob) : null,
        address: `${user.streetAddress}, ${user.city}, ${user.state}, ${user.zipCode}`,
      });
    }
    setIsEditing(false);
  };

  const formFooter = (
    <Form.Item>
      <Space>
        <PrimaryButton htmlType="submit" loading={loading}>
          Update
        </PrimaryButton>
        <Button onClick={handleCancel}>Cancel</Button>
      </Space>
    </Form.Item>
  );
  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        ...user,
        dob: user.dob ? dayjs(user.dob) : null,
        address: `${user.streetAddress}, ${user.city}, ${user.state}, ${user.zipCode}`,
      });
    }
  }, [user, form]);

  return (
    <Card
      title="My Account"
      extra={
        !isEditing && (
          <Button type="primary" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )
      }
      styles={{
        body: {
          backgroundColor: "white",
        },
      }}
    >
      <GenericForm
        formInstance={form}
        fields={profileFormFields(!isEditing)}
        onFinish={onFinish}
        loading={loading}
        footer={isEditing ? formFooter : null}
      />
    </Card>
  );
};

export default MyAccountView;
