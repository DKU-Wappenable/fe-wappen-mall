import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance'; // 📝 서버 연동 시 사용

export default function LikedProductsPage() {
  const [liked, setLiked] = useState([]);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('liked') || '[]');
    const sanitized = stored.map(p => ({
      ...p,
      images: p.images?.length ? p.images : [p.image || '/assets/default.png'],
      category: p.category || '유저디자인'
    }));
    setLiked(sanitized);

    const qtyMap = {};
    sanitized.forEach(p => qtyMap[p.id] = 1);
    setQuantities(qtyMap);
  }, []);

  const handleToggleLike = (product) => {
    const current = JSON.parse(localStorage.getItem('liked') || '[]');
    const exists = current.some(p => p.id === product.id);
    const updated = exists
      ? current.filter(p => p.id !== product.id)
      : [product, ...current];

    localStorage.setItem('liked', JSON.stringify(updated));
    setLiked(updated);

    // 📝 서버 연동 예시:
    // exists
    //   ? axiosInstance.delete(`/likes/${product.id}`)
    //   : axiosInstance.post('/likes', product);
  };

  const handleQuantity = (id, delta) => {
    setQuantities(prev => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta)
    }));
  };

  const handleAddToCart = (product) => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const existing = cart.find(item => item.product.id === product.id);
    const quantity = quantities[product.id] || 1;
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

    // 📝 서버 연동 예시:
    // axiosInstance.post('/cart', { productId: product.id, quantity });
  };

  const handleBuy = (product) => {
    const quantity = quantities[product.id] || 1;
    navigate('/order/form', {
      state: {
        product,
        quantity
      }
    });
  };

  if (liked.length === 0) {
    return <div style={{ padding: '2rem' }}>찜한 상품이 없습니다.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>찜한 상품</h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: '1rem'
      }}>
        {liked.map(product => (
          <div key={product.id} style={{
            border: '1px solid #ccc',
            padding: '1rem',
            borderRadius: '10px',
            background: '#fff',
            position: 'relative'
          }}>
            <img
              src={product.images?.[0] || '/assets/default.png'}
              alt={product.name || product.title}
              onError={(e) => (e.target.src = '/assets/default.png')}
              style={{
                width: '100%',
                height: '180px',
                objectFit: 'contain',
                cursor: 'pointer'
              }}
              onClick={() => navigate(`/product/${product.id}?category=${product.category}`)}
            />
            <button onClick={() => handleToggleLike(product)} style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer'
            }}>
              {liked.some(p => p.id === product.id) ? '💖' : '🤍'}
            </button>

            <h4 style={{ marginTop: '1rem' }}>{product.name || product.title}</h4>
            {product.nickname && (
              <p style={{ fontSize: '13px', color: '#666' }}>by {product.nickname}</p>
            )}
            <p style={{ fontWeight: 'bold' }}>{(product.price ?? 0).toLocaleString()}원</p>

            {/* 수량 조절 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '0.5rem'
            }}>
              <button onClick={() => handleQuantity(product.id, -1)}>➖</button>
              <span>{quantities[product.id] || 1}</span>
              <button onClick={() => handleQuantity(product.id, 1)}>➕</button>
            </div>

            {/* 장바구니 / 결제 버튼 */}
            <button onClick={() => handleAddToCart(product)} style={{
              marginTop: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #aaa',
              backgroundColor: '#fff',
              color: '#111',
              cursor: 'pointer',
              width: '100%'
            }}>
              🛒 장바구니 담기
            </button>

            <button onClick={() => handleBuy(product)} style={{
              marginTop: '8px',
              padding: '8px 12px',
              fontSize: '14px',
              borderRadius: '6px',
              border: '1px solid #28a745',
              backgroundColor: '#e8fff1',
              color: '#111',
              cursor: 'pointer',
              width: '100%'
            }}>
              💳 결제하기
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
