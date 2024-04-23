import { useEffect } from "react";
import axiosClient from "../api/customFetch";
import { baseURL, users } from "../api/endPoints";

const StaffUser = () => {
  const fetchUserData = async () => {
    try {
      const response = await axiosClient.get(baseURL + users);
      console.log(response.data); // Truy cập dữ liệu từ phản hồi
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    // Sử dụng async trong hàm callback của useEffect
    fetchUserData();
  }, []);

  return <div>StaffUser</div>;
};

export default StaffUser;
