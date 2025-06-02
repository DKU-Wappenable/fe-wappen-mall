// ✅ 관리자 상품 목록 + 수정/삭제 → localStorage 모든 저장소 반영 + 작성자 표시

// src/components/admin/AdminProductList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/AdminProductList.css';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');
        if (Array.isArray(res.data)) {
          setProducts(res.data);
        } else {
          throw new Error('서버 응답이 배열이 아닙니다.');
        }
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');
        const local = JSON.parse(localStorage.getItem('products') || '[]');
        const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
        const merged = [...local, ...shared].filter(p => p?.id);
        setProducts(Array.isArray(merged) ? merged : []);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    if (!id) {
      alert('상품 ID가 없습니다. 수정할 수 없습니다.');
      return;
    }
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(prev => prev.filter(p => String(p.id) !== String(id)));
    } catch (err) {
      console.warn('서버 삭제 실패, 로컬 삭제 진행');

      const removeById = (list) => list.filter(p => String(p.id) !== String(id));

      const local = JSON.parse(localStorage.getItem('products') || '[]');
      localStorage.setItem('products', JSON.stringify(removeById(local)));

      const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
      localStorage.setItem('sharedWappens', JSON.stringify(removeById(shared)));

      const liked = JSON.parse(localStorage.getItem('liked') || '[]');
      localStorage.setItem('liked', JSON.stringify(removeById(liked)));

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = cart.filter(item => String(item.product?.id) !== String(id));
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      setProducts([...removeById(local), ...removeById(shared)]);
      alert('로컬에서 상품이 삭제되었습니다.');
    }
  };

  return (
    <div className="admin-product-list">
      <h2>전체 상품 목록</h2>
      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <ul className="product-list">
          {products.map((p) => (
            <li key={p.id} className="product-item">
              <img src={p.images?.[0] || p.image || '/assets/default.png'} alt={p.name} width={80} />
              <div className="info">
                <h4>{p.name}</h4>
                <p>{(p.price || 0).toLocaleString()}원</p>
                <p>{p.category}</p>
                {p.owner && <p style={{ fontSize: '0.85rem', color: '#666' }}>by {p.owner}</p>}
              </div>
              <div className="admin-controls">
                <button onClick={() => handleEdit(p.id)}>수정</button>
                <button onClick={() => handleDelete(p.id)}>삭제</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
