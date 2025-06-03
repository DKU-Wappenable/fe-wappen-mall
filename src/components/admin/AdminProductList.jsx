// src/components/admin/AdminProductList.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/AdminProductList.css';

const IMAGE_BASE_URL = 'http://localhost:8080';

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get('/products');

        // ✅ content 배열 또는 직접 배열인지 확인
        const raw = res.data?.content || res.data;
        const official = Array.isArray(raw) ? raw : [];

        const sanitized = official.map(p => ({
          ...p,
          imageUrls: p.imageUrls?.length ? p.imageUrls : [p.image || '/assets/default.png'],
          uniqueKey: `${p.id}-official`,
        }));

        setProducts(sanitized);
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');

        try {
          const rawLocal = JSON.parse(localStorage.getItem('products') || '[]');
          const local = Array.isArray(rawLocal) ? rawLocal : [];

          const sanitized = local.map(p => ({
            ...p,
            imageUrls: p.imageUrls?.length ? p.imageUrls : [p.image || '/assets/default.png'],
            uniqueKey: `${p.id}-local`,
          }));

          setProducts(sanitized);
        } catch (fallbackErr) {
          console.error('localStorage 대체 실패:', fallbackErr);
          setProducts([]); // 안전하게 빈 배열로 설정
        }
      }
    };

    fetchProducts();
  }, []);

  const handleEdit = (id) => navigate(`/admin/edit/${id}`);

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.warn('서버 삭제 실패 → 로컬 삭제 시도');
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem('products', JSON.stringify(updated));
    }
  };

  const renderProductRow = (p) => (
    <tr key={p.uniqueKey}>
      <td>{p.id}</td>
      <td>
        <img
          src={IMAGE_BASE_URL + (p.imageUrls?.[0] || '/assets/default.png')}
          alt={p.name}
          style={{ width: 50, height: 50, objectFit: 'cover' }}
          onError={(e) => (e.target.src = '/assets/default.png')}
        />
      </td>
      <td>{p.name || '이름없음'}</td>
      <td>{(p.price ?? 0).toLocaleString()}원</td>
      <td>{p.stock ?? 0}</td>
      <td>{p.category || '카테고리없음'}</td>
      <td>
        <button onClick={() => handleEdit(p.id)}>수정</button>
        <button onClick={() => handleDelete(p.id)}>삭제</button>
      </td>
    </tr>
  );

  return (
    <div className="admin-product-list">
      <h2>📦 등록된 상품 목록</h2>
      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>이미지</th>
              <th>상품명</th>
              <th>가격</th>
              <th>재고</th>
              <th>카테고리</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>{products.map(renderProductRow)}</tbody>
        </table>
      )}
    </div>
  );
}
