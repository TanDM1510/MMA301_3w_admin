import React, { useEffect, useState } from "react";
import { Button, Form, Input, InputNumber, Select, Modal, theme } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../api/customFetch";
import { baseURL } from "../../api/endPoints";
import { toast } from "react-toastify";

const VoucherDetail = () => {
  const { id } = useParams();
  const [voucher, setVoucher] = useState({});
  const [defaultStatus, setDefaultStatus] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState(1);
  const [updateModalVisible, setUpdateModalVisible] = useState(false);
  const [banModalVisible, setBanModalVisible] = useState(false);
  const navigate = useNavigate();
  const {
    __v,
    host_id,
    _id,
    discount,
    detail,
    createdAt,
    updatedAt,
    approve_by,
    ...rest
  } = voucher;

  const fetchVoucher = async () => {
    try {
      const response = await axiosClient.get(baseURL + `/qr/${id}`);
      setVoucher(response.data);
      setDefaultStatus(response.data.status);

      console.log(defaultStatus);
    } catch (error) {
      console.error("Error fetching voucher:", error);
    }
  };

  const onFinish = async () => {
    setUpdateModalVisible(true);
  };

  const onFinish3 = async () => {
    setBanModalVisible(true);
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  const handleStatusChange = (value) => {
    setSelectedStatus(value);
  };

  useEffect(() => {
    fetchVoucher();
  }, [id, defaultStatus]);

  return (
    <div>
      <Header
        style={{
          padding: 0,
          background: theme.useToken().token.colorBgContainer,
        }}
        className="text-center font-bold text-3xl"
      >
        EDIT VOUCHER
      </Header>
      <Content style={{ margin: "0 16px" }}>
        <div style={{ margin: "16px 0" }} className="flex gap-3"></div>
        <div
          style={{
            padding: 24,
            minHeight: 360,
            background: theme.useToken().token.colorBgContainer,
            borderRadius: theme.useToken().token.borderRadiusLG,
          }}
          className="flex flex-row gap-10 flex-wrap justify-center "
        >
          <Form
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 900, width: 900 }}
          >
            <Form.Item label="Voucher Name">
              <Input className="w-full" value={voucher.name} disabled />
            </Form.Item>
            <Form.Item label="Voucher Price">
              <InputNumber className="w-full" value={voucher.price} disabled />
            </Form.Item>
            <Form.Item label="Voucher Amount">
              <InputNumber className="w-full" value={voucher.amount} disabled />
            </Form.Item>
            <Form.Item label="Voucher Image" disabled>
              <img src={voucher.image_url} className="h-96 w-96 rounded-lg" />
            </Form.Item>
            {defaultStatus === 1 ? (
              <Form.Item label="Process" className="" required>
                <Select
                  onChange={handleStatusChange}
                  className="w-2/3"
                  defaultValue={defaultStatus}
                >
                  <Select.Option value={1}>Process</Select.Option>
                  <Select.Option value={2}>Approve</Select.Option>
                </Select>
              </Form.Item>
            ) : (
              <Form.Item label="Process" className="" required>
                <Select
                  className="w-2/3"
                  defaultValue={defaultStatus}
                  onChange={handleStatusChange}
                  disabled
                >
                  <Select.Option value={1}>Process</Select.Option>
                  <Select.Option value={2}>Approve</Select.Option>
                </Select>
              </Form.Item>
            )}
            {defaultStatus === 1 ? (
              <Form.Item label="Update">
                <Button htmlType="submit" type="primary">
                  Update Voucher
                </Button>
              </Form.Item>
            ) : (
              <Form.Item label="Update">
                <Button htmlType="submit" type="primary" disabled>
                  Update Voucher
                </Button>
              </Form.Item>
            )}
          </Form>

          <Form
            onFinish={onFinish3}
            onFinishFailed={onFinishFailed}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
            style={{ maxWidth: 900, width: 900 }}
          >
            <Form.Item label="Ban">
              <Button htmlType="submit" type="primary" danger>
                Ban Voucher
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Content>

      {/* Update Modal */}
      <Modal
        title="Update Confirmation"
        visible={updateModalVisible}
        onCancel={() => setUpdateModalVisible(false)}
        onOk={async () => {
          try {
            const response = await axiosClient.put(baseURL + `/staff/qr`, {
              ...rest,
              status: selectedStatus,
              qr_id: voucher._id,
            });
            console.log("Update successful:", response);
            setUpdateModalVisible(false);
            navigate("/staff/manageVouchers");
            toast.success("Update successful");
          } catch (error) {
            console.error("Update failed:", error);
            toast.error("Update failed");
          }
        }}
      >
        <p>Are you sure you want to update this voucher?</p>
      </Modal>

      {/* Ban Modal */}
      <Modal
        title="Ban Confirmation"
        visible={banModalVisible}
        onCancel={() => setBanModalVisible(false)}
        onOk={async () => {
          try {
            const response = await axiosClient.put(baseURL + `/staff/ban_qr`, {
              qr_id: voucher._id,
            });
            console.log("Ban successful:", response);
            setBanModalVisible(false);
            navigate("/staff/manageVouchers");
            toast.success("Ban successful");
          } catch (error) {
            console.error("Ban failed:", error);
            toast.error("Ban failed");
          }
        }}
      >
        <p>Are you sure you want to ban this voucher?</p>
      </Modal>
    </div>
  );
};

export default VoucherDetail;
