// src/components/admin/AdminProductEdit.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/UploadForm.css';

export default function AdminProductEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    price: '',
    stock: '',
    description: '',
    category: '',
    images: []
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setForm({ ...res.data, images: res.data.images || [] });
      } catch (err) {
        console.warn('서버 실패, 로컬 fallback');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const found = products.find(p => String(p.id) === String(id));
        if (found) setForm({ ...found, images: found.images || [] });
        else setError('해당 상품을 찾을 수 없습니다.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setForm(prev => ({ ...prev, images: previews.slice(0, 5) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      ...form,
      price: parseInt(form.price),
      stock: parseInt(form.stock)
    };

    try {
      await axiosInstance.put(`/products/${id}`, updatedProduct);
      alert('상품 수정 완료');
      navigate('/admin/products');
    } catch (err) {
      console.warn('서버 실패, 로컬 저장');
      const products = JSON.parse(localStorage.getItem('products') || '[]');
      const updated = products.map(p =>
        String(p.id) === String(id) ? { ...updatedProduct, id } : p
      );
      localStorage.setItem('products', JSON.stringify(updated));
      alert('상품 로컬 수정 완료');
      navigate('/admin/products');
    }
  };

  if (error) return <div style={{ padding: '2rem' }}>{error}</div>;

  return (
    <form className="upload-container" onSubmit={handleSubmit}>
      <h2> 상품 수정</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="상품명" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="가격" type="number" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="재고" type="number" />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">카테고리 선택</option>
        <option value="의류">의류</option>
        <option value="굿즈">굿즈</option>
        <option value="유저디자인">유저디자인</option>
        {/* 필요에 따라 추가 */}
      </select>
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="상품 설명" />

      <div>
        <label>이미지 변경 (최대 5장)</label>
        <input type="file" multiple accept="image/*" onChange={handleImageChange} />
        <div className="preview-container">
          {form.images.map((img, i) => (
            <img key={i} src={img} alt={`preview-${i}`} style={{ width: 80, margin: 5 }} />
          ))}
        </div>
      </div>

      <button type="submit">수정 완료</button>
    </form>
  );
}
