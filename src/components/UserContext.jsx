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

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (parsed.role !== "admin" && !parsed.termsAccepted) {
        setShowTermsModal(true);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (user && user.role !== "admin" && !user.termsAccepted) {
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

      if (updatedUser.role === "admin") navigate("/admin");
      else if (updatedUser.role === "owner") navigate("/admin/upload");
      else navigate("/");
    } catch (err) {
      console.error("약관 동의 실패:", err);
    }
  };

  const login = async ({ email, password }) => {
    try {
      const res = await axiosInstance.post("/users/login", { email, password });
      const { accessToken } = res.data;

      localStorage.setItem("access_token", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      const userRes = await axiosInstance.get("/users/me");
      const userData = userRes.data;

      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "admin") navigate("/admin");
      else if (!userData.termsAccepted) setShowTermsModal(true);
      else if (userData.role === "owner") navigate("/admin/upload");
      else navigate("/");
    } catch (err) {
      console.error("로그인 실패, localStorage fallback 시도:", err);
      try {
        const staticUsers = [
          {
            email: "admin@example.com",
            password: "admin1234",
            nickname: "관리자",
            role: "admin",
            phone: "010-0000-0000",
            termsAccepted: true,
            linkedSocials: [],
          },
          {
            email: "owner@example.com",
            password: "owner1234",
            nickname: "오너",
            role: "owner",
            phone: "010-1111-1111",
            termsAccepted: false,
            linkedSocials: [],
          },
          {
            email: "user@example.com",
            password: "user1234",
            nickname: "사용자",
            role: "user",
            phone: "010-2222-2222",
            termsAccepted: false,
            linkedSocials: [],
          },
        ];

        const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const allUsers = [...staticUsers, ...localUsers];

        const found = allUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (found) {
          localStorage.setItem("user", JSON.stringify(found));
          setUser(found);

          if (found.role === "admin") navigate("/admin");
          else if (!found.termsAccepted) setShowTermsModal(true);
          else if (found.role === "owner") navigate("/admin/upload");
          else navigate("/");
        } else {
          throw new Error("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      } catch (fallbackErr) {
        throw new Error("로그인 실패");
      }
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

      if (userData.role === "admin") navigate("/admin");
      else if (!userData.termsAccepted) setShowTermsModal(true);
      else if (userData.role === "owner") navigate("/admin/upload");
      else navigate("/");

      return userData;
    } catch (err) {
      console.error("소셜 로그인 실패:", err);
      throw new Error("소셜 로그인 실패");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
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
