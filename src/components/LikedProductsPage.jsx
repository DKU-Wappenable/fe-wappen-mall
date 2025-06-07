import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useUser } from './UserContext';

const IMAGE_BASE_URL = 'http://localhost:8080';

export default function LikedProductsPage() {
  const [likedProducts, setLikedProducts] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      fetchLikedProducts();
    }
  }, [user]);

  const fetchLikedProducts = async () => {
    try {
      const likedRes = await axiosInstance.get('/likes', {
        params: { userId: user.id }
      });

      const likes = Array.isArray(likedRes.data) ? likedRes.data : [];

      const transformed = likes.map(like => ({
        id: like.productId,
        name: like.productName,
        imageUrls: like.imageUrls?.length ? like.imageUrls : ['/assets/default.png'],
        category: like.category || '기타',           // ✅ category 반영
        nickname: '',
        uniqueKey: `${like.productId}`,
        price: like.price || 0,                      // ✅ price 반영
        likes: 0,
        liked: true
      }));
      

      setLikedProducts(transformed);
    } catch (err) {
      console.error('❌ 좋아요한 상품 불러오기 실패', err);
    }
  };

  const toggleLike = async (product) => {
    try {
      await axiosInstance.delete(`/likes/${product.id}`, {
        params: { userId: user.id }
      });

      setLikedProducts(prev => prev.filter(p => p.id !== product.id));
    } catch (err) {
      console.error('❌ 좋아요 취소 실패', err);
    }
  };

  const renderProductCard = (p) => (
    <div key={p.uniqueKey} className="product-card" onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}>
      <img
        src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : '/assets/default.png'}
        alt={p.name}
        onError={(e) => (e.target.src = '/assets/default.png')}
      />
      <button
        className="like-button"
        onClick={(e) => {
          e.stopPropagation();
          toggleLike(p);
        }}
      >
        💖
      </button>
      <div className="product-info">
        <h3>{p.name}</h3>
        <p className="price">₩{(p.price ?? 0).toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="liked-page-container">
      <h2>내가 좋아요한 상품</h2>
      {likedProducts.length === 0 ? (
        <p>좋아요한 상품이 없습니다.</p>
      ) : (
        <div className="product-grid">
          {likedProducts.map(p => renderProductCard(p))}
        </div>
      )}
    </div>
  );
}
