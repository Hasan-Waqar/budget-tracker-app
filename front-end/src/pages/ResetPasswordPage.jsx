import React from "react";
import { Form, Input, Button } from "antd";
import { MailOutlined } from "@ant-design/icons";
import AuthLayout, { AuthLink } from "../components/layout/AuthLayout";
import resetPasswordIllustration from "../assets/images/reset-password-illustration.png"; // Verify this path

const ResetPasswordPage = () => {
  const onFinish = (values) => {
    console.log("Reset password form values: ", values);
  };

  return (
    <AuthLayout
      illustration={resetPasswordIllustration}
      title="Reset Password"
      subTitle="Enter your email for a reset link."
    >
      <Form name="reset-password" onFinish={onFinish} layout="vertical">
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

        <Form.Item>
          <Button type="primary" htmlType="submit" block size="large">
            Send Reset Password Link
          </Button>
        </Form.Item>

        <AuthLink
          text="Remembered your password?"
          linkText="Log In"
          to="/login"
        />
      </Form>
    </AuthLayout>
  );
};

export default ResetPasswordPage;
