// ✅ 리뷰 보기까지 포함한 ProductDetailPage.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';

export default function ProductDetailPage() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        const p = res.data;
        setProduct({
          ...p,
          images: p.images?.length ? p.images : [p.image || '/assets/default.png']
        });
      } catch (err) {
        console.warn('서버 실패, 로컬에서 상품 검색');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
        const merged = [...products, ...shared];
        const found = merged.find(p => String(p.id) === String(id));
        if (found) {
          setProduct({
            ...found,
            images: found.images?.length ? found.images : [found.image || '/assets/default.png']
          });
        } else if (state) {
          setProduct({
            ...state,
            images: state.images?.length ? state.images : [state.image || '/assets/default.png']
          });
        }
      }
    };

    fetchProduct();
  }, [id, state]);

  useEffect(() => {
    const fetchReviews = () => {
      const orders = JSON.parse(localStorage.getItem('orders') || '[]');
      const matched = orders
        .filter(order => order.product?.id === product?.id && order.review)
        .map(order => order.review);
      setReviews(matched);
    };

    if (product) {
      fetchReviews();
    }
  }, [product]);

  const handleQuantityChange = (delta) => {
    setQuantity(prev => Math.max(1, prev + delta));
  };

  const handleAddToCart = async () => {
    try {
      await axiosInstance.post('/cart', { productId: product.id, quantity });
      alert('장바구니에 담았습니다!');
    } catch (err) {
      console.warn('서버 실패, 로컬 장바구니로 대체');
      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const existing = cart.find(item => item.product.id === product.id);
      let updated;

      if (existing) {
        updated = cart.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updated = [{ id: Date.now(), product, quantity }, ...cart];
      }

      localStorage.setItem('cart', JSON.stringify(updated));
      alert('장바구니에 담았습니다!');
    }
  };

  const handleBuyNow = () => {
    navigate('/order/form', { state: { product, quantity } });
  };

  if (!product) return <div style={{ padding: '2rem' }}>상품 정보를 찾을 수 없습니다.</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{product.name}</h2>
      <img
        src={product.images[0]}
        alt={product.name}
        style={{ width: '300px', height: '300px', objectFit: 'contain', borderRadius: '8px' }}
        onError={(e) => (e.target.src = '/assets/default.png')}
      />
      <p>{product.description || '설명 없음'}</p>
      {product.nickname && <p>by {product.nickname}</p>}
      <p style={{ fontWeight: 'bold' }}>{(product.price ?? 0).toLocaleString()}원</p>

      <div style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={() => handleQuantityChange(-1)}>➖</button>
        <span>{quantity}</span>
        <button onClick={() => handleQuantityChange(1)}>➕</button>
      </div>

      <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
        <button onClick={handleAddToCart} style={{
          padding: '0.6rem 1.5rem',
          backgroundColor: '#fff',
          color: '#111',
          cursor: 'pointer',
          borderRadius: '6px',
          border: '1px solid #aaa',
        }}>
          장바구니 담기
        </button>
        <button onClick={handleBuyNow} style={{
          padding: '0.6rem 1.5rem',
          backgroundColor: '#e8fff1',
          border: '1px solid #28a745',
          color: '#111',
          cursor: 'pointer',
        }}>
          결제하기
        </button>
      </div>

      {reviews.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h3>리뷰</h3>
          <ul>
            {reviews.map((r, i) => (
              <li key={i} style={{ marginBottom: '1rem' }}>
                <div>⭐ {r.rating}점</div>
                <p>{r.content}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
