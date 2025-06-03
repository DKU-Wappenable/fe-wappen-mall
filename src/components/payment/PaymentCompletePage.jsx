// src/pages/PaymentCompletePage.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/PaymentComplete.css';

export default function PaymentCompletePage() {
  const navigate = useNavigate();
  const [latestOrder, setLatestOrder] = useState(null);

  useEffect(() => {
    const allOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    if (allOrders.length > 0) {
      const sorted = allOrders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setLatestOrder(sorted[0]);
    }
  }, []);

  return (
    <div className="payment-complete-container">
      <div className="complete-card">
        <h2> 결제가 완료되었습니다!</h2>
        <p>주문해주셔서 감사합니다. 빠르게 준비하여 배송하겠습니다.</p>

        {latestOrder ? (
          <div className="order-summary-box">
            <p><strong>{latestOrder.product.name}</strong> 외 {latestOrder.quantity}개</p>
            <p>총 결제 금액: <strong>{(latestOrder.totalPrice).toLocaleString()}원</strong></p>
          </div>
        ) : (
          <p>최근 주문 정보를 불러올 수 없습니다.</p>
        )}

        <button className="mypage-btn" onClick={() => navigate('/')}>
          홈으로 이동
        </button>
        <button className="mypage-btn" onClick={() => navigate('/my-page')}>
          마이페이지
        </button>
      </div>
    </div>
  );
}
