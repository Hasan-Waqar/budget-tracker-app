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

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const { notification } = App.useApp();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    try {
      await signup(values);
    } catch (error) {
      console.error("Signup API call failed:", error);
      notification.error({
        message: "Signup Failed",
        description:
          error.response?.data?.message || "An error occurred during signup.",
        placement: "topRight",
      });
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
      type: "password", // Using our generic password field
      rules: [
        { required: true, message: "Please confirm your password!" },
        // The validator needs access to the form instance
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
  return (
    <AuthLayout
      illustration={signupIllustration}
      title="Sign Up"
      subTitle="Welcome to our community"
      headerMargin="24px"
    >
      <Form
        name="signup"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
      >
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="First Name"
              name="firstName"
              rules={[
                { required: true, message: "Please input your first name!" },
              ]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Cameron"
                size="large"
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item
              label="Last Name"
              name="lastName"
              rules={[
                { required: true, message: "Please input your last name!" },
              ]}
            >
              <Input placeholder="Williamson" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              type: "email",
              message: "Please input a valid email!",
            },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="test@gmail.com"
            size="large"
          />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: "Please input your password!" }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password!" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The two passwords do not match!")
                );
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
            size="large"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>
        <Form.Item
          label="Budget Limit"
          name="budgetLimit"
          rules={[
            { required: true, message: "Please input your budget limit!" },
          ]}
        >
          <InputNumber
            prefix="$"
            placeholder="Enter Amount"
            size="large"
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item style={{ marginTop: "16px" }}>
          <Button type="primary" htmlType="submit" block size="large">
            SIGN UP
          </Button>
        </Form.Item>
        <AuthLink
          text="Already have an account?"
          linkText="Log In"
          to="/login"
        />
      </Form>
    </AuthLayout>
  );
};

export default SignupPage;
