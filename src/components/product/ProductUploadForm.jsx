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
    if (!user || (user.role !== 'owner' && user.role !== 'admin')) {
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
      const newProduct = {
        name: values.name,
        price: parseInt(values.price),
        stock: parseInt(values.stock),
        description: values.description,
        category: values.category,
        images: imagePreviews,
      };

      try {
        await axiosInstance.post('/products', newProduct);
        alert('상품이 서버에 등록되었습니다!');
      } catch (err) {
        console.warn('서버 실패, 로컬 저장 처리:', err);
        const prev = JSON.parse(localStorage.getItem('products') || '[]');
        const withId = { ...newProduct, id: Date.now().toString() };
        localStorage.setItem('products', JSON.stringify([withId, ...prev]));
        alert('상품이 등록되었습니다!');
      }

      resetForm();
      setImagePreviews([]);
      setImageFiles([]);
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    setImageFiles(prev => [...prev, ...files].slice(0, 5));
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index));
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

      <input type="text" name="name" placeholder="상품명" {...formik.getFieldProps('name')} />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <input type="number" name="price" placeholder="가격" {...formik.getFieldProps('price')} />
      {formik.touched.price && formik.errors.price && <div>{formik.errors.price}</div>}

      <input type="number" name="stock" placeholder="재고 수량" {...formik.getFieldProps('stock')} />
      {formik.touched.stock && formik.errors.stock && <div>{formik.errors.stock}</div>}

      <select name="category" {...formik.getFieldProps('category')}>
        <option value="">카테고리 선택</option>
        {categoryOptions.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category && <div>{formik.errors.category}</div>}

      <textarea name="description" placeholder="상품 설명" rows="4" {...formik.getFieldProps('description')} />
      {formik.touched.description && formik.errors.description && <div>{formik.errors.description}</div>}

      <button type="submit">상품 등록</button>
    </form>
  );
}
