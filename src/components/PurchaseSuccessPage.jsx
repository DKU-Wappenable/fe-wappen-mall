import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/PurchaseSuccess.css'; // 스타일 따로 분리해도 돼

export default function PurchaseSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="purchase-success-container">
      <h2>🎉 결제가 완료되었습니다!</h2>
      <p>주문해주셔서 감사합니다.</p>
      <button className="go-home-btn" onClick={() => navigate('/')}>
        홈으로 이동
      </button>
    </div>
  );
}