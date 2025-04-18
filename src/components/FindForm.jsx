
import React from "react";
import "../styles/AuthForm.css";

export default function FindForm({ onClose, mode }) {
  return (
    <div className="auth-modal">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2>{mode === "id" ? "아이디 찾기" : "비밀번호 찾기"}</h2>

        <p className="info-text">기능 아직 구현 못 함 ㅠ</p>
        <button className="submit-btn black" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
