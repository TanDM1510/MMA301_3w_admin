import React, { useEffect, useState } from "react";
import axiosClient from "../../api/customFetch";
import { baseURL, users, roleName } from "../../api/endPoints";
import { Table, Tag, Space, Typography, Avatar } from "antd";
import {
  TeamOutlined,
  GooglePlusOutlined,
  RocketOutlined,
  IdcardOutlined,
  GitlabOutlined,
  ManOutlined,
  WomanOutlined,
} from "@ant-design/icons";

const { Column } = Table;
const { Title } = Typography;

const AdminAccount = () => {
  const [userData, setUserData] = useState([]);
  const [roleData, setRoleData] = useState([]);

  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(baseURL + users);
      setUserData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const role = async () => {
    try {
      const response = await axiosClient.get(baseURL + roleName);
      setRoleData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
    role();
  }, []);

  const renderRoleName = (role_id) => {
    const role = roleData.find((item) => item._id === role_id);
    return role ? role.name : "";
  };

  return (
    <div>
      <Title level={3} style={{ color: "#000", margin: 30 }}>
        Manage Accounts
      </Title>
      <Table
        dataSource={userData} // Change this line
        scroll={{ x: "max-content" }}
        style={{
          borderColor: "1px solid #ccc",
          boxShadow: "0 -2px 8px rgba(0, 0, 0, 0.15)",
          background: "white",
        }}
        pagination={{ pageSize: 7 }} // Add this line
      >
        <Column
          title={
            <Space>
              <TeamOutlined /> Full Name
            </Space>
          }
          dataIndex="fullName"
          key="fullName"
          ellipsis={{ showTitle: false }}
          width={200}
          render={(fullName) => (
            <Space>
              <Avatar style={{ backgroundColor: "green" }}>
                <GitlabOutlined />
              </Avatar>
              {fullName}
            </Space>
          )}
        />
        <Column
          title={
            <Space>
              <GooglePlusOutlined /> Email
            </Space>
          }
          dataIndex="email"
          key="email"
          ellipsis={{ showTitle: false }}
          width={200}
        />
        <Column
          title={
            <Space>
              <IdcardOutlined /> Gender
            </Space>
          }
          dataIndex="gender"
          key="gender"
          ellipsis={{ showTitle: false }}
          width={200}
          render={(gender) =>
            gender === 0 ? (
              <Space>
                <ManOutlined style={{ color: "blue" }} />
                Male
              </Space>
            ) : (
              <Space>
                <WomanOutlined style={{ color: "red" }} />
                Female
              </Space>
            )
          }
        />
        <Column
          title={
            <Space>
              <RocketOutlined /> Role
            </Space>
          }
          dataIndex="role_id"
          key="role_id"
          ellipsis={{ showTitle: false }}
          width={200}
          render={(role_id) => renderRoleName(role_id)}
        />
      </Table>
    </div>
  );
};

export default AdminAccount;
