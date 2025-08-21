import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Progress,
  Space,
  Modal,
  notification,
  Typography,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SearchOutlined,
} from "@ant-design/icons";
import DataTable from "../components/common/DataTable";
import GenericForm from "../components/common/GenericForm";
import { v4 as uuidv4 } from "uuid";
import PrimaryButton from "../components/common/PrimaryButton";
import dayjs from "dayjs";

const demoData = [
  {
    key: "1",
    title: "Prestigious Clientele Segment",
    expenditure: 50,
    price: 25000,
    date: "22 Jan 2022",
    user: "guy-hawkins",
  },
  {
    key: "2",
    title: "Luxury Lifestyle Patrons",
    expenditure: 100,
    price: 510,
    date: "22 Feb 2023",
    user: "wade-warren",
  },
  {
    key: "3",
    title: "Premium Customers",
    expenditure: 60,
    price: 17420,
    date: "22 Mar 2021",
    user: "jenny-wilson",
  },
  {
    key: "4",
    title: "Exclusive High-Spending Patrons",
    expenditure: 70,
    price: 2500,
    date: "22 April 2024",
    user: "robert-fox",
  },
  {
    key: "5",
    title: "Affluent Consumer Segment",
    expenditure: 20,
    price: 925,
    date: "22 May 2024",
    user: "williamson",
  },
];

