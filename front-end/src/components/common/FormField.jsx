import React from "react";
import { Form, Input } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";

const FormField = ({
  name,
  label,
  rules,
  placeholder,
  prefix,
  isPassword = false,
  disabled = false,
  isTextArea = false,
}) => {
  const InputComponent = isPassword
    ? Input.Password
    : isTextArea
    ? Input.TextArea
    : Input;

  return (
    <Form.Item name={name} label={label} rules={rules}>
      <InputComponent
        prefix={prefix}
        placeholder={placeholder}
        size="large"
        disabled={disabled}
        // Specific props for password fields
        {...(isPassword && {
          iconRender: (visible) =>
            visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />,
        })}
      />
    </Form.Item>
  );
};

export default FormField;
