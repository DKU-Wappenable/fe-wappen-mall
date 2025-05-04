import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance"; // API 요청용 Axios 인스턴스 import
import "../styles/FindForm.css"; // 스타일 파일 import

// FindForm 컴포넌트: 아이디 또는 비밀번호 찾기용 폼
const FindForm = ({ mode, onClose }) => {
  // 상태 변수 정의
  const [result, setResult] = useState(""); // 결과 메시지
  const [loading, setLoading] = useState(false); // 로딩 상태
  const [name, setName] = useState(""); // 이름 입력값
  const [phone, setPhone] = useState(""); // 전화번호 입력값
  const [email, setEmail] = useState(""); // 이메일 입력값
  const [userId, setUserId] = useState(""); // 아이디 입력값 (비밀번호 찾기용)

  // 폼 제출 핸들러 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 폼 기본 동작 막기
    setResult(""); // 결과 메시지 초기화
    setLoading(true); // 로딩 시작

    try {
      let response;
      if (mode === "id") {
        // 아이디 찾기 요청
        response = await axiosInstance.post("/find-id", { name, phone });
      } else if (mode === "pw") {
        // 비밀번호 찾기 요청
        response = await axiosInstance.post("/find-pw", { userId, email, phone });
      }

      // 결과 메시지 설정
      setResult(response.data.message || "요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      // 에러 발생 시 메시지 설정
      setResult(error.response?.data?.error || "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 종료
    }
  };

  // UI 반환
  return (
    <div className="auth-container">
      <div className="auth-box">
        {/* 닫기 버튼 */}
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>

        {/* 제목: 모드에 따라 아이디 찾기 또는 비밀번호 찾기 */}
        <h2>{mode === "id" ? "아이디 찾기" : "비밀번호 찾기"}</h2>

        {/* 입력 폼 */}
        <form onSubmit={handleSubmit}>
          {/* 아이디 찾기 모드일 때 보여줄 입력칸 */}
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

          {/* 비밀번호 찾기 모드일 때 보여줄 입력칸 */}
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

          {/* 제출 버튼 */}
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "처리 중..." : "제출"}
          </button>

          {/* 결과 메시지 출력 */}
          {result && <p className="result-message">{result}</p>}
        </form>
      </div>
    </div>
  );
};

export default FindForm;