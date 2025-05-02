// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "https://localhost:8080/api", // API 서버의 기본 URL
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  // 기본 헤더 설정
  // 예: JSON 형식의 데이터 전송을 위한 Content-Type 설정
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터: JWT 자동 추가
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

// 응답 인터셉터: 401 처리
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
