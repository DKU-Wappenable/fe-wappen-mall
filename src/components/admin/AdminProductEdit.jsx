import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import '../../styles/AdminProductEdit.css';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
  });

  useEffect(() => {
    // ✅ 서버 연동 시
    /*
    axios.get(`/products/${id}`)
      .then(res => setForm(res.data))
      .catch(err => console.error('상품 조회 실패', err));
    */

    // ✅ localStorage용
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const found = products.find(p => p.id === id);
    if (found) setForm(found);
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const updated = {
      ...form,
      price: parseInt(form.price),
      stock: parseInt(form.stock),
    };

    // ✅ 서버 연동
    /*
    axios.put(`/products/${id}`, updated)
      .then(() => {
        alert('수정되었습니다!');
        navigate('/admin/products');
      })
      .catch(err => console.error('수정 실패', err));
    */

    // ✅ localStorage 업데이트
    const products = JSON.parse(localStorage.getItem('products') || '[]');
    const newList = products.map(p => (p.id === id ? updated : p));
    localStorage.setItem('products', JSON.stringify(newList));
    alert('수정 완료 (local)');
    navigate('/');
  };

  return (
    <div className="edit-page-container">
      <h2>🛠 상품 수정</h2>
      <form onSubmit={handleSubmit} className="edit-form">
        <div className="form-group">
          <label>상품명</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>가격</label>
          <input
            name="price"
            type="number"
            value={form.price}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>재고</label>
          <input
            name="stock"
            type="number"
            value={form.stock}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>설명</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="상품 설명 입력"
            className="styled-textarea"
            rows="5"
          />
        </div>

        <button type="submit" className="submit-btn">저장하기</button>
      </form>
    </div>
  );
}
