import axios from "axios";
import { LocalStorage } from "../utils/LocalStorage";
import { refreshTokenPath, baseURL } from "./endPoints";

const defaultHeader = {
  "Access-Control-Allow-Origin": "*",
  "Content-Type": "application/json",
  Accept: "application/json",
};

// for multiple requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

const axiosClient = axios.create();

// Add a request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    const token = LocalStorage.getAccessToken();
    if (token) {
      config.headers["Authorization"] = "Bearer " + token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    return handleResponse(response);
  },
  (error) => {
    const originalRequest = error.config;

    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return axiosClient.request(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = LocalStorage.getRefreshToken();

      return new Promise(function (resolve, reject) {
        console.log("post refresh token");
        axios
          .post(
            `${baseURL + refreshTokenPath}`,
            { refreshToken },
            {
              headers: defaultHeader,
            }
          )
          .then((res) => {
            const { data } = res.data;

            // 1) put token to LocalStorage
            LocalStorage.setToken(data.accessToken);
            if (data && data.refreshToken) {
              LocalStorage.setRefreshToken(data.refreshToken);
            }

            // 2) Change Authorization header
            axios.defaults.headers.common["Authorization"] =
              "Bearer " + data.accessToken;
            originalRequest.headers["Authorization"] =
              "Bearer " + data.accessToken;

            processQueue(null, data.accessToken);

            // 3) return originalRequest object with Axios
            resolve(axiosClient.request(originalRequest));
          })
          .catch((err) => {
            const { status, data } = err.response;

            if (status === 404) {
              clearAuthToken();
            }
            if (data && data.error.errorCode === "REFRESH_TOKEN_INVALID") {
              clearAuthToken();
            }

            processQueue(err, null);
            reject(err);
          })
          .finally(() => {
            isRefreshing = false;
          });
      });
    }
    return Promise.reject(handleError(error));
  }
);

const handleResponse = (res) => {
  if (res && res.data) {
    return res.data;
  }

  return res;
};

const handleError = (error) => {
  const { data } = error.response;

  console.error(error);
  return data;
};

const clearAuthToken = () => {
  LocalStorage.clearToken();
};

export default axiosClient;
