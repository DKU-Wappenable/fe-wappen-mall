import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/AdminProductList.css';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('products') || '[]');
    setProducts(stored);
  }, []);

  const handleDelete = (id) => {
    if (!window.confirm('이 상품을 삭제하시겠습니까?')) return;
    const updated = products.filter(p => p.id !== id);
    localStorage.setItem('products', JSON.stringify(updated));
    setProducts(updated);
  };

  return (
    <div className="admin-product-list-container">
      <h2>🗂️ 전체 상품 목록</h2>
      <div className="admin-product-grid">
        {products.map(product => (
          <div key={product.id} className="admin-product-card">
            <img
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              className="thumbnail"
              onError={(e) => (e.target.src = '/placeholder.png')}
            />
            <div className="info">
              <h3>{product.name}</h3>
              <p>{product.price.toLocaleString()}원</p>
            </div>
            <div className="btn-group">
              <Link to={`/admin/edit/${product.id}`} className="edit-btn">수정</Link>
              <button className="delete-btn" onClick={() => handleDelete(product.id)}>삭제</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
