import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../UserContext";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/AuthForm.css";

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup, setUser } = useUser(); // ✅ setUser 필요 시 포함

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  // 이메일 중복 확인 (local 테스트용 비워둬도 OK)
  const checkDuplicateEmail = async () => {
    try {
      const res = await axiosInstance.get(`/check-email?email=${email}`);
      if (res.data.exists) {
        toast.error("이미 사용 중인 이메일입니다.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 회원가입 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("유효한 이메일을 입력해주세요.");
      return;
    }
    if (password.length < 8) {
      setError("비밀번호는 8자 이상이어야 합니다.");
      return;
    }
    if (password !== confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    try {
      // ✅ 서버 연동 시
      /*
      await signup({ email, password, name, phone });
      */

      // ✅ localStorage 테스트용 저장
      const userData = {
        email,
        name,
        phone,
        role: "user",
        termsAccepted: false,
        linkedSocials: [],
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("access_token", "dummy-token");
      setUser(userData); // 상태도 반영 (옵션)

      navigate("/signup/complete"); // ✅ 이동!
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
    }
  };

  // 소셜 로그인 처리
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
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={checkDuplicateEmail}
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
          <input
            type="text"
            placeholder="이름"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="연락처"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
          <button type="submit" className="submit-btn black">
            가입하기
          </button>
        </form>

        <div className="divider">또는 다른 서비스 계정으로 로그인</div>

        <div className="social-login-group">
          <button className="social-btn kakao" onClick={() => handleSocialLogin('카카오')}>
            <img src="/assets/kakao_icon.png" alt="카카오 로그인" />
          </button>
          <button className="social-btn naver" onClick={() => handleSocialLogin('네이버')}>
            <img src="/assets/naver_icon.png" alt="네이버 로그인" />
          </button>
          <button className="social-btn google" onClick={() => handleSocialLogin('구글')}>
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
