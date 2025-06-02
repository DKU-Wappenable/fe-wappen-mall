import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/AuthForm.css";

export default function SignupForm() {
  const navigate = useNavigate();

  const [email, setEmail] = useState(""); // 아이디
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [nickname, setNickname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const idRegex = /^[a-z0-9]{4,20}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const pwRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
    const nicknameRegex = /^[A-Za-z0-9]{2,20}$/;

    if (!idRegex.test(email)) return "아이디는 영문 소문자와 숫자 4~20자여야 합니다.";
    if (!emailRegex.test(recoveryEmail)) return "유효한 복구 이메일을 입력해주세요.";
    if (!nicknameRegex.test(nickname)) return "닉네임은 영어/숫자 2~20자여야 합니다.";
    if (!pwRegex.test(password)) return "비밀번호는 영문, 숫자, 특수문자 포함 8~20자여야 합니다.";
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

    const signupData = {
      email,
      recoveryEmail,
      nickname,
      password,
      confirmPassword,
      role: "USER",
    };

    try {
      await axiosInstance.post("/users/signup", signupData);
      toast.success("회원가입 성공! 로그인 페이지로 이동합니다.");
      navigate("/login");
    } catch (err) {
      console.warn("서버 회원가입 실패, 로컬 fallback 시도:", err);

      try {
        const savedUsers = JSON.parse(localStorage.getItem("users") || "[]");
        if (savedUsers.some((u) => u.email === email)) {
          setError("이미 사용 중인 이메일입니다.");
          return;
        }

        const newUser = {
          email,
          recoveryEmail,
          nickname,
          password,
          termsAccepted: false,
          role: "USER",
        };

        localStorage.setItem("users", JSON.stringify([newUser, ...savedUsers]));
        toast.success("임시 회원가입 완료. 로그인 해보세요!");
        navigate("/login");
      } catch (fallbackErr) {
        console.error("로컬 fallback 실패:", fallbackErr);
        setError("회원가입에 실패했습니다. 다시 시도해주세요.");
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
            placeholder="아이디 (영소문자+숫자)"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="복구용 이메일"
            value={recoveryEmail}
            onChange={(e) => setRecoveryEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="닉네임 (영어/숫자)"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="비밀번호 (영문+숫자+특수문자)"
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
