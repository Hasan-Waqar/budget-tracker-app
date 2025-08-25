import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  notification,
  Typography,
  Input,
  Row,
  Col,
  Select,
  Form,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  CheckCircleFilled,
  CloseCircleFilled,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import DataTable from "../components/common/DataTable";
import GenericForm from "../components/common/GenericForm";
import PrimaryButton from "../components/common/PrimaryButton";
import userService from "../services/userService";
import { v4 as uuidv4 } from "uuid";

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [form] = Form.useForm();
  const { notification } = App.useApp();

  const [filters, setFilters] = useState({
    sortBy: "name",
    keyword: "",
  });

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await userService.getAllUsers(filters);
      const formattedData = data.map((user) => ({ ...user, key: user._id }));
      setUsers(formattedData);
    } catch (error) {
      notification.error({ message: "Failed to fetch users" });
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    if (isModalVisible) {
      if (editingUser) {
        form.setFieldsValue(editingUser);
      } else {
        form.resetFields();
      }
    } else if (isDeleteModalVisible && deletingUser) {
      form.setFieldsValue(deletingUser);
    }
  }, [isModalVisible, isDeleteModalVisible, editingUser, deletingUser, form]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };
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
    setIsModalVisible(false);
    setIsDeleteModalVisible(false);
    setEditingUser(null);
    setDeletingUser(null);
    form.resetFields();
  };

  const handleShowAddModal = () => {
    setEditingUser(null);
    setIsModalVisible(true);
  };

  const handleShowEditModal = (record) => {
    setEditingUser(record);
    setIsModalVisible(true);
  };

  const handleShowDeleteModal = (record) => {
    setEditingUser(record);
    setDeletingUser(record);
    setIsDeleteModalVisible(true);
  };

  const handleFormSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userService.updateUser(editingUser._id, values);
        notification.success({ message: "User updated successfully!" });
      } else {
        await userService.createUser(values);
        notification.success({ message: "User added successfully!" });
      }

      fetchUsers();
      handleCancel();
    } catch (error) {
      const action = editingUser ? "update" : "add";
      notification.error({ message: "Failed to update user" });
    }
  };

  const handleDeleteConfirm = async () => {
    try {
      await userService.deleteUser(deletingUser._id);
      notification.success({ message: "User deleted successfully!" });
      fetchUsers();
    } catch (error) {
      notification.error({ message: "Failed to delete user" });
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
  const userColumns = [
    { title: "First Name", dataIndex: "firstName", key: "firstName" },
    { title: "Last Name", dataIndex: "lastName", key: "lastName" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Number", dataIndex: "phone", key: "phone" },
    { title: "Role", dataIndex: "role", key: "role" },
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

  const userFormFields = (isEditing, isDisabled) => [
    {
      name: "firstName",
      label: "First Name",
      type: "text",
      span: 12,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
    {
      name: "lastName",
      label: "Last Name",
      type: "text",
      span: 12,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
    {
      name: "email",
      label: "Email",
      type: "email",
      rules: [{ required: true, type: "email" }],
      disabled: isEditing || isDisabled,
    },
    ...(!isEditing
      ? [
          {
            name: "password",
            label: "Password",
            type: "password",
            span: 24,
            rules: [{ required: true, min: 6 }],
          },
        ]
      : [
          {
            name: "phone",
            label: "Phone Number",
            type: "text",
            span: 12,
            disabled: isDisabled,
          },
        ]),
    {
      name: "budgetLimit",
      label: "Budget Limit (PKR)",
      type: "number",
      span: 12,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      span: 12,
      options: [
        { value: "User", label: "User" },
        { value: "Admin", label: "Admin" },
      ],
      rules: [{ required: true }],
      disabled: isDisabled,
    },
  ];

  const modalFooter = (
    <Row gutter={8} style={{ marginTop: "24px" }}>
      <Col span={12}>
        <Button block size="large" onClick={handleCancel}>
          Cancel
        </Button>
      </Col>
      <Col span={12}>
        <PrimaryButton block onClick={() => form.submit()}>
          {editingUser ? "Save Changes" : "Add"}
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

  const usersFilter = (
    <Col>
      <Space size="middle">
        <Space.Compact>
          <span style={filterLabelStyle}>Sort By</span>{" "}
          <Select
            value={filters.sortBy}
            onChange={(value) => handleFilterChange("sortBy", value)}
            variant="borderless"
            style={{ width: 120 }}
          >
            <Select.Option value="name">Name</Select.Option>
            <Select.Option value="role">Role</Select.Option>
          </Select>
        </Space.Compact>
        <Input
          placeholder="Search by name or email"
          onChange={(e) => handleFilterChange("keyword", e.target.value)}
          prefix={<SearchOutlined />}
          style={{ width: 300 }}
        />
      </Space>
    </Col>
  );

  return (
    <>
      <DataTable
        title="Users"
        columns={userColumns}
        dataSource={users}
        onAddItem={handleShowAddModal}
        filters={usersFilter}
      />
      <Modal
        title={editingUser ? "Edit User" : "Add User"}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <GenericForm
          formInstance={form}
          fields={userFormFields(!!editingUser)}
          onFinish={handleFormSubmit}
          footer={modalFooter}
        />
      </Modal>
      <Modal
        title={
          <Typography.Title level={4} style={{ textAlign: "center" }}>
            Delete User
          </Typography.Title>
        }
        open={isDeleteModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnHidden
      >
        <GenericForm
          formInstance={form}
          footer={deleteFooter}
          fields={userFormFields(false, true)}
        />
      </Modal>
    </>
  );
};

export default UsersPage;
