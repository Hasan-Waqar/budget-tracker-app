import React, { useState } from "react";
import { Form, Input, Button, Row, Col, InputNumber, App } from "antd";
import {
  MailOutlined,
  LockOutlined,
  UserOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import GenericForm from "../components/common/GenericForm";
import AuthLayout, { AuthLink } from "../components/common/AuthLayout";
import signupIllustration from "../assets/images/signup-illustration.png";
import PrimaryButton from "../components/common/PrimaryButton";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const newUser = await authService.signup(values);

      setUser(newUser);

      navigate("/expenses");
    } catch (error) {
      console.error("Signup API call failed:", error);
      notification.error({
        message: "Signup Failed",
        description:
          error.response?.data?.message || "An error occurred during signup.",
        placement: "topRight",
      });
    } finally {
      setLoading(false);
    }
  };

  const signupFormFields = [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      span: 12,
      rules: [{ required: true }],
      prefix: <UserOutlined />,
      placeholder: "Cameron",
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      span: 12,
      rules: [{ required: true }],
      placeholder: "Williamson",
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      rules: [{ required: true, type: "email" }],
      prefix: <MailOutlined />,
      placeholder: "test@gmail.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      rules: [{ required: true }],
      prefix: <LockOutlined />,
      placeholder: "Enter your password",
    },
    {
      name: "confirmPassword",
      label: "Confirm Password",
      type: "password",
      rules: [
        { required: true, message: "Please confirm your password!" },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue("password") === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error("The two passwords do not match!"));
          },
        }),
      ],
      prefix: <LockOutlined />,
      placeholder: "Confirm your password",
    },
    {
      name: "budgetLimit",
      label: "Budget Limit",
      type: "number",
      rules: [{ required: true }],
      placeholder: "Enter Amount",
      prefix: "$",
    },
  ];

  const signupFooter = (
    <>
      <Form.Item style={{ marginTop: "16px" }}>
        <PrimaryButton block htmlType="submit" loading={loading}>
          SIGN UP
        </PrimaryButton>
      </Form.Item>
      <AuthLink text="Already have an account?" linkText="Log In" to="/login" />
    </>
  );

  return (
    <AuthLayout
      illustration={signupIllustration}
      title="Sign Up"
      subTitle="Welcome to our community"
      headerMargin="24px"
    >
      <GenericForm
        formInstance={form}
        fields={signupFormFields}
        onFinish={onFinish}
        submitText="SIGN UP"
        loading={loading}
        footer={signupFooter}
      />
    </AuthLayout>
  );
};

export default SignupPage;
