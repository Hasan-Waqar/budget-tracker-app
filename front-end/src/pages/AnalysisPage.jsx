import React, { useState, useEffect, useCallback } from "react";
import { Card, Typography, Select, Spin, Row, Col, Space } from "antd";
import { Line } from "@ant-design/charts";
import expenseService from "../services/expenseService";

const { Title } = Typography;
const { Option } = Select;

const AnalysisPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("12m");

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseService.getStats({ range: range });
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setLoading(false);
    }
  }, [range]);
  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return (
      <Spin size="large" style={{ display: "block", margin: "100px auto" }} />
    );
  }
  if (!stats) {
    return <Title level={3}>Could not load analysis data.</Title>;
  }

  const monthNames = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const chartData = stats.monthlySpending.map((item) => ({
    month: monthNames[item._id.month - 1],
    value: item.total,
  }));

  const chartConfig = {
    data: chartData,
    xField: "month",
    yField: "value",
    height: 400,
    smooth: true,
    lineStyle: {
      stroke: "#6c63ff",
      lineWidth: 2,
    },
    point: {
      size: 5,
      shape: "circle",
      style: { fill: "white", stroke: "#6c63ff", lineWidth: 2 },
    },
    legend: false,

    xAxis: {
      tickMethod: () => monthNames,
      title: { text: "Month", style: { fontSize: 14, fill: "#8c8c8c" } },
    },
    yAxis: {
      min: 0,
      title: { text: "Value (PKR)", style: { fontSize: 14, fill: "#8c8c8c" } },
      label: { formatter: (v) => v.toLocaleString() },
    },

    tooltip: {
      title: "Total Spent",

      formatter: (datum) => {
        console.log("Tooltip datum:", datum);

        return {
          name: datum.month,
          value: `PKR ${datum.value.toLocaleString()}`,
        };
      },
    },
  };

  return (
    <Space direction="vertical" size="large" style={{ width: "100%" }}>
      <Title level={2}>Analysis</Title>

      <Card
        title={
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={4} style={{ margin: 0 }}>
                Expenses
              </Title>
            </Col>
            <Col>
              <Space>
                <span>Range:</span>
                <Select
                  value={range}
                  onChange={setRange}
                  style={{ width: 150 }}
                >
                  <Option value="12m">Last 12 Months</Option>
                  <Option value="6m">Last 6 Months</Option>
                  <Option value="3m">Last 3 Months</Option>
                </Select>
              </Space>
            </Col>
          </Row>
        }
        styles={{
          body: {
            padding: 0,
          },
          background: "#e6e7e8ff",
        }}
      >
        <div style={{ background: "#FFFFFF", paddingTop: "16px" }}>
          <Line {...chartConfig} />
        </div>
      </Card>
    </Space>
  );
};

export default AnalysisPage;
