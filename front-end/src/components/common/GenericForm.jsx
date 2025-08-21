import React from "react";
import { Form, Row, Col } from "antd";
import FormField from "./FormField";
import FormNumberField from "./FormNumberField";
import FormDateField from "./FormDateField";
import PrimaryButton from "./PrimaryButton";

const GenericForm = ({
  formInstance,
  fields,
  onFinish,
  submitText = "Submit",
  loading = false,
  footer,
}) => {
  const hasCustomFooter = footer !== undefined;
  return (
    <Form
      form={formInstance}
      onFinish={onFinish}
      layout="vertical"
      requiredMark={false}
    >
      <Row gutter={16}>
        {fields.map((field) => (
          <Col span={field.span || 24} key={field.name}>
            {(() => {
              const commonProps = {
                name: field.name,
                label: field.label,
                rules: field.rules,
                placeholder: field.placeholder,
                disabled: field.disabled,
              };

              switch (field.type) {
                case "number":
                  return (
                    <FormNumberField {...commonProps} prefix={field.prefix} />
                  );
                case "password":
                  return (
                    <FormField
                      {...commonProps}
                      prefix={field.prefix}
                      isPassword={true}
                    />
                  );
                case "date":
                  return <FormDateField {...commonProps} />;
                case "textarea":
                  return <FormField {...commonProps} isTextArea={true} />;
                case "text":
                case "email":
                default:
                  return <FormField {...commonProps} prefix={field.prefix} />;
              }
            })()}
          </Col>
        ))}
      </Row>

      {hasCustomFooter ? (
        footer
      ) : (
        <Form.Item style={{ marginTop: "24px" }}>
          <PrimaryButton block htmlType="submit" loading={loading}>
            {submitText}
          </PrimaryButton>
        </Form.Item>
      )}
    </Form>
  );
};

export default GenericForm;
