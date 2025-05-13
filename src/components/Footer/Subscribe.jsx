// ✅ Subscribe.jsx
import React, { useState } from 'react';
import '../../styles/StaticPageStyle.css';

export default function Subscribe() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`${email} 구독 신청 완료! (local only)`);
    setEmail("");

    // 서버 연동 예시 (주석 처리)
    // axiosInstance.post('/api/subscribe', { email })
    //   .then(res => console.log('구독 완료'))
    //   .catch(err => console.error(err));
  };

  return (
    <div className="page-container">
      <h1>뉴스레터 구독</h1>
      <p>와펜에이블의 최신 상품, 이벤트 소식을 가장 먼저 받아보세요.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="이메일 주소 입력"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">구독 신청</button>
      </form>
    </div>
  );
}