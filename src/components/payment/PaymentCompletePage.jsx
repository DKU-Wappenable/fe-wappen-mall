// src/pages/PaymentCompletePage.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PaymentComplete.css';

export default function PaymentCompletePage() {
  const navigate = useNavigate();

  return (
    <div className="payment-complete-container">
      <div className="complete-card">
        <h2>✅ 결제가 완료되었습니다!</h2>
        <p>주문해주셔서 감사합니다. 빠르게 준비하여 배송하겠습니다.</p>
        <button className="home-btn" onClick={() => navigate('/')}>
          홈으로 이동
        </button>
      </div>
    </div>
  );
}
