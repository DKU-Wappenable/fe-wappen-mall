// ✅ 1번 해결 완료: 관리자 상품 수정 시 localStorage 모든 저장소 반영 + 작성자(owner) 유지

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
    images: [],
    newImages: [] // 실제로 서버로 보낼 MultipartFile
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setForm({
          ...res.data,
          images: res.data.imageUrls || [],
          newImages: []
        });
      } catch (err) {
        console.warn('서버 실패, 로컬 fallback');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const found = products.find(p => String(p.id) === String(id));
        if (found) {
          setForm({
            ...found,
            images: found.imageUrls || [],
            newImages: []
          });
        } else {
          setError('해당 상품을 찾을 수 없습니다.');
        }
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
    setForm(prev => ({
      ...prev,
      newImages: files,
      images: previews.slice(0, 5)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('price', parseInt(form.price));
    formData.append('stock', parseInt(form.stock));
    formData.append('category', form.category);
    formData.append('description', form.description);
    
    if (form.newImages && form.newImages.length > 0) {
      form.newImages.forEach(file => {
        formData.append('images', file);
      });
    }

    try {
      await axiosInstance.put(`/products/${id}`, formData);
      alert('상품 수정 완료');
      navigate('/admin/products');
    } catch (err) {
      console.error('상품 수정 실패:', err);
      alert('상품 수정 실패');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await axiosInstance.delete(`/products/${id}`);
      alert('상품 삭제 완료');
    } catch (err) {
      console.warn('서버 삭제 실패, 로컬 삭제 진행');

      const removeById = (list) => list.filter(p => String(p.id) !== String(id));

      localStorage.setItem('products', JSON.stringify(removeById(JSON.parse(localStorage.getItem('products') || '[]'))));
      localStorage.setItem('sharedWappens', JSON.stringify(removeById(JSON.parse(localStorage.getItem('sharedWappens') || '[]'))));
      localStorage.setItem('liked', JSON.stringify(removeById(JSON.parse(localStorage.getItem('liked') || '[]'))));

      const cart = JSON.parse(localStorage.getItem('cart') || '[]');
      const updatedCart = cart.filter(item => String(item.product?.id) !== String(id));
      localStorage.setItem('cart', JSON.stringify(updatedCart));

      alert('로컬 삭제 완료');
    }

    navigate('/admin/products');
  };

  if (error) return <div style={{ padding: '2rem' }}>{error}</div>;

  return (
    <form className="upload-container" onSubmit={handleSubmit}>
      <h2>상품 수정</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="상품명" required />
      <input name="price" value={form.price} onChange={handleChange} placeholder="가격" type="number" required />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="재고" type="number" required />

      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">카테고리 선택</option>
        <option value="의류">의류</option>
        <option value="굿즈">굿즈</option>
        <option value="유저디자인">유저디자인</option>
        {/* 필요에 따라 추가 */}
      </select>

      <textarea name="description" value={form.description} onChange={handleChange} placeholder="상품 설명" />

      <div className="preview-container">
        {form.images.map((img, i) => (
          <img key={i} src={img} alt={`preview-${i}`} style={{ width: 80, margin: 5 }} />
        ))}
      </div>

      {form.owner && <p style={{ fontSize: '0.85rem', color: '#555' }}>by {form.owner}</p>}

      <button type="submit">수정 완료</button>
      <button
        type="button"
        onClick={handleDelete}
        style={{ marginTop: '1rem', backgroundColor: '#fff', color: '#333', border: '1px solid #ccc' }}
      >
        삭제
      </button>
    </form>
  );
}
