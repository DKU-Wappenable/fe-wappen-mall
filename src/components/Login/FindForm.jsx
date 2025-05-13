// /components/auth/FindForm.jsx
import React, { useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import ResetPasswordModal from "./ResetPasswordModal"; // ✅ 모달 import
import "../../styles/FindForm.css";

const FindForm = ({ mode, onClose }) => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [showResetModal, setShowResetModal] = useState(false); // ✅ 모달 표시 상태

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("");
    setLoading(true);

    try {
      let response;

      if (mode === "id") {
        // ✅ 서버 연동
        // response = await axiosInstance.post("/find-id", { name, phone });

        // ✅ 로컬 테스트
        response = { data: { message: `${name}님의 아이디는 test1234입니다.` } };
        setResult(response.data.message);
      }

      if (mode === "pw") {
        // ✅ 서버 연동
        // response = await axiosInstance.post("/find-pw", { userId, email, phone });

        // ✅ 로컬 테스트 조건
        if (userId === "test1234" && email.includes("@") && phone.length > 8) {
          setResult("사용자 인증 완료! 새 비밀번호를 입력하세요.");
          setShowResetModal(true); // ✅ 모달 표시
        } else {
          setResult("입력 정보를 다시 확인해주세요.");
        }
      }
    } catch (error) {
      setResult(error.response?.data?.error || "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ 비밀번호 모달에서 제출 시
  const handlePasswordReset = async (newPassword) => {
    try {
      // ✅ 서버 연동
      // await axiosInstance.post("/reset-password", { userId, newPassword });

      // ✅ 로컬 테스트
      console.log("비밀번호 재설정됨:", newPassword);
    } catch (err) {
      console.error("재설정 실패:", err);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>{mode === "id" ? "아이디 찾기" : "비밀번호 찾기"}</h2>

        <form onSubmit={handleSubmit}>
          {mode === "id" && (
            <>
              <input
                type="text"
                placeholder="이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <input
                type="text"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          {mode === "pw" && (
            <>
              <input
                type="text"
                placeholder="아이디"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
              />
              <input
                type="email"
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <input
                type="text"
                placeholder="전화번호"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "처리 중..." : "제출"}
          </button>

          {result && <p className="result-message">{result}</p>}
        </form>

        {/* ✅ 비밀번호 재설정 모달 */}
        {showResetModal && (
          <ResetPasswordModal
            onClose={() => setShowResetModal(false)}
            onSubmit={handlePasswordReset}
          />
        )}
      </div>
    </div>
  );
};

export default FindForm;
