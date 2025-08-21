import React from "react";
import { Form, InputNumber } from "antd";

const FormNumberField = ({
  name,
  label,
  rules,
  placeholder,
  prefix,
  disabled = false,
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      <InputNumber
        prefix={prefix}
        placeholder={placeholder}
        size="large"
        style={{ width: "100%" }}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default FormNumberField;
