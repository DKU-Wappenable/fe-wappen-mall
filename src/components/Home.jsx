import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import axiosInstance from '../api/axiosInstance';
import '../styles/Home.css';

const IMAGE_BASE_URL = 'http://localhost:8080'; // 프론트 기준이 아닌 백엔드 기준 URL

export default function Home() {
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserEmail = JSON.parse(localStorage.getItem("user"))?.email || "user";

  const categories = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스', '스트랩',
    '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  const loadProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      const official = res.data.content;
      const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]').map(d => ({
        ...d,
        name: d.title || '유저 디자인',
        imageUrls: [d.image],
        category: '유저디자인',
        createdAt: d.createdAt || new Date().toISOString(),
        __source: 'shared',
        uniqueKey: `${d.id}-${d.author}`
      }));
      const merged = [...official, ...shared];
      const sanitized = merged.map(p => ({
        ...p,
        imageUrls: p.imageUrls?.length ? p.imageUrls : [p.image || '/assets/default.png'],
        uniqueKey: p.uniqueKey || `${p.id}-${p.__source || 'official'}`
      }));

      setProducts(merged);
      setPopular([...merged].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10));
      setNewItems([...merged].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));
    } catch {
      console.warn('서버 실패, 로컬에서 대체');
      const local = JSON.parse(localStorage.getItem('products') || '[]');
      const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');

      const merged = [...local, ...shared].map((p, i) => ({
        ...p,
        images: p.images?.length ? p.images : [p.image || '/assets/default.png'],
        category: p.category || (p.title ? '유저디자인' : ''),
        name: p.name || p.title || '유저 디자인',
        nickname: currentUserEmail,
        createdAt: p.createdAt || new Date().toISOString(),
        uniqueKey: `${p.id}-${p.owner || p.author || i}`
      }));

      setProducts(merged);
      setPopular([...merged].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10));
      setNewItems([...merged].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10));
    }
  };

  useEffect(() => {
    loadProducts();
    setLiked(JSON.parse(localStorage.getItem('liked') || '[]'));
  }, []);

  const toggleLike = (product) => {
    const current = JSON.parse(localStorage.getItem('liked') || '[]');
    const exists = current.some(p => p.uniqueKey === product.uniqueKey);
    const updated = exists
      ? current.filter(p => p.uniqueKey !== product.uniqueKey)
      : [{ ...product }, ...current];
    localStorage.setItem('liked', JSON.stringify(updated));
    setLiked(updated);
  };

  const isLiked = (key) => liked.some(p => p.uniqueKey === key);

  const handleCategoryClick = (cat) => navigate(`/products?category=${cat}`);
  const handleStartClick = () => {
    if (!user) {
      alert('로그인 후 이용해주세요');
      navigate('/login');
    } else {
      navigate('/wappen-customize');
    }
  };

  const renderProductCard = (p) => (
    <div key={p.uniqueKey} className="product-card" onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}>
      <img  src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : '/assets/default.png'} 
      alt={p.name} onError={(e) => (e.target.src = '/assets/default.png')} />
      <button className="like-button" onClick={(e) => { e.stopPropagation(); toggleLike(p); }}>
        {isLiked(p.uniqueKey) ? '💖' : '🤍'}
      </button>
      <div className="product-info">
        <h3>{p.name}</h3>
        <p className="creator">by {p.nickname}</p>
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
              {popular.map(renderProductCard)}
            </div>
          </section>

          <section>
            <h2 className="section-title">신상품</h2>
            <div className="product-scroll with-scroll">
              {newItems.map(renderProductCard)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
