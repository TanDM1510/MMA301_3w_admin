import { baseURL, loginPath } from "../../api/endPoints";
import { LocalStorage } from "../../utils/LocalStorage";
import axiosClient from "../../api/customFetch";
import { Button, Form, Input } from "antd";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginForm = () => {
  const navigation = useNavigate();
  const onFinish = async (values) => {
    try {
      const response = await axiosClient.post(baseURL + loginPath, values);
      console.log("Login successful:", response);
      LocalStorage.setToken(response?.tokens?.access?.token);
      LocalStorage.setRefreshToken(response?.tokens?.refresh?.token);
      LocalStorage.setRole(response?.user?.role);
      toast.error(response?.status);
      if (response.user.role === "staff") {
        navigation("/staff/manageHosts");
        toast.success("Login success");
      } else if (response.user.role === "admin") {
        toast.success("Login success");
        navigation("/admin");
      } else {
        navigation("/");
        toast.error("You can't login to the system");
        LocalStorage.clearToken();
      }
    } catch (error) {
      console.error("Login failed:", error);
      toast.error(error);
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md border-2 p-16 rounded-xl w-full space-y-8 shadow-2xl shadow-orange-200">
        <div>
          <h2 className=" text-center text-3xl font-extrabold text-gray-900">
            Welcome Back
          </h2>
        </div>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm -space-y-px">
            <Form.Item
              label="Email"
              name="email"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
          </div>
          <div>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full flex justify-center  px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default LoginForm;
