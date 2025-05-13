import React, { useEffect, useState } from 'react';
// `import axios from '../api/axiosInstance'; // ✅ 서버 연동 시 사용

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        // ✅ 서버 연동 시 사용
        /*
        const res = await axios.get('/admin/reviews');
        setReviews(res.data);
        */
        
        // 🔁 테스트용 localStorage 기반 예시
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const allReviews = orders
          .filter(order => order.reviewed && order.review)
          .map(order => ({
            id: order.id,
            userEmail: order.email || 'guest@example.com',
            productName: order.product?.name,
            productId: order.product?.id,
            rating: order.review.rating,
            content: order.review.content,
            date: order.createdAt,
          }));
        setReviews(allReviews);
      } catch (err) {
        console.error('관리자 리뷰 불러오기 실패:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    // ✅ 서버 연동 시
    /*
    try {
      await axios.delete(`/admin/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.error('리뷰 삭제 실패:', err);
    }
    */

    // 🔁 localStorage 테스트용 삭제
    const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]').map(order =>
      order.id === reviewId
        ? { ...order, reviewed: false, review: undefined }
        : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setReviews(prev => prev.filter(r => r.id !== reviewId));
  };

  const filtered = reviews.filter(
    r =>
      r.userEmail.toLowerCase().includes(search.toLowerCase()) ||
      r.productName.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ padding: '2rem' }}>
      <h2>🛠 관리자 리뷰 대시보드</h2>
      <input
        placeholder="이메일 또는 상품명 검색"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        style={{ width: '100%', padding: '0.5rem', marginBottom: '1rem' }}
      />
      {filtered.length === 0 ? (
        <p>리뷰가 없습니다.</p>
      ) : (
        <ul>
          {filtered.map((r) => (
            <li key={r.id} style={{ borderBottom: '1px solid #ccc', padding: '1rem 0' }}>
              <strong>{r.productName}</strong> ({r.rating}점)
              <p>{r.content}</p>
              <small>{r.userEmail} | {new Date(r.date).toLocaleDateString()}</small>
              <br />
              <button onClick={() => handleDelete(r.id)} style={{ marginTop: '0.5rem' }}>
                삭제
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
