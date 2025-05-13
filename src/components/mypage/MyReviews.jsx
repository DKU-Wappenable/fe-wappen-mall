import React, { useEffect, useState } from 'react';

export default function MyReviews() {
  const [myReviews, setMyReviews] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState('');
  const [editRating, setEditRating] = useState('');

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const reviews = orders
      .filter(order => order.reviewed && order.review)
      .map(order => ({
        orderId: order.id,
        productName: order.product?.name || '(알 수 없음)',
        productId: order.product?.id,
        rating: order.review.rating,
        content: order.review.content,
        date: order.createdAt,
      }));
    setMyReviews(reviews);
  }, []);

  const handleDelete = (orderId) => {
    const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]').map(order =>
      order.id === orderId
        ? { ...order, reviewed: false, review: undefined }
        : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));
    setMyReviews(prev => prev.filter(r => r.orderId !== orderId));
  };

  const startEdit = (review) => {
    setEditingId(review.orderId);
    setEditContent(review.content);
    setEditRating(review.rating);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditContent('');
    setEditRating('');
  };

  const saveEdit = () => {
    if (!editContent.trim() || editRating < 1 || editRating > 5) {
      alert('리뷰 내용과 별점을 모두 입력해주세요.');
      return;
    }

    const updatedOrders = JSON.parse(localStorage.getItem('orders') || '[]').map(order =>
      order.id === editingId
        ? { ...order, review: { content: editContent, rating: Number(editRating) } }
        : order
    );
    localStorage.setItem('orders', JSON.stringify(updatedOrders));

    setMyReviews(prev =>
      prev.map(r =>
        r.orderId === editingId ? { ...r, content: editContent, rating: Number(editRating) } : r
      )
    );

    cancelEdit();
  };

  if (myReviews.length === 0) {
    return <div style={{ padding: '2rem' }}>작성한 리뷰가 없습니다.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h3>내가 작성한 리뷰</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {myReviews.map((r) => (
          <li key={r.orderId} style={{ marginBottom: '2rem', borderBottom: '1px solid #ccc', paddingBottom: '1rem' }}>
            <strong>{r.productName}</strong>
            <p>{new Date(r.date).toLocaleDateString()}</p>

            {editingId === r.orderId ? (
              <>
                <label>별점: </label>
                <select value={editRating} onChange={(e) => setEditRating(e.target.value)}>
                  {[1, 2, 3, 4, 5].map(v => (
                    <option key={v} value={v}>{'⭐'.repeat(v)}</option>
                  ))}
                </select>
                <br />
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  style={{ width: '100%', height: '80px', marginTop: '0.5rem' }}
                />
                <br />
                <button onClick={saveEdit} style={{ marginRight: '0.5rem' }}>저장</button>
                <button onClick={cancelEdit}>취소</button>
              </>
            ) : (
              <>
                <p>{'⭐'.repeat(r.rating)} ({r.rating}점)</p>
                <p>{r.content}</p>
                <button onClick={() => startEdit(r)} style={{ marginRight: '0.5rem' }}>수정</button>
                <button onClick={() => handleDelete(r.orderId)}>삭제</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
