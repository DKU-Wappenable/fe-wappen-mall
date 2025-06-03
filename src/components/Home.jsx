// Home.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
// import axiosInstance from '../api/axiosInstance';
import '../styles/Home.css';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [popular, setPopular] = useState([]);
  const [newItems, setNewItems] = useState([]);
  const [liked, setLiked] = useState([]);
  const navigate = useNavigate();
  const { user } = useUser();

  const categories = [
    '전체', '의류', '굿즈', '패션잡화', '쿠션/패브릭', '문구/오피스',
    '폰액세서리', '스티커/지류', '리빙', '스포츠', '키즈', '애견', '역자', '디지털/테크'
  ];

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    const likedStored = JSON.parse(localStorage.getItem('liked') || '[]');
    setProducts(stored);
    setLiked(likedStored);

    const sortedByLike = [...stored].sort((a, b) => (b.likes || 0) - (a.likes || 0));
    const sortedByDate = [...stored].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    setPopular(sortedByLike.slice(0, 4));
    setNewItems(sortedByDate.slice(0, 4));

    // 서버 연동 예시
    /*
    const fetchData = async () => {
      const resAll = await axiosInstance.get('/api/products');
      setProducts(resAll.data.content);
      const resLike = await axiosInstance.get('/api/products?sortBy=likes&size=4');
      const resNew = await axiosInstance.get('/api/products?sortBy=createdAt&size=4');
      setPopular(resLike.data.content);
      setNewItems(resNew.data.content);
      const resLiked = await axiosInstance.get('/api/likes');
      setLiked(resLiked.data);
    };
    fetchData();
    */
  }, []);

  const toggleLike = (product) => {
    const exists = liked.some(p => p.id === product.id);
    const updated = exists ? liked.filter(p => p.id !== product.id) : [product, ...liked];
    setLiked(updated);
    localStorage.setItem('liked', JSON.stringify(updated));
  };

  const isLiked = (id) => liked.some(p => p.id === id);
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
    <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
      <img src={p.images?.[0]} alt={p.name} />
      <button className="like-button" onClick={(e) => { e.stopPropagation(); toggleLike(p); }}>
        {isLiked(p.id) ? '💖' : '🤍'}
      </button>
      <div className="product-info">
        <h3>{p.name}</h3>
        <p className="price">₩{p.price.toLocaleString()}</p>
      </div>
    </div>
  );

  return (
    <div className="home-wrapper">
      <div className="home-container">
        <aside className="sidebar">
          {categories.map(cat => (
            <button key={cat} onClick={() => handleCategoryClick(cat)}>
              <span className="dot" /> {cat}
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
            <div className="product-scroll">
              {popular.map(renderProductCard)}
            </div>
          </section>

          <section>
            <h2 className="section-title">신상품</h2>
            <div className="product-scroll">
              {newItems.map(renderProductCard)}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
