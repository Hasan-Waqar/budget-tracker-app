import React from "react";
import { Button } from "antd";

const PrimaryButton = ({
  children,
  onClick,
  loading = false,
  block = false,
  htmlType = "button",
  ...rest
}) => {
  return (
    <Button
      type="primary"
      size="large"
      onClick={onClick}
      loading={loading}
      block={block}
      htmlType={htmlType}
      {...rest}
    >
      {children}
    </Button>
  );
};

export default PrimaryButton;
