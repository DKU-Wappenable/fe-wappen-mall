import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";
import TermsModal from "./TermsModal";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  // 로그인 상태 복원
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsed = JSON.parse(storedUser);
      setUser(parsed);
      if (!parsed.termsAccepted) {
        setShowTermsModal(true);
      }
    }
    setLoading(false);
  }, []);

  // 약관 동의 처리 (서버 반영 포함)
  const acceptTerms = async () => {
    try {
      // 서버에 동의 처리 요청
      await axiosInstance.put("/users/agree-terms");
      const updatedUser = { ...user, termsAccepted: true };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setShowTermsModal(false);
    } catch (err) {
      console.error("약관 동의 처리 실패:", err);
    }
  };

  // 회원가입
  const signup = async ({ email, password, name, phone }) => {
    try {
      const response = await axiosInstance.post("/users/signup", {
        email,
        password,
        name,
        phone,
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "회원가입 실패");
    }
  };

  // 로그인
  const login = async ({ email, password }) => {
    // 테스트 계정 로그인
    if (email === "test@example.com" && password === "test1234") {
      const userData = {
        email,
        name: "테스트 유저",
        termsAccepted: false,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", "test-token");
      setShowTermsModal(true);
      return;
    }

    // 실제 서버 연동 로그인
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });

      const { accessToken, user } = response.data;

      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      setUser(user);

      if (!user.termsAccepted) {
        setShowTermsModal(true);
      }
    } catch (error) {
      throw new Error(error.response?.data?.message || "로그인 실패");
    }
  };

  // 소셜 로그인 (토큰으로 사용자 정보 요청)
  const socialLogin = async (accessToken) => {
    try {
      const res = await axiosInstance.get("/users/me", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const userData = res.data;

      setUser(userData);
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("user", JSON.stringify(userData));

      if (!userData.termsAccepted) {
        setShowTermsModal(true);
      }
    } catch (err) {
      throw new Error("사용자 정보를 불러올 수 없습니다.");
    }
  };

  // 로그아웃
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider
      value={{ user, signup, login, logout, acceptTerms, socialLogin }}
    >
      {children}
      {showTermsModal && <TermsModal onAgree={acceptTerms} />}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
export default UserProvider;
