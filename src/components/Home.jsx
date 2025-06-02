// src/components/Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import axiosInstance from '../api/axiosInstance';
import '../styles/Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const categories = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스', '스트랩',
    '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  const loadProducts = async () => {
    try {
      const res = await axiosInstance.get('/products');
      const official = res.data;
      const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]').map(d => ({
        ...d,
        name: d.title || '유저 디자인',
        images: [d.image],
        category: '유저디자인',
        createdAt: d.createdAt || new Date().toISOString(),
        __source: 'shared',
        uniqueKey: `${d.id}-${d.author}`
      }));
      const merged = [...official, ...shared];
      const sanitized = merged.map(p => ({
        ...p,
        images: p.images?.length ? p.images : [p.image || '/assets/default.png'],
        uniqueKey: p.uniqueKey || `${p.id}-${p.__source || 'official'}`
      }));
      setProducts(sanitized);
      setPopular([...sanitized].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10));
      setNewItems([...sanitized].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10));
    } catch (err) {
      console.warn('서버 실패, 로컬에서 대체');
      const official = JSON.parse(localStorage.getItem('products') || '[]');
      const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]').map(d => ({
        ...d,
        name: d.title || '유저 디자인',
        images: [d.image],
        category: '유저디자인',
        createdAt: d.createdAt || new Date().toISOString(),
        __source: 'shared',
        uniqueKey: `${d.id}-${d.author}`
      }));
      const merged = [...official, ...shared];
      const sanitized = merged.map(p => ({
        ...p,
        images: p.images?.length ? p.images : [p.image || '/assets/default.png'],
        uniqueKey: p.uniqueKey || `${p.id}-${p.__source || 'official'}`
      }));
      setProducts(sanitized);
      setPopular([...sanitized].sort((a, b) => (b.likes || 0) - (a.likes || 0)).slice(0, 10));
      setNewItems([...sanitized].sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0)).slice(0, 10));
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

  const isLiked = (uniqueKey) => liked.some(p => p.uniqueKey === uniqueKey);
  const handleCategoryClick = (cat) => navigate(`/products?category=${cat}`);
  const handleStartClick = () => {
    if (!user) {
      alert('로그인 후 이용 가능합니다.');
      navigate('/login');
    } else {
      navigate('/wappen-customize');
    }
  };

  const renderProductCard = (p) => (
    <div key={p.uniqueKey} className="product-card" onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}>
      <img src={p.images?.[0] || '/assets/default.png'} alt={p.name} onError={(e) => (e.target.src = '/assets/default.png')} />
      <button className="like-button" onClick={(e) => { e.stopPropagation(); toggleLike(p); }}>
        {isLiked(p.uniqueKey) ? '💖' : '🤍'}
      </button>
      <div className="product-info">
        <h3>{(p.name || '').replace(/\s+/g, ' ')}</h3>
        <p className="creator">by {p.nickname || user?.email || 'user'}</p>
        <p className="price">₩{(p.price ?? 0).toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <aside className="sidebar">
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}>
              <span>• {cat}</span>
            </button>
          ))}
        </aside>

        <main className="home-main">
          <div className="cta-banner">
            <h3>나만의 와펜 만들기</h3>
            <p>쉽고 빠르게 원하는 와펜을 커스터마이징하세요!</p>
            <button onClick={handleStartClick}>지금 시작하기 →</button>
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
