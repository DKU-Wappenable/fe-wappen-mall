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
    owner: '',
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axiosInstance.get(`/products/${id}`);
        setForm({ ...res.data, images: res.data.images || [], owner: res.data.owner || '' });
      } catch (err) {
        console.warn('서버 실패, 로컬 fallback');
        const products = JSON.parse(localStorage.getItem('products') || '[]');
        const customs = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
        const all = [...products, ...customs];
        const found = all.find(p => String(p.id) === String(id));
        if (found) {
          const images = found.images && found.images.length ? found.images : found.image ? [found.image] : [];
          setForm({ ...found, images, owner: found.owner || '' });
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

      const updateList = (key) => {
        const list = JSON.parse(localStorage.getItem(key) || '[]');
        const updated = list.map(p => String(p.id) === String(id) ? { ...p, ...updatedProduct } : p);
        localStorage.setItem(key, JSON.stringify(updated));
        return updated;
      };

      updateList('products');
      updateList('sharedWappens');

      const updateCart = () => {
        const cart = JSON.parse(localStorage.getItem('cart') || '[]');
        const updatedCart = cart.map(item =>
          String(item.product?.id) === String(id)
            ? { ...item, product: { ...item.product, ...updatedProduct } }
            : item
        );
        localStorage.setItem('cart', JSON.stringify(updatedCart));
      };

      const updateLiked = () => {
        const liked = JSON.parse(localStorage.getItem('liked') || '[]');
        const updatedLiked = liked.map(item =>
          String(item.id) === String(id) ? { ...item, ...updatedProduct } : item
        );
        localStorage.setItem('liked', JSON.stringify(updatedLiked));
      };

      updateCart();
      updateLiked();
      alert('상품 로컬 수정 완료');
      navigate('/admin/products');
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
      <h2> 상품 수정</h2>
      <input name="name" value={form.name} onChange={handleChange} placeholder="상품명" />
      <input name="price" value={form.price} onChange={handleChange} placeholder="가격" type="number" />
      <input name="stock" value={form.stock} onChange={handleChange} placeholder="재고" type="number" />
      <select name="category" value={form.category} onChange={handleChange}>
        <option value="">카테고리 선택</option>
        <option value="의류">의류</option>
        <option value="굿즈">굿즈</option>
        <option value="유저디자인">유저디자인</option>
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
