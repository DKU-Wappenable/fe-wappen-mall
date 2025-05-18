// src/pages/PendingReviews.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function PendingReviews() {
  const [reviews, setReviews] = useState([]);
  const [inputs, setInputs] = useState({});
  const [ratings, setRatings] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axiosInstance.get('/orders');
        const pending = res.data.filter(order => !order.reviewed);
        setReviews(pending);
      } catch (err) {
        console.warn('서버 오류 발생, 로컬 주문 사용');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const pending = orders.filter(order => !order.reviewed);
        setReviews(pending);
      }
    };

    fetchOrders();
  }, []);

  const handleChangeText = (id, value) => {
    setInputs(prev => ({ ...prev, [id]: value }));
  };

  const handleChangeRating = (id, value) => {
    setRatings(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (id) => {
    const content = inputs[id]?.trim();
    const rating = ratings[id];

    if (!content) return alert('리뷰 내용을 입력해주세요.');
    if (!rating || rating < 1 || rating > 5) return alert('별점을 선택해주세요.');

    try {
      await axiosInstance.post('/reviews', { orderId: id, content, rating });
      setReviews(prev => prev.filter(o => o.id !== id));
      alert('리뷰가 작성되었습니다!');
    } catch (err) {
      console.warn('서버 실패, 로컬로 리뷰 저장');
      const updated = JSON.parse(localStorage.getItem('orders') || '[]').map(order =>
        order.id === id
          ? { ...order, reviewed: true, review: { rating, content } }
          : order
      );
      localStorage.setItem('orders', JSON.stringify(updated));
      setReviews(prev => prev.filter(o => o.id !== id));
      alert('리뷰가 로컬에 저장되었습니다.');
    }
  };

  if (reviews.length === 0) {
    return <div style={{ padding: '2rem' }}>작성 가능한 리뷰가 없습니다.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h3>작성 가능한 리뷰</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {reviews.map(order => (
          <li key={order.id} style={{ marginBottom: '2rem' }}>
            <strong>{order.product?.name}</strong> - {new Date(order.createdAt).toLocaleDateString()}

            <div style={{ margin: '0.5rem 0' }}>
              <label>별점: </label>
              <select
                value={ratings[order.id] || ''}
                onChange={(e) => handleChangeRating(order.id, parseInt(e.target.value))}
              >
                <option value="">선택</option>
                {[1, 2, 3, 4, 5].map(v => (
                  <option key={v} value={v}>{'⭐'.repeat(v)}</option>
                ))}
              </select>
            </div>

            <textarea
              value={inputs[order.id] || ''}
              onChange={(e) => handleChangeText(order.id, e.target.value)}
              placeholder="리뷰를 입력하세요"
              style={{ width: '100%', height: '80px' }}
            />

            <button
              onClick={() => handleSubmit(order.id)}
              style={{
                marginTop: '0.5rem',
                backgroundColor: '#0d4b80',
                color: 'white',
                padding: '0.4rem 1.2rem',
                border: 'none',
                borderRadius: '4px'
              }}
            >
              리뷰 작성
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
