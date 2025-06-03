// /components/auth/ResetPasswordModal.jsx
import React, { useState } from "react";
import "../../styles/ResetPasswordModal.css";

export default function ResetPasswordModal({ onClose, onSubmit }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (!newPassword || !confirmPassword) {
      return setError("모든 필드를 입력하세요.");
    }
    if (newPassword !== confirmPassword) {
      return setError("비밀번호가 일치하지 않습니다.");
    }

    try {
      // ✅ 서버 연동 (주석 처리)
      // await axiosInstance.post("/reset-password", { newPassword });

      // ✅ 로컬 테스트용 처리
      onSubmit(newPassword);
      alert("비밀번호가 성공적으로 재설정되었습니다.");
      onClose();
    } catch (err) {
      setError("비밀번호 재설정 실패: " + (err.response?.data?.error || "오류 발생"));
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">🔐 비밀번호 찾기</h2>
        <input
          type="password"
          placeholder="새 비밀번호"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="modal-input"
        />
        <input
          type="password"
          placeholder="비밀번호 확인"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          style={{ marginBottom: "10px" }} // ✅ 스타일 분리
          className="modal-input"
        />
        {error && <p className="error-message">{error}</p>}
        <button className="submit-btn modal-btn" onClick={handleSubmit}>
          비밀번호 재설정
        </button>
      </div>
    </div>
  );
}
