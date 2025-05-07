import React, { useEffect, useState } from 'react';
import '../styles/ProductList.css';

export default function ProductListPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // 로컬스토리지에서 불러오기 (나중에 서버 연동 예정)
    const saved = JSON.parse(localStorage.getItem('productList') || '[]');
    setProducts(saved);
  }, []);

  return (
    <div className="product-list-page">
      <h2>🛍️ 상품 목록</h2>
      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <div className="product-grid">
          {products.map((product, index) => (
            <div className="product-card" key={index}>
              <img
                src={product.images[0].preview || product.images[0]}
                alt="썸네일"
                className="thumbnail"
              />
              <div className="info">
                <h3>{product.name}</h3>
                <p>{product.price.toLocaleString()}원</p>
                <span className="tag">SHOP</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}