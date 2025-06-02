// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // 올바른 http 프로토콜
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

//  JWT 토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ JWT Authorization Header:", config.headers["Authorization"]); // 추가
    }
    return config;
  },
  (error) => Promise.reject(error)
);

//  응답 오류 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("access_token");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
