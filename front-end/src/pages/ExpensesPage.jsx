import React, { useState, useEffect, useCallback } from "react";
import {
  Button,
  Progress,
  Space,
  Modal,
  Typography,
  Input,
  Row,
  Col,
  Select,
  DatePicker,
  Form,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import DataTable from "../components/common/DataTable";
import GenericForm from "../components/common/GenericForm";
import expenseService from "../services/expenseService";
import { useAuth } from "../context/AuthContext";
import dayjs from "dayjs";

const ExpensesPage = () => {
  // --- STATE MANAGEMENT ---
  const { user } = useAuth();
  const { notification } = App.useApp();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [deletingExpense, setDeletingExpense] = useState(null);
  const [form] = Form.useForm(); // Single form instance for the page
  const [filters, setFilters] = useState({
    sortBy: "newdate",
    date: null,
    keyword: "",
  });

  const fetchExpenses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await expenseService.getExpenses(filters);
      const formattedData = data.map((exp) => ({ ...exp, key: exp._id }));
      setExpenses(formattedData);
    } catch (error) {
      notification.error({ message: "Failed to fetch expenses" });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchExpenses();
  }, [fetchExpenses]);

  const handleFilterChange = (key, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [key]: value,
    }));
  };

  // Effect to populate form when a modal opens
  useEffect(() => {
    if (isModalVisible) {
      if (editingExpense) {
        // We are editing, so populate with existing data
        form.setFieldsValue({
          ...editingExpense,
          date: dayjs(editingExpense.date, "YYYY-MM-DD"), // Use the correct format
        });
      } else {
        // We are adding, so ensure the form is clear
        form.resetFields();
      }
    }
  }, [isModalVisible, editingExpense, form]);

  // --- HANDLERS ---
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsDeleteModalVisible(false);
    setEditingExpense(null);
    setDeletingExpense(null);
  };

  const handleShowAddModal = () => {
    setEditingExpense(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = (record) => {
    setEditingExpense(record);
    setIsModalVisible(true);
  };

  const handleShowDeleteModal = (record) => {
    setDeletingExpense(record);
    setIsDeleteModalVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      const formattedValues = {
        ...values,
        date: values.date ? values.date.format("YYYY-MM-DD") : null,
      };

      if (editingExpense) {
        await expenseService.updateExpense(editingExpense._id, formattedValues);
        notification.success({ message: "Expense updated successfully!" });
      } else {
        if (user) {
          const currentUserExpenses = expenses.filter(
            (exp) => exp.user._id === user._id
          );

          const totalSpent = currentUserExpenses.reduce(
            (sum, exp) => sum + exp.price,
            0
          );

          const budgetLimit = user.budgetLimit || 0;

          if (totalSpent + values.price > budgetLimit) {
            notification.error({
              message: "Budget Exceeded",
              description: `Adding this expense would exceed your budget of ${budgetLimit.toLocaleString()} PKR.`,
            });
            return;
          }
        }

        const formattedValues = {
          ...values,
          date: values.date ? values.date.format("YYYY-MM-DD") : null,
        };
        await expenseService.createExpense(formattedValues);
        notification.success({ message: "Expense added successfully!" });
      }

      fetchExpenses();
      handleCancel();
    } catch (error) {
      console.error("Submission Failed:", error);
      notification.error({
        message: "Submission Failed",
        description: error.response?.data?.message || "Please check your form.",
      });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await expenseService.deleteExpense(deletingExpense._id);
      notification.success({ message: "Expense deleted successfully!" });
      fetchExpenses();
    } catch (error) {
      notification.error({ message: "Failed to delete expense." });
    }
    handleCancel();
  };

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
  const expenseColumns = [
    { title: "Expense", dataIndex: "title", key: "title" },
    {
      title: "Expenditure",
      dataIndex: "expenditure",
      key: "expenditure",
      render: (p) => (
        <Progress percent={p} showInfo={true} strokeColor="#6c63ff" />
      ),
    },
    {
      title: "Price (PKR)",
      dataIndex: "price",
      key: "price",
      render: (t) => (t ? t.toLocaleString() : "N/A"),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (d) => dayjs(d).format("DD MMM YYYY"),
    },
    {
      title: "User",
      dataIndex: "user",
      key: "user",
      render: (user) => (user ? `${user.firstName} ${user.lastName}` : "N/A"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<DeleteOutlined />}
            onClick={() => handleShowDeleteModal(record)}
          />
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleShowEditModal(record)}
          />
        </Space>
      ),
    },
  ];

  const expenseFormFields = (isDisabled = false) => [
    {
      name: "title",
      label: "Title",
      type: "text",
      span: 24,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
    {
      name: "price",
      label: "Price (PKR)",
      type: "number",
      span: 12,
      rules: [{ required: true }],
      prefix: "Rs",
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

  const expenseFilters = (
    <Space size="middle">
      <Space.Compact>
        <span style={filterLabelStyle}>Sort By</span>
        <Select
          value={filters.sortBy}
          onChange={(value) => handleFilterChange("sortBy", value)}
          variant="borderless"
          style={{ width: 180 }} // Widen for longer text
        >
          <Select.Option value="newdate">Date: Newest to Oldest</Select.Option>
          <Select.Option value="olddate">Date: Oldest to Newest</Select.Option>
          <Select.Option value="highprice">
            Price: Highest to Lowest
          </Select.Option>
          <Select.Option value="lowprice">
            Price: Lowest to Highest
          </Select.Option>
        </Select>
      </Space.Compact>

      <Space.Compact>
        <span style={filterLabelStyle}>By Date</span>
        <DatePicker
          onChange={(date, dateString) =>
            handleFilterChange("date", dateString)
          }
          variant="borderless"
        />
      </Space.Compact>

      <Input
        placeholder="Search by title"
        prefix={<SearchOutlined />}
        onChange={(e) => handleFilterChange("keyword", e.target.value)}
        style={{ width: 200 }}
      />
    </Space>
  );

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
        open={isModalVisible}
        onOk={handleFormSubmit}
        onCancel={handleCancel}
        okText={editingExpense ? "Save Changes" : "Add"}
        destroyOnClose
      >
        <GenericForm
          formInstance={form}
          fields={expenseFormFields()}
          footer={null}
        />
      </Modal>

      <Modal
        title="Delete Expense"
        open={isDeleteModalVisible}
        onOk={handleDeleteConfirm}
        onCancel={handleCancel}
        okText="Delete"
        okButtonProps={{ danger: true }}
        destroyOnClose
      >
        <p>
          Are you sure you want to delete the expense: "
          <b>{deletingExpense?.title}</b>"?
        </p>
      </Modal>
    </>
  );
};

export default ExpensesPage;
