import axios from "axios";
import { toast } from "react-toastify";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api",
  timeout: 10000,
});

// ✅ JWT 토큰 자동 주입 + Content-Type 자동 처리
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
      console.log("✅ JWT 토큰 주입:", config.headers["Authorization"]);
    }

    // ✅ FormData 전송 시 Content-Type을 자동으로 설정해야 하므로 명시하지 않음
    if (config.data instanceof FormData) {
      console.log("📦 FormData 요청 → Content-Type 자동 처리됨");
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ 응답 에러 처리
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;
    const token = localStorage.getItem("access_token");

    if (
      originalRequest?.url?.includes("/users/me") ||
      originalRequest?.url?.includes("/admin/check-auth")
    ) {
      return Promise.reject(error);
    }

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
