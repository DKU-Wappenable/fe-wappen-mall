//  AdminReviewDashboard.jsx - 서버 연동 + 실패 시 localStorage fallback 처리
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosInstance';

export default function AdminReviewDashboard() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get('/admin/reviews');
        setReviews(res.data);
      } catch (err) {
        console.warn('서버 오류 발생, 로컬로 대체');
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        const localReviews = orders.filter(o => o.reviewed && o.review).map(o => ({
          id: o.id,
          email: o.email || '-',
          product: o.product?.name || '알 수 없음',
          rating: o.review.rating,
          content: o.review.content,
          createdAt: o.createdAt
        }));
        setReviews(localReviews);
      }
    };

    fetchReviews();
  }, []);

  const handleDelete = async (reviewId) => {
    if (!window.confirm('정말 이 리뷰를 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/admin/reviews/${reviewId}`);
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    } catch (err) {
      console.warn('서버 삭제 실패, 로컬에서 삭제 시도');
      const orders = JSON.parse(localStorage.getItem('orders') || '[]').map(order =>
        order.id === reviewId ? { ...order, reviewed: false, review: undefined } : order
      );
      localStorage.setItem('orders', JSON.stringify(orders));
      setReviews(prev => prev.filter(r => r.id !== reviewId));
    }
  };

  return (
    <div className="admin-review-dashboard">
      <h2> 전체 리뷰 관리</h2>
      {reviews.length === 0 ? (
        <p>등록된 리뷰가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>리뷰 ID</th>
              <th>작성자</th>
              <th>상품명</th>
              <th>별점</th>
              <th>내용</th>
              <th>작성일</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.id}</td>
                <td>{r.email}</td>
                <td>{r.product}</td>
                <td>{'⭐'.repeat(r.rating)} ({r.rating})</td>
                <td>{r.content}</td>
                <td>{new Date(r.createdAt).toLocaleDateString()}</td>
                <td>
                  <button onClick={() => handleDelete(r.id)}>삭제</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
