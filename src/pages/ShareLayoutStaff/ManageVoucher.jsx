import { Button, Input, Tag, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import axiosClient from "../../api/customFetch";
import { baseURL, qr } from "../../api/endPoints";
import { useEffect, useState } from "react";
import {
  EditOutlined,
  EllipsisOutlined,
  SettingOutlined,
} from "@ant-design/icons";
import { Avatar, Card } from "antd";
import { useNavigate } from "react-router-dom";
const { Meta } = Card;

const ManageVoucher = () => {
  const navigate = useNavigate();
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [vouchers, setVouchers] = useState([]);
  const fetchData = async () => {
    const response = await axiosClient.get(baseURL + qr);
    setVouchers(response.data);
    console.log(response);
  };
  useEffect(() => {
    fetchData();
  }, []);
  console.log(vouchers);
  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: colorBgContainer,
        }}
        className="text-center font-bold text-3xl"
      >
        MANAGE VOUCHER
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
          <Input placeholder="Search by Full Name" />
          <Button>Sort CreatedAt</Button>
          <Button>Sort Active</Button>
        </div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
          className="flex flex-row gap-10 flex-wrap justify-center "
        >
          {vouchers.map((voucher) => {
            return (
              <>
                {" "}
                <Card
                  key={voucher._id}
                  style={{
                    width: 300,
                  }}
                  cover={
                    voucher.image_url ? (
                      <img
                        alt="example"
                        src={voucher.image_url}
                        className="h-[300px]"
                      />
                    ) : (
                      <img
                        alt="exampe"
                        src="https://ngochoandesign.com/wp-content/uploads/2023/07/thiet-ke-voucher-dep-gia-re-02.png"
                      />
                    )
                  }
                  actions={[
                    <EditOutlined
                      key="edit"
                      onClick={() =>
                        navigate(`/staff/manageVouchers/${voucher._id}`)
                      }
                    />,
                  ]}
                >
                  <Meta
                    avatar={
                      <Avatar src="https://api.dicebear.com/7.x/miniavs/svg?seed=8" />
                    }
                    title={voucher.name}
                    description={
                      <div>
                        <span className="mr-2">${voucher.price}</span>
                        {voucher.status === 1 && (
                          <Tag color="blue"> Processing</Tag>
                        )}
                        {voucher.status === 2 && <Tag color="green">Done</Tag>}
                        {voucher.status === 3 && <Tag color="red">Ban</Tag>}
                      </div>
                    }
                  />
                </Card>
              </>
            );
          })}
        </div>
      </Content>
    </div>
  );
};

export default ManageVoucher;
