import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useUser } from './UserContext';
import '../styles/CategoryProductPage.css';

const IMAGE_BASE_URL = 'http://localhost:8080';

export default function CategoryProductPage() {
  const [searchParams] = useSearchParams();
  const [category, setCategory] = useState('전체');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [liked, setLiked] = useState([]);
  const [sortBy, setSortBy] = useState('최신순');
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();
  const { user } = useUser();

  const categoryList = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스',
    '스트랩', '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  useEffect(() => {
    const catParam = searchParams.get('category');
    if (catParam) {
      setCategory(catParam);
    }
  }, [searchParams]);

  useEffect(() => {
    fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const [productRes, likedRes] = await Promise.all([
        axiosInstance.get('/products'),
        user ? axiosInstance.get('/likes', { params: { userId: user.id } }) : Promise.resolve({ data: [] })
      ]);

      const productList = Array.isArray(productRes.data)
        ? productRes.data
        : productRes.data.content || [];

        //종진 추가 좋아요
        const likedList = Array.isArray(likedRes.data)
        ? likedRes.data
        : likedRes.data.results || [];
        const likedIds = likedList.map(l => l.productId);

      const productsWithLike = productList.map((p, index) => ({
        ...p,
        category: p.category || (p.title ? '유저디자인' : ''),
        name: p.name || p.title || '유저 디자인',
        imageUrls: p.imageUrls?.length ? p.imageUrls : [p.image || '/assets/default.png'],
        likes: p.likeCount || 0,
        nickname: p.category === '유저디자인'
          ? p.createdBy || p.owner || user?.email || 'unknown'
          : '',
        uniqueKey: `${p.id}-${p.createdBy || p.owner || index}`,
        liked: likedIds.includes(p.id),
      }));

      setAllProducts(productsWithLike);
      setLiked(likedIds);

      filterAndSort(productsWithLike, category, sortBy);
    } catch (err) {
      console.error('❌ 상품 조회 실패', err);
    }
  };

  const filterAndSort = (productList, category, sortBy) => {
    let filtered = category === '전체'
      ? productList
      : productList.filter(p => p.category === category);

    if (sortBy === '최신순') {
      filtered = filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === '인기순') {
      filtered = filtered.sort((a, b) => b.likes - a.likes);
    }

    setProducts(filtered);
  };

  useEffect(() => {
    filterAndSort(allProducts, category, sortBy);
  }, [category, sortBy]);

  const handleLike = async (product) => {
    if (!user) {
      alert('로그인 후 이용해주세요');
      navigate('/login');
      return;
    }
  
    try {
      let updatedLikeCount = product.likes;
  
      if (liked.includes(product.id)) {
        await axiosInstance.delete(`/likes/${product.id}`, {
          params: { userId: user.id }
        });
        setLiked(prev => prev.filter(id => id !== product.id));
        updatedLikeCount -= 1;
      } else {
        await axiosInstance.post('/likes', {
          userId: user.id,
          productId: product.id
        });
        setLiked(prev => [...prev, product.id]);
        updatedLikeCount += 1;
      }
  
      //  product 상태 업데이트
      setAllProducts(prev =>
        prev.map(p =>
          p.id === product.id ? { ...p, likes: updatedLikeCount, liked: !p.liked } : p
        )
      );
  
    } catch (err) {
      console.error('❌ 좋아요 처리 실패', err);
    }
  };
  

  const isLiked = (id) => liked.includes(id); // 또는 p.liked를 직접 써도 됨

  const loadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  const handleCategoryClick = (cat) => {
    setCategory(cat);
    navigate(`/products?category=${cat}`);
  };

  return (
    <div className="category-page-wrapper">
      <aside className="sidebar">
        {categoryList.map(cat => (
          <button
            key={cat}
            className={category === cat ? 'active' : ''}
            onClick={() => handleCategoryClick(cat)}
          >
            • {cat}
          </button>
        ))}
      </aside>

      <main className="category-main">
        <div className="category-sort-bar">
          <span>{category} ({products.length})</span>
          <select value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="최신순">최신순</option>
            <option value="인기순">인기순</option>
          </select>
        </div>

        <div className="product-grid">
          {products.slice(0, visibleCount).map(p => (
            <div
              key={p.uniqueKey}
              className="product-card"
              onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}
            >
              <img
                src={p.imageUrls?.[0] ? IMAGE_BASE_URL + p.imageUrls[0] : '/assets/default.png'}
                alt={p.name}
                onError={(e) => (e.target.src = '/assets/default.png')}
              />
              <button
                className="like-button"
                onClick={(e) => { e.stopPropagation(); handleLike(p); }}
              >
                {isLiked(p.id) ? '💖' : '🤍'}
              </button>
              <div className="product-info">
                <h3>{p.name}</h3>
                {p.category === '유저디자인' && p.nickname && (
                  <p className="creator">by {p.nickname}</p>
                )}
                <p className="price">₩{(p.price ?? 0).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < products.length && (
          <div className="load-more">
            <button onClick={loadMore}>더 보기</button>
          </div>
        )}
      </main>
    </div>
  );
}
