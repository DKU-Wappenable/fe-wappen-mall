import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../UserContext";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/AuthForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      if (user.role === "admin") navigate("/admin");
      else if (user.role === "owner") navigate("/admin/upload");
      else navigate("/");
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // 1차 서버 로그인 시도
      const res = await axiosInstance.post("/users/login", { email, password });
      const { accessToken } = res.data;

      localStorage.setItem("access_token", accessToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      try {
        // 2차 사용자 정보 조회
        const userRes = await axiosInstance.get("/users/me");
        const userData = userRes.data;

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        toast.success("로그인 성공!");

        if (userData.role === "admin") navigate("/admin");
        else if (!userData.termsAccepted) return;
        else if (userData.role === "owner") navigate("/admin/upload");
        else navigate("/");

      } catch (meError) {
        // /users/me API가 없는 경우 → 임시 로그인 처리
        console.warn("/users/me 없음, 임시 로그인 처리:", meError);

        const fallbackUser = {
          email,
          role: "user",
          nickname: "임시사용자",
          termsAccepted: false
        };

        localStorage.setItem("user", JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        toast.success("로그인 성공 (임시 처리)");

        navigate("/");
      }

    } catch (err) {
      // 서버 로그인 실패 → 로컬 fallback
      console.warn("서버 로그인 실패, 로컬 fallback 시도:", err);

      try {
        const staticUsers = [
          {
            id: "admin",
            password: "admin1234",
            email: "admin@example.com",
            nickname: "관리자",
            role: "admin",
            termsAccepted: true,
            linkedSocials: [],
          },
          {
            id: "owner",
            password: "owner1234",
            email: "owner@example.com",
            nickname: "오너",
            role: "owner",
            termsAccepted: false,
            linkedSocials: [],
          },
          {
            id: "user",
            password: "user1234",
            email: "user@example.com",
            nickname: "사용자",
            role: "user",
            termsAccepted: false,
            linkedSocials: [],
          },
          {
            id: "test",
            password: "test1234",
            email: "test@example.com",
            nickname: "테스트",
            role: "admin",
            termsAccepted: true,
            linkedSocials: ["kakao"],
          }
        ];

        const localUsers = JSON.parse(localStorage.getItem("users") || "[]");
        const allUsers = [...staticUsers, ...localUsers];

        const found = allUsers.find((u) => u.email === email && u.password === password);

        if (found) {
          localStorage.setItem("user", JSON.stringify(found));
          setUser(found);
          toast.success("로그인 성공!");

          if (found.role === "admin") navigate("/admin");
          else if (!found.termsAccepted) return;
          else if (found.role === "owner") navigate("/admin/upload");
          else navigate("/");
        } else {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        }
      } catch (fallbackErr) {
        console.error("로컬 fallback 실패:", fallbackErr);
        setError("로그인 실패");
      }
    }
  };

  // ✅ 소셜 로그인 이동 함수
  const handleSocialLogin = (provider) => {
    const providers = {
      카카오: "/oauth2/authorization/kakao",
      네이버: "/oauth2/authorization/naver",
      구글: "/oauth2/authorization/google",
    };
    if (providers[provider]) window.location.href = providers[provider];
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>로그인</h2>
        <p className="sub-heading">WAPPENABLE 계정으로 로그인</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn black">
            로그인
          </button>
        </form>

        <div className="auth-links">
          <p>
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/find-id" style={{ marginRight: '12px' }}>아이디 찾기</Link>
            <Link to="/find-pw">비밀번호 찾기</Link>
          </p>
        </div>

        {/* ✅ 소셜 로그인 안내 및 버튼 */}
        <div className="divider">또는 다른 서비스 계정으로 로그인</div>
        <div className="social-login-group">
          <button className="social-btn kakao" onClick={() => handleSocialLogin("카카오")}>
            <img src="/assets/kakao_icon.png" alt="카카오 로그인" />
          </button>
          <button className="social-btn naver" onClick={() => handleSocialLogin("네이버")}>
            <img src="/assets/naver_icon.png" alt="네이버 로그인" />
          </button>
          <button className="social-btn google" onClick={() => handleSocialLogin("구글")}>
            <img src="/assets/google_icon.png" alt="구글 로그인" />
          </button>
        </div>
      </div>
    </div>
  );
}
