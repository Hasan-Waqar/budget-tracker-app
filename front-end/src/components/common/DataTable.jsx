import React from "react";
import { Table, Button, Space, Typography, Input, Row, Col } from "antd";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import "../../index.css";
const { Title } = Typography;

const DataTable = ({
  title,
  columns,
  dataSource,
  onAddItem,
  loading = false,
  filters,
}) => {
  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ margin: 0 }}>
            {title}
          </Title>
        </Col>
        <Col>
          <Button type="primary" icon={<PlusOutlined />} onClick={onAddItem}>
            Add {title}
          </Button>
        </Col>
      </Row>

      <div
        style={{
          padding: "24px",
          border: "1px solid #f0f0f0",
          borderRadius: "8px",
          background: "#fcfdfbff",
        }}
      >
        <Row
          justify="space-between"
          align="middle"
          style={{ marginBottom: "24px" }}
        >
          <Col>
            <Title level={5} style={{ margin: 0 }}>
              {title}
            </Title>
          </Col>
          <Col>
            <Space size="middle">
              {filters ? (
                filters
              ) : (
                <Input placeholder="Search..." prefix={<SearchOutlined />} />
              )}
            </Space>
          </Col>
        </Row>
        <Table
          loading={loading}
          columns={columns}
          dataSource={dataSource}
          pagination={{
            pageSize: 8,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
        />
      </div>
    </Space>
  );
};

export default DataTable;
