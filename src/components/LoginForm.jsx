import React, { useState } from "react";
import "../styles/AuthForm.css";
import { toast } from "react-toastify";
import { useUser } from "./UserContext";

export default function LoginForm({ onClose, onSwitch, setStep }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useUser();

  const handleLogin = () => {
    if (!email || !password) {
      toast.error("이메일과 비밀번호를 입력해주세요");
      return;
    }
    login({ nickname: "JJ" });
    toast.success("로그인 성공!");
    onClose();
  };

  const handleKakaoLogin = () => {
    alert("데모용 카카오 로그인 성공!");
    login({ nickname: "JJ" });
    onClose();
  };

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>로그인</h2>

        <button className="kakao-btn" onClick={handleKakaoLogin}>
          카카오로 시작하기
        </button>

        <div className="divider">또는</div>

        {/* 아이디 입력창도 감싸기 */}
        <div className="input-wrap">
        <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
        />
        </div>

        <div className="input-wrap">
        <input
            type={showPassword ? "text" : "password"}
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
        />
        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M12 5c-7.633 0-11 7-11 7s3.367 7 11 7 11-7 11-7-3.367-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10z" />
            </svg>
            ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                <path fill="currentColor" d="M3 3l18 18M10.58 10.59A2 2 0 0112 10c1.1 0 2 .9 2 2 0 .42-.13.81-.35 1.13M9.17 9.17a3.5 3.5 0 004.95 4.95M5.35 5.35C3.91 6.6 2.73 8.17 2.25 10c1.48 4.39 5.25 7.5 9.75 7.5 1.78 0 3.48-.44 4.95-1.23" />
            </svg>
            )}
        </button>
        </div>


        <button className="submit-btn black" onClick={handleLogin}>로그인</button>

        <div className="auth-links">
          <a onClick={() => {
            setStep("kakao");
            onSwitch("signup");
          }}>회원가입</a>
          <span className="divider-inline">|</span>
          <a href="#" onClick={() => onSwitch("find-id")}>아이디 찾기</a>
          <span className="divider-inline">|</span>
          <a href="#" onClick={() => onSwitch("find-pw")}>비밀번호 찾기</a>
        </div>
      </div>
    </div>
  );
}
