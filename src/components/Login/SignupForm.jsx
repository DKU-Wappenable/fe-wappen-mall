// src/components/Login/SignupForm.jsx
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/AuthForm.css";

export default function SignupForm() {
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!id.trim()) return "아이디를 입력해주세요.";
    if (!emailRegex.test(email)) return "유효한 이메일을 입력해주세요.";
    if (password.length < 8) return "비밀번호는 8자 이상이어야 합니다.";
    if (password !== confirmPassword) return "비밀번호가 일치하지 않습니다.";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const validationMsg = validate();
    if (validationMsg) {
      setError(validationMsg);
      return;
    }

    const signupData = { id, email, password };

    try {
      await axiosInstance.post("/users/signup", signupData);
      toast.success("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      console.warn("서버 회원가입 실패, 로컬 fallback 시도:", err);

      try {
        const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        if (savedUsers.some((u) => u.id === id)) {
          setError("이미 사용 중인 아이디입니다.");
          return;
        }
        if (savedUsers.some((u) => u.email === email)) {
          setError("이미 사용 중인 이메일입니다.");
          return;
        }

        const newUser = {
          id,
          email,
          password,
          role: "user",
          termsAccepted: false,
          linkedSocials: [],
        };

        const updatedUsers = [newUser, ...savedUsers];
        localStorage.setItem("users", JSON.stringify(updatedUsers));

        toast.success(" 회원가입 완료! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } catch (fallbackErr) {
        console.error(" 회원가입 실패:", fallbackErr);
        setError("회원가입 중 오류가 발생했습니다.");
      }
    }
  };

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
        <h2>회원가입</h2>
        <p className="sub-heading">WAPPENABLE 계정으로 회원가입</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="아이디"
            value={id}
            onChange={(e) => setId(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="이메일 (아이디 찾기에 사용)"
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
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="submit-btn black">
            가입하기
          </button>
        </form>

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

        <div className="auth-links">
          <p>
            이미 계정이 있으신가요? <Link to="/login">로그인</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
