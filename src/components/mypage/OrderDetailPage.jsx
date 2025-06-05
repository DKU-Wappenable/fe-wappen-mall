import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../../components/UserContext';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'canceled'
  const { user } = useUser();

  // ✅ 상태값 매핑
  const statusMap = {
    PAID: '결제 완료',
    WAITING_FOR_DEPOSIT: '입금 대기',
    ORDERED: '주문 완료',
    CANCELED: '취소됨',
    COMPLETED: '배송 완료'
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders/user');
        const sorted = [...res.data].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
        setOrders(sorted);
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');
        const saved = JSON.parse(localStorage.getItem('orders') || '[]');
        const sorted = [...saved].sort((a, b) => new Date(b.orderedAt) - new Date(a.orderedAt));
        setOrders(sorted);
      }
    };

    fetchOrders();
  }, []);

  const cancelOrder = async (id) => {
    try {
      await axiosInstance.patch(`/orders/${id}/cancel`);
      const updated = orders.map(order =>
        order.id === id ? { ...order, status: 'CANCELED' } : order
      );
      setOrders(updated);
    } catch (err) {
      console.warn('서버 실패 → localStorage 대체');
      const updated = orders.map(order =>
        order.id === id ? { ...order, status: 'CANCELED' } : order
      );
      setOrders(updated);
      localStorage.setItem('orders', JSON.stringify(updated));
    }
  };

  const filteredOrders =
    activeTab === 'active'
      ? orders.filter(order => order.status !== 'CANCELED')
      : orders.filter(order => order.status === 'CANCELED');

  return (
    <div style={{ padding: '2rem' }}>
      <h2>주문 상세</h2>
      <p><strong>주문 ID:</strong> {order.id}</p>
      <p><strong>주문 날짜:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
   <p>
  {product.name
    ? `상품: ${product.name}`
    : `유저디자인: ${product.createdBy || product.owner || '알 수 없음'}`}
</p>

      <p><strong>수량:</strong> {quantity}개</p>
      <p><strong>총 결제 금액:</strong> {totalPrice.toLocaleString()}원</p>
      <p><strong>결제 수단:</strong> {paymentMethod || '신용카드'}</p>

      {product.images?.[0] && (
        <div style={{ marginTop: '1rem' }}>
          <p><strong>주문 디자인 미리보기:</strong></p>
          <img
            src={product.images[0]}
            alt="커스터마이징 이미지"
            style={{
              width: '200px',
              border: '1px solid #ccc',
              borderRadius: '8px',
              marginTop: '8px'
            }}
          />
        </div>
      )}

      <hr style={{ margin: '2rem 0' }} />
      <h3>배송 정보</h3>
      <p><strong>수령인:</strong> {receiver}</p>
      <p><strong>연락처:</strong> {receiverPhone1}</p>
      <p><strong>주소:</strong> {address1} {address2}</p>
      <p><strong>배송 메모:</strong> {memo || '(없음)'}</p>

      <button onClick={() => navigate('/my-page')} style={{ marginTop: '1.5rem' }}>
        ← 마이페이지로 돌아가기
      </button>
    </div>
  );
}
