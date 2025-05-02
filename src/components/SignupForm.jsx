import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUser } from "../components/UserContext";
import { toast } from "react-toastify";
import axiosInstance from "../api/axiosInstance";
import "../styles/AuthForm.css";

export default function SignupForm() {
  const navigate = useNavigate();
  const { signup } = useUser();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const [showTerms, setShowTerms] = useState(false);
  const [pendingNavigation, setPendingNavigation] = useState(false);

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
      await signup({ email, password, name, phone });
      const agreed = localStorage.getItem("agreed_terms") === "true";
      if (!agreed) {
        setPendingNavigation(true);
        setShowTerms(true);
        return;
      }

      toast.success("회원가입이 완료되었습니다. 로그인해주세요.");
      navigate("/login");
    } catch (err) {
      setError(err.message || "회원가입 중 오류가 발생했습니다.");
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

  const handleAgree = () => {
    localStorage.setItem("agreed_terms", "true");
    setShowTerms(false);
    if (pendingNavigation) {
      toast.success("약관에 동의하셨습니다. 로그인해주세요.");
      navigate("/login");
    }
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

      {showTerms && (
        <div className="terms-modal">
          <div className="terms-box">
            <h2>이용약관</h2>
            <div className="terms-content">
              <p><strong>제1조 (목적)</strong></p>
              <p>본 약관은 형이 만든 Wappen 서비스의 이용조건, 절차, 권리, 의무를 규정합니다.</p>
              <p><strong>제2조 (약관의 명시와 개정)</strong></p>
              <ol>
                <li>서비스는 이 약관을 화면에 게시합니다.</li>
                <li>법령에 따라 개정 가능하며 사전 고지합니다.</li>
                <li>회원은 동의하지 않을 경우 탈퇴할 수 있습니다.</li>
              </ol>
            </div>
            <button onClick={handleAgree} className="submit-btn black" style={{ marginTop: "16px" }}>
              동의하고 계속하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}