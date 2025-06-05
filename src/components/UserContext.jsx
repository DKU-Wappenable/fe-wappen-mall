// src/components/UserContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import TermsModal from "./agree/TermsModal.jsx";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const navigate = useNavigate();

  // ✅ 로컬 데이터 완전 정리 함수
  const clearAllLocalData = () => {
    // 인증 관련 데이터 제거
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    
    // ❌ 기존 로컬 사용자 데이터 제거 (개발용)
    localStorage.removeItem("users");
    localStorage.removeItem("admin");
    localStorage.removeItem("owner");
    localStorage.removeItem("test");
    
    // axios 헤더 정리
    delete axiosInstance.defaults.headers.common["Authorization"];
    
    console.log("🧹 모든 로컬 데이터 정리 완료");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);

      // ✅ 실제 토큰만 설정
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      if (parsed.role !== "ADMIN" && !parsed.termsAccepted) {
        setShowTermsModal(true);
      }
    } else {
      // ❌ 토큰이 없으면 모든 데이터 정리
      clearAllLocalData();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role !== "ADMIN" && !user.termsAccepted) {
      setShowTermsModal(true);
    }
  }, [user]);

  const acceptTerms = async () => {
    try {
      const updatedUser = { ...user, termsAccepted: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowTermsModal(false);

      try {
        await axiosInstance.put("/users/agree-terms");
      } catch (err) {
        console.warn("서버 약관 동의 실패, localStorage로만 처리됨");
      }

      // ✅ 약관 동의 완료 후 현재 위치 확인하여 리다이렉션
      const currentPath = window.location.pathname;
      if (currentPath === "/login" || currentPath === "/signup") {
        console.log("✅ 로그인/회원가입 페이지에서 약관 동의 완료 - 리다이렉션");
        if (updatedUser.role === "ADMIN") navigate("/admin");
        else if (updatedUser.role === "SHOP_OWNER") navigate("/admin/upload");
        else navigate("/");
      } else {
        console.log("✅ 약관 동의 완료 - 현재 페이지 유지");
      }
      
    } catch (err) {
      console.error("약관 동의 실패:", err);
    }
  };

  
  const login = async ({ id, password }) => {
    try {
      const res = await axiosInstance.post("/users/login", { id, password });
      const { accessToken } = res.data;

      localStorage.setItem("access_token", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const userRes = await axiosInstance.get("/users/me");
      const userData = userRes.data;

      console.log("🧾 로그인 후 유저 정보 확인:", userData); // 👈 id 포함되어 있는지 확인


      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "ADMIN") navigate("/admin");
      else if (!userData.termsAccepted) setShowTermsModal(true);
      else if (userData.role === "SHOP_OWNER") navigate("/admin/upload");
      else navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      
      // ❌ localStorage fallback 제거 - 실제 서버 응답에만 의존
      // 토큰 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
      
      // 에러를 다시 throw하여 호출하는 곳에서 처리하도록 함
      throw new Error("로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.");
    }
  };

  const socialLogin = async (accessToken, provider) => {
    try {
      const res = await axiosInstance.get("/users/me", {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      const userData = {
        ...res.data,
        linkedSocials: [provider],
      };

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "ADMIN") navigate("/admin");
      else if (!userData.termsAccepted) setShowTermsModal(true);
      else if (userData.role === "OWNER") navigate("/admin/upload");
      else navigate("/");

      return userData;
    } catch (err) {
      console.error("소셜 로그인 실패:", err);
      throw new Error("소셜 로그인 실패");
    }
  };

  const logout = () => {
    setUser(null);
    clearAllLocalData(); // 완전한 데이터 정리
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        login,
        logout,
        acceptTerms,
        socialLogin,
        isLoggedIn: !!user,
        loading,
      }}
    >
      {children}
      {showTermsModal && <TermsModal onAgree={acceptTerms} />}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;