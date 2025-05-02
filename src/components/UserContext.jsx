import { createContext, useContext, useState, useEffect } from "react";
import axiosInstance from "../api/axiosInstance";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  /*// 자동 로그인 (토큰 있으면 임시 사용자 로딩)
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      // 서버 없이 임시 mock 유저 (실제 앱이면 토큰 검증 요청 필요)
      const mockUser = { email: "test@example.com", name: "테스트" };
      setUser(mockUser);
    }
    setLoading(false);
  }, []);
  */
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      axiosInstance
        .get("/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => {
          setUser(response.data); // 서버에서 반환된 사용자 데이터 설정
        })
        .catch(() => {
          localStorage.removeItem("access_token");
          setUser(null);
        });
    }
    setLoading(false);
  }, []);
  const signup = async ({ email, password, name, phone }) => {
    try {
      const response = await axiosInstance.post("/users/signup", {
        email,
        password,
        name,
        phone,
      });
      return response.data; // 서버 응답 데이터 반환
    } catch (error) {
      throw new Error(error.response?.data?.message || "회원가입 실패");
    }
  };

  const login = async ({ email, password }) => {
    try {
      const response = await axiosInstance.post("/users/login", {
        email,
        password,
      });
      const { accessToken, user } = response.data;
  
      // 토큰 저장 및 사용자 설정
      localStorage.setItem("access_token", accessToken);
      setUser(user);
    } catch (error) {
      throw new Error(error.response?.data?.message || "로그인 실패");
    }
  };
  /*
  const login = (userData) => {
    setUser(userData);
  };
  */
  const logout = () => {
    setUser(null);
    localStorage.removeItem("access_token");
  };

  if (loading) return <div>Loading...</div>;

  return (
    <UserContext.Provider value={{ user, signup, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);