// src/api/axiosInstance.js
import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // API 서버의 기본 URL (http로 수정)
  timeout: 10000, // 요청 타임아웃 설정 (10초)
  // 기본 헤더 설정
  // 예: JSON 형식의 데이터 전송을 위한 Content-Type 설정
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // CORS credentials 허용
});

// 요청 인터셉터: JWT 자동 추가
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // 개발 환경에서 요청 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터: 401 처리 및 에러 로깅
axiosInstance.interceptors.response.use(
  (response) => {
    // 개발 환경에서 응답 로깅
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ API Response: ${response.status} ${response.config.method?.toUpperCase()} ${response.config.url}`);
    }
    return response;
  },
  (error) => {
    // 개발 환경에서 에러 로깅
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ API Error: ${error.response?.status} ${error.config?.method?.toUpperCase()} ${error.config?.url}`, error.response?.data);
    }
    
    if (error.response?.status === 401) {
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("access_token");
      window.location.href = "/";
    } else if (error.response?.status >= 400) {
      // 기타 에러 메시지 표시
      const message = error.response?.data?.message || "요청 처리 중 오류가 발생했습니다.";
      toast.error(message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
