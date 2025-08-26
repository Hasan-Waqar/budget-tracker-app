import React, { useState } from "react";
import { Form, Input, Button, Checkbox, App } from "antd";
import {
  MailOutlined,
  LockOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { useAuth } from "../context/AuthContext";
import authService from "../services/authService";

import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { AuthLink } from "../components/layout/AuthLayout";
import loginIllustration from "../assets/images/login-illustration.png";
import axios from "axios";
import PrimaryButton from "../components/common/PrimaryButton";
import GenericForm from "../components/common/GenericForm";

const LoginPage = () => {
  const { login } = useAuth();
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const { notification } = App.useApp();

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const userData = await authService.login(values.email, values.password);
      setUser(userData);
      navigate("/expenses");
    } catch (error) {
      notification.error({});
    } finally {
      setLoading(false);
    }
  };

  const loginFormFields = [
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
  ];
  const loginFooter = (
    <>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
        <Link to="/reset-password" style={{ float: "right" }}>
          Forgot Password?
        </Link>
      </Form.Item>
      <Form.Item>
        <PrimaryButton block htmlType="submit" loading={loading}>
          LOG IN
        </PrimaryButton>
      </Form.Item>
      <AuthLink text="Don't have an account?" linkText="Sign Up" to="/signup" />
    </>
  );

  return (
    <AuthLayout
      illustration={loginIllustration}
      title="Welcome Back!"
      subTitle="Sign in to continue to Budget Tracker"
    >
      <GenericForm
        formInstance={form}
        fields={loginFormFields}
        onFinish={onFinish}
        footer={loginFooter}
      />
    </AuthLayout>
  );
};

export default LoginPage;
