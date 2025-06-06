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
      formData.append('description', values.description);
      formData.append('category', values.category);
      imageFiles.forEach(file => formData.append('images', file)); // ✅ 파일 추가

      try {
        const res = await axiosInstance.post('/products', formData);
        console.log("✅ 서버 응답:", res);
        alert('상품이 서버에 등록되었습니다!'); 
        resetForm();
        setImagePreviews([]);
        setImageFiles([]);
        navigate('/admin/products');
      } catch (err) {
        console.warn('서버 실패, 로컬 저장 처리:', err);

        const localProduct = {
          id: Date.now(),
          ...values,
          images: imagePreviews,
        };
        const prev = JSON.parse(localStorage.getItem('products') || '[]');
        localStorage.setItem('products', JSON.stringify([localProduct, ...prev]));
        alert('상품이 로컬에 등록되었습니다!');
        resetForm();
        setImagePreviews([]);
        setImageFiles([]);
        navigate('/admin/products');
      }
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map(file => URL.createObjectURL(file));
    setImageFiles(prev => [...prev, ...files].slice(0, 5));
    setImagePreviews(prev => [...prev, ...previews].slice(0, 5));
  };

  const removeImage = (index) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <form className="upload-container" onSubmit={formik.handleSubmit}>
      <div className="dropzone" onClick={() => document.getElementById('imageInput').click()}>
        이미지를 드래그하거나 클릭하여 업로드 (최대 5장)
        <input
          id="imageInput"
          type="file"
          accept="image/*"
          multiple
          style={{ display: 'none' }}
          onChange={handleImageUpload}
        />
      </div>

      <div className="preview-container">
        {imagePreviews.map((img, index) => (
          <div key={index} className="image-preview">
            <img src={img} alt={`preview-${index}`} />
            <button type="button" onClick={() => removeImage(index)}>삭제</button>
          </div>
        ))}
      </div>

      <input
        type="text"
        name="name"
        placeholder="상품명"
        {...formik.getFieldProps('name')}
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <input
        type="number"
        name="price"
        placeholder="가격"
        {...formik.getFieldProps('price')}
      />
      {formik.touched.price && formik.errors.price && <div>{formik.errors.price}</div>}

      <input
        type="number"
        name="stock"
        placeholder="재고 수량"
        {...formik.getFieldProps('stock')}
      />
      {formik.touched.stock && formik.errors.stock && <div>{formik.errors.stock}</div>}

      <select name="category" {...formik.getFieldProps('category')}>
        <option value="">카테고리 선택</option>
        {categoryOptions.map((cat) => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category && <div>{formik.errors.category}</div>}

      <textarea
        name="description"
        placeholder="상품 설명"
        rows="4"
        {...formik.getFieldProps('description')}
      />
      {formik.touched.description && formik.errors.description && <div>{formik.errors.description}</div>}

      <button type="submit">상품 등록</button>
    </form>
  );
}
