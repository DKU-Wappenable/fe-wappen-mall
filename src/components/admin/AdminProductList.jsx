//  AdminProductList.jsx - 서버 연동 + 실패 시 localStorage fallback 처리
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
        setProducts(res.data);
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');
        const local = JSON.parse(localStorage.getItem('products') || '[]');
        setProducts(local);
      }
    };
    fetchProducts();
  }, []);

  const handleEdit = (id) => {
    navigate(`/admin/edit/${id}`);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.warn('서버 삭제 실패 → 로컬 삭제 시도');
      const local = products.filter(p => p.id !== id);
      setProducts(local);
      localStorage.setItem('products', JSON.stringify(local));
    }
  };

  return (
    <div className="admin-product-list">
      <h2> 등록된 상품 목록</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>상품명</th>
            <th>가격</th>
            <th>재고</th>
            <th>카테고리</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id}>
              <td>{p.id}</td>
              <td>{p.name}</td>
              <td>{p.price.toLocaleString()}원</td>
              <td>{p.stock}</td>
              <td>{p.category}</td>
              <td>
                <button onClick={() => handleEdit(p.id)}>수정</button>
                <button onClick={() => handleDelete(p.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}