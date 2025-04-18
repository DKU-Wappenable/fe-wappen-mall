import React, { useState } from "react";
import { useUser } from "./UserContext";
import "../styles/AuthForm.css";


export default function SignupForm({ onClose, step, setStep }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { login } = useUser();

  const handleSignup = () => {
    if (!email || !password || !confirm || !name || !phone) {
      setError("모든 항목을 입력해주세요.");
      return;
    }
    if (password !== confirm) {s
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }
    alert("회원가입 완료 (가정)");
    onClose();
  };
  const handleKakaoLogin = () => {
    console.log("카카오 로그인 데모 성공");
    alert("데모용 카카오 로그인 성공!");
    onClose();
  };
  const handleKakaoSignup = () => {
    alert("카카오로 회원가입 (데모 성공!)");
    onClose();
  };

  if (step === "kakao") {
    return (
      <div className="auth-modal">
        <div className="auth-box">
          <button className="close-btn" onClick={onClose}>×</button>
          <h2>회원가입</h2>

          <button className="kakao-btn" onClick={handleKakaoSignup}>
            카카오로 시작하기
          </button>
          <div className="divider">또는</div>

          <button
            className="submit-btn outline"
            onClick={() => setStep("detail")}
          >
            ID/PW 회원가입
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-modal">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>회원가입</h2>

        <p className="info-text">
          추후 공지사항 및 신제품정보를 받고 싶으시면 회원으로 가입해 주세요.
        </p>

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
        <div className="input-wrap">
        <input
          type={showConfirm ? "text" : "password"}
          placeholder="비밀번호 확인"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <button type="button" className="eye-btn" onClick={() => setShowConfirm(!showConfirm)}>
            {showConfirm ? (
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
        <div className="inline-inputs">
          <input
            type="text"
            placeholder="이름(을) 입력하세요"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="연락처"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {error && <p className="error-text">{error}</p>}

        <button className="submit-btn black white-text" onClick={handleSignup}>가입하기</button>
      </div>
    </div>
  );
}