const ExpensesPage = () => {
  const [expenses, setExpenses] = useState(demoData);
  const [loading, setLoading] = useState(false);
  const [isAddEditModalVisible, setIsAddEditModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    if (isAddEditModalVisible) {
      if (editingExpense) {
        form.setFieldsValue({
          ...editingExpense,
          date: dayjs(editingExpense.date, "DD MMM YY YY"),
        });
      } else {
        form.resetFields();
      }
    } else if (isDeleteModalVisible && deletingExpense) {
      form.setFieldsValue({
        ...deletingExpense,
        date: dayjs(deletingExpense.date, "DD MMM YYYY"),
      });
    }
  }, [
    isAddEditModalVisible,
    isDeleteModalVisible,
    editingExpense,
    deletingExpense,
    form,
  ]);
  const showNotification = (type, message, description) => {
    notification.open({
      message,
      description,
      icon:
        type === "success" ? (
          <CheckCircleFilled style={{ color: "#52c41a" }} />
        ) : (
          <CloseCircleFilled style={{ color: "#ff4d4f" }} />
        ),
      placement: "topRight",
    });
  };

  const handleCancel = () => {
    setIsAddEditModalVisible(false);
    setIsDeleteModalVisible(false);
    setEditingExpense(null);
    setDeletingExpense(null);
    form.resetFields();
  };

  const handleShowAddModal = () => {
    setEditingExpense(null);
    setIsAddEditModalVisible(true);
  };

  const handleShowEditModal = (record) => {
    setEditingExpense(record);
    setIsAddEditModalVisible(true);
  };

  const handleShowDeleteModal = (record) => {
    setDeletingExpense(record);
    setIsDeleteModalVisible(true);
  };

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const formattedValues = {
          ...values,
          date: values.date ? values.date.format("DD MMM YYYY") : "",
        };

        if (editingExpense) {
          setExpenses(
            expenses.map((exp) =>
              exp.key === editingExpense.key
                ? { ...editingExpense, ...formattedValues }
                : exp
            )
          );
          showNotification(
            "success",
            "Expense Updated",
            "Expense updated successfully!"
          );
        } else {
          const newExpense = {
            key: uuidv4(),
            ...formattedValues,
            user: "current-user",
            expenditure: Math.floor(Math.random() * 101),
          };
          setExpenses([newExpense, ...expenses]);
          showNotification(
            "success",
            "Expense Added",
            "Expense added successfully!"
          );
        }
        handleCancel();
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  const handleDeleteConfirm = () => {
    setExpenses(expenses.filter((exp) => exp.key !== deletingExpense.key));
    showNotification(
      "error",
      "Expense Deleted",
      "Expense deleted successfully!"
    );
    handleCancel();
  };

  const expenseColumns = [
    { title: "Expense", dataIndex: "title", key: "title" },
    {
      title: "Total Expenditure",
      dataIndex: "expenditure",
      key: "expenditure",
      render: (p) => (
        <Progress percent={p} showInfo={true} strokeColor="#6c63ff" />
      ),
    },
    {
      title: "Price(PKR)",
      dataIndex: "price",
      key: "price",
      render: (t) => t.toLocaleString(),
    },
    { title: "Date", dataIndex: "date", key: "date" },
    { title: "User", dataIndex: "user", key: "user" },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<DeleteOutlined style={{ color: "red" }} />}
            onClick={() => handleShowDeleteModal(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined style={{ color: "#6c63ff" }} />}
            onClick={() => handleShowEditModal(record)}
          />
        </Space>
      ),
    },
  ];

  const addEditFooter = (
    <Row gutter={8}>
      <Col span={12}>
        <Button block size="large" onClick={handleCancel}>
          Cancel
        </Button>
      </Col>
      <Col span={12}>
        <PrimaryButton block onClick={handleFormSubmit}>
          {editingExpense ? "Save Changes" : "Add"}
        </PrimaryButton>
      </Col>
    </Row>
  );

  const deleteFooter = (
    <Row gutter={8}>
      <Col span={12}>
        <Button block size="large" onClick={handleCancel}>
          Cancel
        </Button>
      </Col>
      <Col span={12}>
        <Button
          block
          size="large"
          type="primary"
          danger
          onClick={handleDeleteConfirm}
        >
          Delete
        </Button>
      </Col>
    </Row>
  );
  const filterLabelStyle = {
    display: "inline-flex",
    alignItems: "center",
    padding: "0 11px",
    backgroundColor: "#f0f2f5",
    border: "1px solid #d9d9d9",
    borderRight: "none",
    borderRadius: "6px 0 0 6px",
    color: "rgba(0, 0, 0, 0.45)",
    height: "32px",
  };
  const expenseFilters = (
    <Col>
      <Space size="middle">
        <Space.Compact>
          <span style={filterLabelStyle}>Sort By</span>
          <Select
            variant="borderless"
            defaultValue="all"
            style={{ width: 120 }}
          >
            <Select.Option value="all">All</Select.Option>
            <Select.Option value="highprice">
              Price: Highest to Lowest
            </Select.Option>
            <Select.Option value="lowprice">
              Price: Lowest to Highest
            </Select.Option>
            <Select.Option value="newdate">
              Date: Newest to Oldest
            </Select.Option>
            <Select.Option value="olddate">
              Date: Oldest to Newest
            </Select.Option>
          </Select>
        </Space.Compact>

        <Space.Compact>
          <span style={filterLabelStyle}>By Date</span>
          <DatePicker variant="borderless" placeholder="13/06/2024" />
        </Space.Compact>

        <Input
          placeholder="Search"
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </Space>
    </Col>
  );

  const expenseFormFields = (isDisabled = false) => [
    {
      name: "title",
      label: "Title",
      type: "text",
      span: 24,
      rules: [{ required: true }],
      placeholder: "E.g., Office Supplies",
      disabled: isDisabled,
    },
    {
      name: "price",
      label: "Price(PKR)",
      type: "number",
      span: 12,
      rules: [{ required: true }],
      prefix: "Rs",
      placeholder: "3000",
      disabled: isDisabled,
    },
    {
      name: "date",
      label: "Date",
      type: "date",
      span: 12,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
  ];

  return (
    <>
      <DataTable
        title="Expenses"
        columns={expenseColumns}
        dataSource={expenses}
        onAddItem={handleShowAddModal}
        loading={loading}
        filters={expenseFilters}
      />
      <Modal
        title={editingExpense ? "Edit Expense" : "Add Expense"}
        open={isAddEditModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <GenericForm
          formInstance={form}
          fields={expenseFormFields(false)}
          onFinish={handleFormSubmit}
          footer={addEditFooter}
        />
      </Modal>
      <Modal
        title={
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            Delete Expense
          </Typography.Title>
        }
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <GenericForm
          formInstance={form}
          fields={expenseFormFields(true)}
          footer={deleteFooter}
        />
      </Modal>
    </>
  );
};

export default ExpensesPage;
