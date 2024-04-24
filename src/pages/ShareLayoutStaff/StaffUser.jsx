import { useEffect } from "react";
import axiosClient from "../../api/customFetch";
import { baseURL, users } from "../../api/endPoints";
import { Breadcrumb, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";

const StaffUser = () => {
  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(baseURL + users);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <div>
      {" "}
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
      />
      <Content
        style={{
          margin: "0 16px",
        }}
      >
        <Breadcrumb
          style={{
            margin: "16px 0",
          }}
        ></Breadcrumb>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        ></div>
      </Content>
    </div>
  );
};

export default StaffUser;
