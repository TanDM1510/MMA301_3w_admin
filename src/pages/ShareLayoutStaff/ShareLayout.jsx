import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  LogoutOutlined,
  ExclamationCircleOutlined,
  UserOutlined,
  BarcodeOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Outlet, useNavigate } from "react-router-dom";
import { LocalStorage } from "../../utils/LocalStorage";

const { Footer, Sider } = Layout;
function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}
const items = [
  getItem("Manage Host", "manageHosts", <UserOutlined />),
  // getItem("Manage Report", "manageReports", <ExclamationCircleOutlined />),
  getItem("Manage Voucher", "manageVouchers", <BarcodeOutlined />),
  getItem("SignOut", "signout", <LogoutOutlined />),
];

const ShareLayout = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    const role = LocalStorage.getRole();
    if (role !== "staff") {
      navigate("/forbidden");
      LocalStorage.clearToken();
    }
  }, [navigate]);

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className=" text-xl font-bold text-red-50 text-center pt-3">
          {collapsed ? (
            <HomeOutlined />
          ) : (
            <span className="font-mono-">STAFF MANAGER</span>
          )}
        </div>
        <Menu
          onClick={({ key }) => {
            if (key === "signout") {
              LocalStorage.clearToken();
              navigate("/");
            } else {
              navigate(key);
            }
          }}
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
          className="pt-10"
        />
      </Sider>
      <Layout>
        <Outlet />
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default ShareLayout;
