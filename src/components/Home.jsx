import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import axiosInstance from '../api/axiosInstance';
import '../styles/Home.css';

const IMAGE_BASE_URL = 'http://localhost:8080';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const categories = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스', '스트랩',
    '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  const loadProducts = async () => {
    try {
      const [productRes, likedRes] = await Promise.all([
        axiosInstance.get('/products/products-with-likes'),
        user ? axiosInstance.get('/likes', { params: { userId: user.id } }) : Promise.resolve({ data: [] })
      ]);

      const productList = productRes.data || [];
      const likedList = Array.isArray(likedRes.data) ? likedRes.data : [];

      const likedIds = likedList.map(l => l.productId);

      const processed = productList.map(p => ({
        ...p,
        imageUrls: p.imageUrls?.length ? p.imageUrls : ['/assets/default.png'],
        category: p.category || '기타',
        name: p.name || '이름 없음',
        createdAt: p.createdAt || new Date().toISOString(),
        nickname: p.category === '유저디자인' ? (p.createdBy || p.owner || user?.email || '') : '',
        uniqueKey: `${p.id}-${p.nickname || ''}`,
        likes: p.likeCount || 0,
        liked: likedIds.includes(p.id),
      }));

      setProducts(processed);
      setLiked(likedIds);

      const sortedPopular = [...processed]
        .filter(p => p.likes > 0)
        .sort((a, b) => b.likes - a.likes)
        .slice(0, 10);

      setPopular(sortedPopular);
    } catch (err) {
      console.error('❌ 상품 로딩 실패', err);
    }
  };

  useEffect(() => {
    if (user) {
    loadProducts();
  }
  }, [user]);

  const handleLikeToggle = async (productId) => {
    try {
      if (!user) {
        alert('로그인 후 이용해주세요.');
        return;
      }
  
      const isLiked = liked.includes(productId);
  
      if (isLiked) {
        await axiosInstance.delete(`/likes/${productId}`, { params: { userId: user.id } });
      } else {
        await axiosInstance.post('/likes', { userId: user.id, productId });
      }
  
      // 좋아요 상태 반영 위해 다시 전체 로드
      await loadProducts();
    } catch (error) {
      console.error('❌ 좋아요 처리 실패', error);
    }
  };
  
  const handleStartClick = () => {
    if (!user) {
      alert('로그인 후 이용해주세요');
      navigate('/login');
    } else {
      navigate('/wappen-customize');
    }
  };

  const handleCategoryClick = (cat) => navigate(`/products?category=${cat}`);

  const renderProductCard = (p) => (
    <div key={p.uniqueKey} className="product-card" onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}>
      <img
        src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : '/assets/default.png'}
        alt={p.name}
        onError={(e) => (e.target.src = '/assets/default.png')}
      />
      <div className="product-info">
        <h3>{p.name}</h3>
        {p.category === '유저디자인' && p.nickname && <p className="creator">by {p.nickname}</p>}
        <p className="price">₩{(p.price ?? 0).toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <aside className="sidebar">
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}>• {cat}</button>
          ))}
        </aside>

        <main className="home-main">
          <div className="cta-banner-img full" onClick={handleStartClick}>
            <img src="/assets/custom-banner-dog.png" alt="커스터마이징 배너" />
          </div>

          <section>
            <h2 className="section-title">인기 와펜 상품</h2>
            <div className="product-scroll with-scroll">
              {popular.map(p => renderProductCard(p))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
