import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
// import axios from '../../api/axiosInstance'; // ✅ 서버 연동용

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'canceled'

  useEffect(() => {
    // ✅ 로컬 스토리지에서 불러오기
    const saved = JSON.parse(localStorage.getItem('orders') || '[]');
    const sorted = [...saved].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setOrders(sorted);

    // ✅ 서버 연동 시
    /*
    axios.get('/orders')
      .then(res => {
        const sorted = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setOrders(sorted);
      })
      .catch(err => console.error('주문 목록 불러오기 실패', err));
    */
  }, []);

  const cancelOrder = (id) => {
    const updated = orders.map(order =>
      order.id === id ? { ...order, status: '취소됨' } : order
    );
    setOrders(updated);
    localStorage.setItem('orders', JSON.stringify(updated));

    // ✅ 서버 연동 시
    /*
    axios.put(`/orders/${id}/cancel`)
      .then(() => setOrders(updated))
      .catch(err => console.error('주문 취소 실패', err));
    */
  };

  const filteredOrders = activeTab === 'active'
  ? orders.filter(order => order.status !== '취소됨')
  : orders.filter(order => order.status === '취소됨');


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
              <p>
                <strong>• 주문 ID:</strong>{' '}
                <Link to={`/my-orders/${order.id}`}>{order.id}</Link>
              </p>
              <p>상품: {order.product.name}</p>
              <p>수량: {order.quantity} 개</p>
              <p>총액: {order.totalPrice.toLocaleString()} 원</p>
              <p>주문 날짜: {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>상태: {order.status || '주문완료'}</p>

              {activeTab === 'active' && (!order.status || order.status === '주문완료') && (
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
