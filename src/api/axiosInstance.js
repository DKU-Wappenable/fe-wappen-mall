// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  응답 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    //  다음 요청은 401이어도 세션 만료 알림 띄우지 않음
    const skip401AlertEndpoints = [
      "/users/me",
      "/admin/check-auth",
      "/orders",
      "/cart",
      "/likes",
      "/users/login",
      "/users/signup",
    ];

    const shouldSkip401Alert = skip401AlertEndpoints.some((endpoint) =>
      originalRequest?.url?.includes(endpoint)
    );

    if (error.response?.status === 401 && !shouldSkip401Alert) {
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      // window.location.href = "/login"; // 로그인 페이지로 리다이렉션
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
