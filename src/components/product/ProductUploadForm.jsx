// ProductUploadForm.jsx - 서버 연동 + 실패 시 localStorage fallback

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/UploadForm.css';

export default function ProductUploadForm() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || (user.role !== 'SHOP_OWNER' && user.role !== 'ADMIN')) {
      alert('상품 등록 권한이 없습니다.');
      navigate('/');
    }
  }, [user]);

  const categoryOptions = [
    '전체', '의류', '굿즈', '패션', '빈티지', '문구/오피스',
    '스트랩', '폰', '리빙', '스포츠', '키즈', '애견', '와펜세트', '유저디자인'
  ];

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      stock: '',
      description: '',
      category: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('상품명을 입력하세요.'),
      price: Yup.number().required('가격을 입력하세요.'),
      stock: Yup.number().required('재고 수량을 입력하세요.'),
      description: Yup.string().required('설명을 입력하세요.'),
      category: Yup.string().required('카테고리를 선택하세요.'),
    }),
    onSubmit: async (values, { resetForm }) => {
      const formData = new FormData();
      formData.append('name', values.name);
      formData.append('price', values.price);
      formData.append('stock', values.stock);
      imageFiles.forEach((file) => formData.append('images', file));

      try {
        await axiosInstance.post('/api/products', formData);
        alert('상품이 서버에 등록되었습니다!');
        navigate('/');
      } catch (err) {
        console.warn('서버 실패, 로컬 저장 처리:', err);
        const fallbackProduct = {
          id: Date.now(),
          ...values,
          images: imagePreviews,
        };
        const prev = JSON.parse(localStorage.getItem('products') || '[]');
        localStorage.setItem('products', JSON.stringify([fallbackProduct, ...prev]));
        alert('서버 오류로 로컬에 임시 저장되었습니다.');
        navigate('/');
      }

      resetForm();
      setImagePreviews([]);
      setImageFiles([]);
    },
  });

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  return (
    <form onSubmit={formik.handleSubmit} className="upload-form">
      <h2>상품 등록</h2>

      <input name="name" placeholder="상품명" {...formik.getFieldProps('name')} />
      <input name="price" placeholder="가격" type="number" {...formik.getFieldProps('price')} />
      <input name="stock" placeholder="재고 수량" type="number" {...formik.getFieldProps('stock')} />
      <textarea name="description" placeholder="설명" {...formik.getFieldProps('description')} />
      <select name="category" {...formik.getFieldProps('category')}>
        <option value="">카테고리 선택</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>

      <input type="file" accept="image/*" multiple onChange={handleImageChange} />
      <div className="preview-area">
        {imagePreviews.map((src, idx) => (
          <img key={idx} src={src} alt={`preview-${idx}`} className="preview-image" />
        ))}
      </div>

      <button type="submit">상품 등록</button>
    </form>
  );
}
