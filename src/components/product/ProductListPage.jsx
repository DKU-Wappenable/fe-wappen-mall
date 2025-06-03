import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { UserContext } from '../UserContext';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoggedIn } = useContext(UserContext);

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [liked, setLiked] = useState([]);

  useEffect(() => {
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const found = products.find(p => p.id === id);
    setProduct(found);

    const likes = JSON.parse(localStorage.getItem('liked') || '[]');
    setLiked(likes);
  }, [id]);

  useEffect(() => {
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const allReviews = orders
      .filter(order => order.product?.id?.toString() === id.toString() && order.reviewed && order.review)
      .map(order => ({
        id: order.id,
        rating: order.review.rating,
        content: order.review.content,
        createdAt: order.createdAt,
        email: order.email || order.userId || '',
      }));

    setReviews(allReviews);

    if (isLoggedIn) {
      const mine = allReviews.filter(r => r.email === user?.email);
      setMyReviews(mine);
    }
  }, [id, isLoggedIn, user]);

  const toggleLike = () => {
    if (!product) return;
    const current = JSON.parse(localStorage.getItem('liked') || '[]');
    const exists = current.some(p => p.id === product.id);
    const updated = exists ? current.filter(p => p.id !== product.id) : [product, ...current];

    // 서버 연동 예시
    // if (exists) await axios.delete(`/api/likes/${product.id}`);
    // else await axios.post('/api/likes', product);

    localStorage.setItem('liked', JSON.stringify(updated));
    setLiked(updated);
  };

  const isLiked = liked.some(p => p.id === product?.id);

  const goToOrder = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }
    navigate('/order/form', { state: { product } });
  };

  const addToCart = () => {
    if (!isLoggedIn) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
      return;
    }

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = { id: Date.now(), product, quantity: 1 };
    localStorage.setItem('cart', JSON.stringify([item, ...cart]));
    alert('장바구니에 담았습니다!');
  };

  if (!product) return <div style={{ padding: '2rem' }}>상품 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <h2>{product.name}</h2>
        <button onClick={toggleLike} style={{ fontSize: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
          {isLiked ? '💖' : '🤍'}
        </button>
      </div>
      <p>{product.description}</p>
      <p>가격: {product.price.toLocaleString()}원</p>
      <p>재고: {product.stock}개</p>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
        {product.images?.map((img, i) => (
          <img key={i} src={img} alt={`product-${i}`} style={{ width: '150px' }} />
        ))}
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <button
          onClick={goToOrder}
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: '#003366',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            marginRight: '1rem'
          }}
        >
          결제하기
        </button>
        <button
          onClick={addToCart}
          style={{
            padding: '0.8rem 2rem',
            backgroundColor: '#003366',
            border: '1px solid #aaa',
            color: '#fff',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          🛒 장바구니 담기
        </button>
      </div>

      <hr />

      <h3>리뷰</h3>
      {reviews.length === 0 ? (
        <p>아직 작성된 리뷰가 없습니다.</p>
      ) : (
        <ul>
          {reviews.map((r) => (
            <li key={r.id} style={{ marginBottom: '1rem' }}>
              <p>{'⭐'.repeat(r.rating)} ({r.rating}점)</p>
              <p>{r.content}</p>
              <small style={{ color: '#777' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}

      {isLoggedIn && myReviews.length > 0 && (
        <>
          <h4>🧍‍♀️ 내가 작성한 리뷰</h4>
          <ul>
            {myReviews.map((r) => (
              <li key={r.id} style={{ marginBottom: '1rem' }}>
                <p>{'⭐'.repeat(r.rating)} ({r.rating}점)</p>
                <p>{r.content}</p>
                <small style={{ color: '#777' }}>{new Date(r.createdAt).toLocaleDateString()}</small>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
