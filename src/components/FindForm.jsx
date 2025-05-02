import React, { useState } from "react";
import axiosInstance from "../api/axiosInstance";
import "../styles/FindForm.css"; // 스타일 파일 추가

const FindForm = ({ mode, onClose }) => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [userId, setUserId] = useState(""); // 비밀번호 찾기용 아이디 추가

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult(""); // 결과 초기화
    setLoading(true); // 로딩 상태 활성화

    try {
      let response;
      if (mode === "id") {
        // 아이디 찾기 요청
        response = await axiosInstance.post("/find-id", { name, phone });
      } else if (mode === "pw") {
        // 비밀번호 찾기 요청
        response = await axiosInstance.post("/find-pw", { userId, email, phone });
      }

      setResult(response.data.message || "요청이 성공적으로 처리되었습니다.");
    } catch (error) {
      setResult(error.response?.data?.error || "요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false); // 로딩 상태 비활성화
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
      </div>
    </div>
  );
};

export default FindForm;