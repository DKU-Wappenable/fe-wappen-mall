import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
// import axiosInstance from '../api/axiosInstance';
import '../styles/CategoryProductPage.css';

export default function CategoryProductPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [category, setCategory] = useState('전체');
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [sortBy, setSortBy] = useState('최신순');
  const [visibleCount, setVisibleCount] = useState(8);
  const navigate = useNavigate();

  const categoryList = [
    '전체', '의류', '굿즈', '패션잡화', '쿠션/패브릭', '문구/오피스',
    '폰액세서리', '스티커/지류', '리빙', '스포츠', '키즈', '애견', '역자', '디지털/테크'
  ];

  useEffect(() => {
    const cat = searchParams.get('category') || '전체';
    const keyword = searchParams.get('keyword') || '';
    const sort = searchParams.get('sort') || '최신순';
    setCategory(cat);
    setSortBy(sort);

    const all = JSON.parse(localStorage.getItem('products') || '[]');
    setAllProducts(all);

    const filtered = all.filter(p => {
      const matchCat = cat === '전체' || p.category === cat;
      const matchKeyword = p.name.toLowerCase().includes(keyword.toLowerCase());
      return matchCat && matchKeyword;
    });

    const sorted = [...filtered].sort((a, b) => {
      return sort === '가격순'
        ? a.price - b.price
        : new Date(b.createdAt) - new Date(a.createdAt);
    });

    setProducts(sorted);
  }, [searchParams]);

  const handleCategoryClick = (cat) => {
    setSearchParams(prev => {
      return {
        ...Object.fromEntries(prev.entries()),
        category: cat,
      };
    });
  };

  const handleSortChange = (e) => {
    setSearchParams(prev => {
      return {
        ...Object.fromEntries(prev.entries()),
        sort: e.target.value,
      };
    });
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
                  key={p.id}
                  className="product-card"
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <img src={p.images?.[0]} alt={p.name} />
                  <h3>{p.name}</h3>
                  <p>₩{p.price.toLocaleString()}</p>
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
