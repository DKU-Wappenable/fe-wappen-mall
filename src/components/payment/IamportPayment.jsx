import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function MockPayment() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { items, amount, buyer, formData, discount } = state || {};

  useEffect(() => {
    console.log("🎭 Mock 결제 페이지 - 완전 가상 결제");
    console.log("🧾 결제 정보:", { items, amount, buyer, formData });
  }, []);

  const handleMockPayment = () => {
    console.log('🎭 즉시 Mock 결제 시작 - 실제 결제 없음');
    
    const merchant_uid = `mock_order_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    const now = new Date().toISOString();

    console.log('✅ Mock 결제 성공 (실제 결제 없음)');

    const newOrders = items.map(item => ({
      id: merchant_uid,
      product: item.product,
      quantity: item.quantity,
      totalPrice: item.product.price * item.quantity,
      reviewed: false,
      createdAt: now,
      name: formData.name,
      phone: formData.phone,
      email: formData.email,
      receiver: formData.receiver,
      receiverPhone1: formData.receiverPhone1,
      receiverPhone2: formData.receiverPhone2,
      address1: formData.address1,
      address2: formData.address2,
      memo: formData.memo,
      paymentMethod: formData.paymentMethod,
    }));

    const prevOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    const isDuplicate = prevOrders.some(o => o.id === merchant_uid);

    if (!isDuplicate) {
      const nextOrders = [...newOrders, ...prevOrders];
      localStorage.setItem('orders', JSON.stringify(nextOrders));

      // 포인트 적립
      const earnedPoint = Math.floor(amount * 0.05);
      const history = JSON.parse(localStorage.getItem('pointHistory') || '[]');
      history.unshift({
        type: '적립',
        amount: earnedPoint,
        date: now.split('T')[0],
        description: `${items[0].product.name || '상품'} Mock 결제 포인트 적립`,
      });
      localStorage.setItem('pointHistory', JSON.stringify(history));
    }

    localStorage.removeItem('cart');
    alert('🎭 Mock 결제 성공! (실제 결제 없음)');
    navigate('/order/complete');
  };

  if (!items || !amount || !buyer) {
    return <div style={{ padding: '2rem' }}>❗ 결제 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div style={{ textAlign: 'center', padding: '2rem' }}>
      <h2>🎭 완전 Mock 결제 (100% 안전)</h2>
      <p style={{ color: '#dc3545', marginBottom: '1rem', fontWeight: 'bold' }}>
        ⚠️ 실제 결제 없이 즉시 완료되는 가상 결제입니다
      </p>
      <p style={{ color: '#666', marginBottom: '1rem', fontSize: '0.9rem' }}>
        버튼 클릭 시 바로 주문이 완료됩니다 (실제 돈 없음)
      </p>
      <h3>총 결제 금액: {amount.toLocaleString()}원</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {items.map((item, i) => (
          <li key={i} style={{ marginBottom: '1rem' }}>
            {item.product.name} - {item.quantity}개 - {(item.product.price * item.quantity).toLocaleString()}원
          </li>
        ))}
      </ul>
      <button
        onClick={handleMockPayment}
        style={{
          padding: '0.8rem 2rem',
          background: '#ff6b6b',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        🎭 즉시 Mock 결제 완료
      </button>
    </div>
  );
}
