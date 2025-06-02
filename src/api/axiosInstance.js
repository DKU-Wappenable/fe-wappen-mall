import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// JWT 토큰 자동 주입
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("JWT Authorization Header:", config.headers["Authorization"]);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 오류 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const token = localStorage.getItem("access_token");

    //  아래 경로들은 세션 만료 처리 제외
    if (
      originalRequest.url.includes("/users/me") ||
      originalRequest.url.includes("/admin/check-auth")
    ) {
      return Promise.reject(error);
    }

    //  dummy-token이면 세션 만료 무시
    if (error.response?.status === 401 && token !== "dummy-token") {
      toast.error("세션이 만료되었습니다. 다시 로그인 해주세요.");
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/";
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
