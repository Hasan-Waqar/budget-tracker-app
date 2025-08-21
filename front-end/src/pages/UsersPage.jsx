import React, { useState, useEffect } from "react";
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
import { v4 as uuidv4 } from "uuid";

// --- MOCK DATA ---
const demoData = [
  {
    key: "1",
    firstName: "Cameron",
    lastName: "Williamson",
    email: "tanya.hill@example.com",
    number: "(406) 555-0120",
    role: "Admin",
    budgetLimit: 50000,
  },
  {
    key: "2",
    firstName: "Brooklyn",
    lastName: "Simmons",
    email: "simmons.brooklyn@example.com",
    number: "(684) 555-0102",
    role: "User",
    budgetLimit: 25000,
  },
  {
    key: "3",
    firstName: "Leslie",
    lastName: "Alexander",
    email: "savannah.brooklyn@example.com",
    number: "(217) 555-0113",
    role: "Admin",
    budgetLimit: 75000,
  },
  {
    key: "4",
    firstName: "Savannah",
    lastName: "Nguyen",
    email: "simmons.brooklyn@example.com",
    number: "(302) 555-0107",
    role: "User",
    budgetLimit: 15000,
  },
  {
    key: "5",
    firstName: "Darlene",
    lastName: "Robertson",
    email: "alexander.brooklyn@example.com",
    number: "(316) 555-0115",
    role: "Admin",
    budgetLimit: 100000,
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState(demoData);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isDeleteModalVisible, setIsDeleteModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [deletingUser, setDeletingUser] = useState(null);
  const [form] = Form.useForm();

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

  const handleFormSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingUser) {
          setUsers(
            users.map((u) =>
              u.key === editingUser.key ? { ...editingUser, ...values } : u
            )
          );
          showNotification(
            "success",
            "User Updated",
            "User edited successfully!"
          );
        } else {
          const newUser = { key: uuidv4(), role: "User", ...values };
          setUsers([newUser, ...users]);
          showNotification("success", "User Added", "User added successfully!");
        }
        handleCancel();
      })
      .catch((info) => console.log("Validate Failed:", info));
  };

  const handleDeleteConfirm = () => {
    setUsers(users.filter((u) => u.key !== deletingUser.key));
    showNotification("error", "User Deleted", "User deleted successfully!");
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
    { title: "Number", dataIndex: "number", key: "number" },
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
    {
      name: "number",
      label: "Phone Number",
      type: "text",
      span: 12,
      rules: [{ required: true }],
      disabled: isDisabled,
    },
    {
      name: "budgetLimit",
      label: "Budget Limit (PKR)",
      type: "number",
      span: 12,
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
          {/* Re-using style from ExpensesPage */}
          <Select
            variant="borderless"
            defaultValue="name"
            style={{ width: 120 }}
          >
            <Select.Option value="name">Name</Select.Option>
          </Select>
        </Space.Compact>
        <Input
          placeholder="Search"
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
