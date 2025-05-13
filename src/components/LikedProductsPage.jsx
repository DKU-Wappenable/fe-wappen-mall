import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
// import axios from '../../api/axiosInstance'; // ✅ 서버 연동 시 사용

export default function LikedProductsPage() {
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // ✅ 서버 연동 시
    // axios.get('/api/likes').then(res => setLiked(res.data));

    // 🔁 localStorage 테스트용
    const stored = JSON.parse(localStorage.getItem('liked') || '[]');
    setLiked(stored);
  }, []);

  const handleToggleLike = async (product) => {
    const current = JSON.parse(localStorage.getItem('liked') || '[]');
    const exists = current.some(p => p.id === product.id);
    let updated;

    if (exists) {
      // ✅ 서버 연동 시
      // await axios.delete(`/api/likes/${product.id}`);
      updated = current.filter(p => p.id !== product.id);
    } else {
      // ✅ 서버 연동 시
      // await axios.post('/api/likes', product);
      updated = [product, ...current];
    }

    localStorage.setItem('liked', JSON.stringify(updated));
    setLiked(updated);
  };

  if (liked.length === 0) {
    return <div style={{ padding: '2rem' }}>찜한 상품이 없습니다.</div>;
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>찜한 상품</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
        {liked.map(product => (
          <div key={product.id} style={{ border: '1px solid #ccc', padding: '1rem', position: 'relative' }}>
            <img
              src={product.images?.[0]?.preview || product.images?.[0] || '/placeholder.png'}
              alt={product.name}
              style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }}
              onClick={() => navigate(`/product/${product.id}`)}
            />
            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
              <button
                onClick={() => handleToggleLike(product)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  fontSize: '1.5rem',
                  cursor: 'pointer'
                }}
              >
                {liked.some(p => p.id === product.id) ? '💖' : '🤍'}
              </button>
            </div>
            <h4 style={{ marginTop: '1rem' }}>{product.name}</h4>
            <p>{product.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>
    </div>
  );
}
