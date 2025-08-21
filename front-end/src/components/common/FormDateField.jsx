import React from "react";
import { Form, DatePicker } from "antd";

const FormDateField = ({
  name,
  label,
  rules,
  placeholder,
  disabled = false,
}) => {
  return (
    <Form.Item name={name} label={label} rules={rules}>
      <DatePicker
        size="large"
        style={{ width: "100%" }}
        placeholder={placeholder}
        disabled={disabled}
      />
    </Form.Item>
  );
};

export default FormDateField;
