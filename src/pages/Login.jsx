import { useState } from "react";
import { baseURL, loginPath } from "../api/endPoints";
import { LocalStorage } from "../utils/LocalStorage";
import axiosClient from "../api/customFetch";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      email: username,
      password: password,
    };
    try {
      const response = await axiosClient.post(baseURL + loginPath, data);
      console.log("Login successful:", response.data);
      LocalStorage.setToken(response.data.token.access.token);
      LocalStorage.setRefreshToken(response.data.refresh.token);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };
  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};
export default LoginForm;
