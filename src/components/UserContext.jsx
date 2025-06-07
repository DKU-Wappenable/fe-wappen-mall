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

  const clearAllLocalData = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("users");
    localStorage.removeItem("admin");
    localStorage.removeItem("owner");
    localStorage.removeItem("test");
    delete axiosInstance.defaults.headers.common["Authorization"];
    console.log("🧹 모든 로컬 데이터 정리 완료");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("access_token");

    if (storedUser && token) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // ❌ 모달 조건 판단은 여기서 제거
    } else {
      clearAllLocalData();
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    if (!user) return;
  
    // 모달 상태와 조건이 다를 때만 업데이트
    const shouldShow = user.role !== "ADMIN" && !user.termsAccepted;
    if (showTermsModal !== shouldShow) {
      setShowTermsModal(shouldShow);
    }
  }, [user, showTermsModal]);
  
  

  const acceptTerms = async () => {
    try {
      await axiosInstance.put("/users/agree-terms", {
        terms: true,
        privacy: true,
        financial: true,
        marketing: false,
      });

      const res = await axiosInstance.get("/users/me");
      const updatedUser = res.data;
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));

      console.log("✅ 약관 동의 후 user:", updatedUser);

      if (updatedUser.termsAccepted) {
        setShowTermsModal(false);
      }

      const currentPath = window.location.pathname;
      if (currentPath === "/login" || currentPath === "/signup") {
        if (updatedUser.role === "ADMIN") navigate("/admin");
        else if (updatedUser.role === "SHOP_OWNER") navigate("/admin/upload");
        else navigate("/");
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

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "ADMIN") navigate("/admin");
      else if (!userData.termsAccepted) setShowTermsModal(true);
      else if (userData.role === "SHOP_OWNER") navigate("/admin/upload");
      else navigate("/");
    } catch (err) {
      console.error("로그인 실패:", err);
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      delete axiosInstance.defaults.headers.common["Authorization"];
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
    clearAllLocalData();
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
