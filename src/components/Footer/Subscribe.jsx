//  Subscribe.jsx - 서버 연동 + 실패 시 로컬 fallback 구조 추가
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function Subscribe() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email.includes('@')) {
      setError('유효한 이메일 주소를 입력해주세요.');
      return;
    }

    try {
      await axiosInstance.post('/subscribe', { email });
      setSubscribed(true);
    } catch (err) {
      console.warn('서버 실패, 로컬 fallback 시도:', err);
      try {
        const prev = JSON.parse(localStorage.getItem('subscribers') || '[]');
        const updated = [...prev, { email, date: new Date().toISOString() }];
        localStorage.setItem('subscribers', JSON.stringify(updated));
        setSubscribed(true);
      } catch (localErr) {
        console.error('로컬 저장 실패:', localErr);
        setError('구독 처리에 실패했습니다.');
      }
    }
  };

  useEffect(() => {
    setError('');
  }, [email]);

  return (
    <div className="subscribe-wrapper">
      <h2>뉴스레터 구독하기</h2>
      {subscribed ? (
        <p> 구독이 완료되었습니다. 감사합니다!</p>
      ) : (
        <form onSubmit={handleSubmit} className="subscribe-form">
          <input
            type="email"
            placeholder="이메일 주소 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button type="submit">구독</button>
        </form>
      )}
      {error && <p className="error-message">❗ {error}</p>}
    </div>
  );
}
