import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { useUser } from './UserContext';
import '../styles/CategoryProductPage.css';

export default function CategoryProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('전체');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sortBy, setSortBy] = useState('최신순');
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();
  const { user } = useUser();
  const currentUserEmail = JSON.parse(localStorage.getItem("user"))?.email || "user";

  const categoryList = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스', '스트랩',
    '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  useEffect(() => {
    const cat = searchParams.get('category') || '전체';
    const keyword = searchParams.get('keyword') || '';
    const sort = searchParams.get('sort') || '최신순';
    setCategory(cat);
    setSortBy(sort);

    const fetchData = async () => {
      try {
        const res = await axiosInstance.get('/products');
        const serverProducts = res.data;

        const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]').map((d, index) => ({
          ...d,
          name: d.title || '',
          price: 500 + 500 * (d.wappens?.length || 0),
          images: [d.image || '/assets/default.png'],
          category: '유저디자인',
          description: d.description || '',
          createdAt: d.createdAt || new Date().toISOString(),
          nickname: currentUserEmail, // ✅ 무조건 현재 로그인한 사용자 이메일로
          uniqueKey: `${d.id}-${index}`
        }));

        const all = [...serverProducts, ...shared];
        setAllProducts(all);

        const filtered = all.filter(p => {
          const matchCat = cat === '전체' || p.category === cat;
          const matchKeyword = (p.name?.toLowerCase() || '').includes(keyword.toLowerCase());
          return matchCat && matchKeyword;
        });

        const sorted = [...filtered].sort((a, b) => {
          if (sort === '가격순') return (a.price ?? 0) - (b.price ?? 0);
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        setProducts(sorted);
      } catch (err) {
        console.warn('서버 실패, 로컬로 대체');

        const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]').map((d, index) => ({
          ...d,
          name: d.title || '',
          price: 500 + 500 * (d.wappens?.length || 0),
          images: [d.image || '/assets/default.png'],
          category: '유저디자인',
          description: d.description || '',
          createdAt: d.createdAt || new Date().toISOString(),
          nickname: currentUserEmail, // ✅ fallback에서도 동일
          uniqueKey: `${d.id}-${index}`
        }));

        const local = JSON.parse(localStorage.getItem('products') || '[]').map((p, index) => ({
          ...p,
          images: p.images?.length ? p.images : [p.image || '/assets/default.png'],
          category: p.category || '',
          nickname: currentUserEmail, // ✅ fallback에서도 동일
          uniqueKey: `${p.id}-${index}`
        }));

        const all = [...local, ...shared];
        setAllProducts(all);

        const filtered = all.filter(p => {
          const matchCat = cat === '전체' || p.category === cat;
          const matchKeyword = (p.name?.toLowerCase() || '').includes(keyword.toLowerCase());
          return matchCat && matchKeyword;
        });

        const sorted = [...filtered].sort((a, b) => {
          if (sort === '가격순') return (a.price ?? 0) - (b.price ?? 0);
          return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
        });

        setProducts(sorted);
      }
    };

    fetchData();
  }, [searchParams]);

  const handleCategoryClick = (cat) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), category: cat });
  };

  const handleSortChange = (e) => {
    setSearchParams({ ...Object.fromEntries(searchParams.entries()), sort: e.target.value });
  };

  const handleResetSearch = () => {
    setSearchParams({ category: '전체' });
  };

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 8);
  };

  return (
    <div className="category-page">
      <aside className="category-sidebar">
        {categoryList.map((cat) => (
          <button
            key={cat}
            onClick={() => handleCategoryClick(cat)}
            className={cat === category ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </aside>

      <main className="product-area">
        <div className="product-header">
          <h2>{category} 상품</h2>
          <div className="filter-row">
            <button className="reset-btn" onClick={handleResetSearch}>
              검색 초기화
            </button>
            <select value={sortBy} onChange={handleSortChange}>
              <option value="최신순">최신순</option>
              <option value="가격순">가격순</option>
            </select>
          </div>
        </div>

        {products.length === 0 ? (
          <p>상품이 없습니다.</p>
        ) : (
          <>
            <div className="product-grid">
              {products.slice(0, visibleCount).map((p) => (
                <div
                  key={p.uniqueKey}
                  className="product-card"
                  onClick={() => navigate(`/product/${p.id}?category=${p.category}`)}
                >
                  <img
                    src={p.images?.[0] || '/assets/default.png'}
                    alt={p.name}
                    onError={(e) => (e.target.src = '/assets/default.png')}
                  />
                  <h3>{p.name}</h3>
                  <p style={{ fontSize: '13px', color: '#666' }}>by {p.nickname}</p>
                  <p>₩{(p.price ?? 0).toLocaleString()}</p>
                </div>
              ))}
            </div>
            {visibleCount < products.length && (
              <button className="load-more-btn" onClick={handleLoadMore}>
                더보기 +
              </button>
            )}
          </>
        )}
      </main>
    </div>
  );
}
