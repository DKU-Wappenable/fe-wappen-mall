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
    <div>
      <h3>주문 내역</h3>

      <div style={{ marginBottom: '1rem' }}>
        <button
          onClick={() => setActiveTab('active')}
          className={activeTab === 'active' ? 'active-tab' : ''}
        >
          주문 보기
        </button>
        <button
          onClick={() => setActiveTab('canceled')}
          className={activeTab === 'canceled' ? 'active-tab' : ''}
          style={{ marginLeft: '1rem' }}
        >
          취소된 주문 보기
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <p>{activeTab === 'active' ? '주문 내역이 없습니다.' : '취소된 주문이 없습니다.'}</p>
      ) : (
        <ul>
          {filteredOrders.map((order) => (
            <li key={order.id} style={{ marginBottom: '2rem' }}>
              <p><strong>주문 ID:</strong> <Link to={`/my-orders/${order.id}`}>{order.id}</Link></p>
              <p>상품: by {user?.email || '사용자'}</p>
              <p>수량: {order.items?.reduce((sum, item) => sum + item.quantity, 0)} 개</p>
              <p>총액: {Number(order.totalPrice).toLocaleString()} 원</p>
              <p>주문 날짜: {order.orderedAt ? new Date(order.orderedAt).toLocaleDateString() : '날짜 없음'}</p>
              <p>상태: {statusMap[order.status] || order.status}</p>

              {/* 상태가 주문 완료 또는 입금 대기 등에서만 취소 가능 */}
              {activeTab === 'active' && ['ORDERED', 'WAITING_FOR_DEPOSIT'].includes(order.status) && (
                <button onClick={() => cancelOrder(order.id)} style={{ marginTop: '0.5rem' }}>
                  주문 취소
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
