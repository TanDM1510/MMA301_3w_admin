import { useEffect, useState } from "react";
import axiosClient from "../../api/customFetch";
import { baseURL, host } from "../../api/endPoints";
import { Button, Input, Space, Switch, Table, Tag, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { format } from "date-fns";
import { debounce } from "lodash";
import { Modal } from "antd";
import { toast } from "react-toastify";
const StaffUser = () => {
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmUserId, setConfirmUserId] = useState(null);
  const [confirmUserStatus, setConfirmUserStatus] = useState(null);
  const showConfirmModal = (userId, status) => {
    setConfirmUserId(userId);
    setConfirmUserStatus(status);
    setConfirmModalVisible(true);
  };

  const handleConfirmChangeStatus = () => {
    updateUserStatus(confirmUserId, confirmUserStatus);
    setConfirmModalVisible(false);
  };
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [userData, setUserData] = useState({
    users: [],
    totalPages: 0,
    loading: false,
    filters: {
      fullName: "",
      email: "",
      active: null,
      status: null,
      sortBy: "asc",
    },
  });
  const updateUserStatus = async (userId, activeStatus) => {
    try {
      const response = await axiosClient.put(
        `${baseURL}/staff/host/${userId}`,
        {
          status: activeStatus,
        }
      );
      if (response.status === 200) {
        const updatedUsers = users.map((user) => {
          if (user.id === userId) {
            return { ...user, active: activeStatus };
          }

          return user;
        });
        setUserData((prevState) => ({
          ...prevState,
          users: updatedUsers,
        }));
      }
      fetchUserData(1);
      toast.success("Update status success");
    } catch (error) {
      console.error("Error updating user status:", error);
      toast.error("Error updating user status");
    }
  };
  const handleSearch = debounce((searchTerm) => {
    updateFilters("fullName", searchTerm);
  }, 1000); // Thời gian debounce là 300 milliseconds

  // Truyền hàm handleSearch vào sự kiện onChange của ô tìm kiếm
  const onSearch = (e) => {
    const { value } = e.target;
    handleSearch(value);
  };
  const { users, totalPages, loading, filters } = userData;

  const fetchUserData = async (page) => {
    try {
      setUserData((prevState) => ({
        ...prevState,
        loading: true,
      }));

      const queryParams = {
        limit: 10,
        page,
        fullName: filters.fullName ? `${filters.fullName}:search` : null,
        email: filters.email ? `${filters.email}:search` : null,
        active: filters.active,
        status: filters.status,
        sortBy: `createdAt:${filters.sortBy}`,
      };

      const queryString = Object.entries(queryParams)
        .filter(([key, value]) => value !== undefined && value !== null)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join("&");

      const url = `${baseURL}${host}?${queryString}`;

      const response = await axiosClient.get(url);

      setUserData({
        users: response.data.results,
        totalPages: response.data.totalResults,
        loading: false,
        filters: { ...filters }, // To maintain immutability
      });
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserData((prevState) => ({
        ...prevState,
        loading: false,
      }));
    }
  };
  const updateFilters = (name, value) => {
    let updatedValue = value;
    setUserData((prevState) => ({
      ...prevState,
      filters: {
        ...prevState.filters,
        [name]: updatedValue,
      },
    }));
  };
  useEffect(() => {
    fetchUserData(1);
  }, [
    filters.active,
    filters.email,
    filters.fullName,
    filters.sortBy,
    filters.status,
  ]); // Call fetchUserData whenever filters change

  // Function to update filters

  const columns = [
    {
      title: "Full Name",
      dataIndex: "fullName",
      key: "fullName",
      render: (text) => <p className="capitalize">{text}</p>,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Gender",
      dataIndex: "gender",
      key: "gender",
    },
    {
      title: "Date join",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (createdAt) => (
        <span>{format(new Date(createdAt), "dd/MM/yyyy")}</span>
      ),
    },
    {
      title: "Active",
      dataIndex: "status",
      key: "status",
      render: (active) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Active" : "Disabled"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "_id",
      render: (text, record) => (
        <Space size="middle">
          <Switch
            checked={record.status}
            onChange={(checked) =>
              showConfirmModal(record._id, checked ? 1 : 0)
            }
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
        className="text-center font-bold text-3xl"
      >
        MANAGE HOST
      </Header>
      <Content
        style={{
          margin: "0 16px",
        }}
      >
        <div
          style={{
            margin: "16px 0",
          }}
          className="flex gap-3"
        >
          <Input placeholder="Search by Full Name" onChange={onSearch} />
          <Button
            onClick={() =>
              updateFilters(
                "sortBy",
                filters.sortBy === "desc" ? "asc" : "desc"
              )
            }
          >
            Sort CreatedAt
          </Button>
          <Button
            onClick={() =>
              updateFilters("status", filters.status === 0 ? 1 : 0)
            }
          >
            Sort Active
          </Button>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Table
            key={(record) => record.id}
            loading={loading}
            pagination={{
              total: totalPages,
              onChange: (page) => {
                fetchUserData(page);
              },
            }}
            columns={columns}
            dataSource={users}
            rowKey={(record) => record.id}
          />
        </div>
      </Content>
      <Modal
        title="Confirm Status Change"
        visible={confirmModalVisible}
        onOk={handleConfirmChangeStatus}
        onCancel={() => setConfirmModalVisible(false)}
      >
        Are you sure you want to change this user's status?
      </Modal>
    </div>
  );
};

export default StaffUser;
