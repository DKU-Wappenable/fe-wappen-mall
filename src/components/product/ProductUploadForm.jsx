import React, { useState } from 'react';
import '../../styles/UploadForm.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
// import axiosInstance from '../../api/axiosInstance'; // ✅ 서버 연동 시 주석 해제

export default function ProductUploadForm() {
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]); // ✅ 서버 전송용 파일

  const categoryOptions = ['전체', '의류', '굿즈', '패션잡화', '쿠션/패브릭', '문구/오피스',
    '폰액세서리', '스티커/지류', '리빙', '스포츠', '키즈', '애견', '역자', '디지털/테크'];

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
        images: imagePreviews, // ✅ 이미지 미리보기 (localStorage 저장용)
      };

      // ✅ localStorage 저장 (테스트용)
      const prev = JSON.parse(localStorage.getItem('products') || '[]');
      const withId = { ...newProduct, id: Date.now().toString() };
      localStorage.setItem('products', JSON.stringify([withId, ...prev]));

      // ✅ 서버 연동 (추후 사용)
      /*
      try {
        const formData = new FormData();
        formData.append('name', values.name);
        formData.append('price', values.price);
        formData.append('stock', values.stock);
        formData.append('description', values.description);
        formData.append('category', values.category);
        imageFiles.forEach((file) => formData.append('images', file));

        await axiosInstance.post('/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        alert('상품이 서버에 등록되었습니다!');
      } catch (error) {
        console.error('서버 업로드 실패:', error);
        alert('서버 업로드 실패');
      }
      */

      resetForm();
      setImagePreviews([]);
      setImageFiles([]);
      alert('상품이 등록되었습니다!');
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
    setImageFiles(prev => [...prev, ...files].slice(0, 5)); // ✅ 서버 전송용 파일 저장
  };

  const removeImage = (index) => {
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
    setImageFiles(prev => prev.filter((_, i) => i !== index)); // ✅ 동기화 삭제
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
        value={formik.values.name}
        onChange={formik.handleChange}
      />
      {formik.touched.name && formik.errors.name && <div>{formik.errors.name}</div>}

      <input
        type="number"
        name="price"
        placeholder="가격"
        value={formik.values.price}
        onChange={formik.handleChange}
      />
      {formik.touched.price && formik.errors.price && <div>{formik.errors.price}</div>}

      <input
        type="number"
        name="stock"
        placeholder="재고 수량"
        value={formik.values.stock}
        onChange={formik.handleChange}
      />
      {formik.touched.stock && formik.errors.stock && <div>{formik.errors.stock}</div>}

      <select
        name="category"
        value={formik.values.category}
        onChange={formik.handleChange}
      >
        <option value="">카테고리 선택</option>
        {categoryOptions.map(cat => (
          <option key={cat} value={cat}>{cat}</option>
        ))}
      </select>
      {formik.touched.category && formik.errors.category && <div>{formik.errors.category}</div>}

      <textarea
        name="description"
        placeholder="상품 설명"
        rows="4"
        value={formik.values.description}
        onChange={formik.handleChange}
      />
      {formik.touched.description && formik.errors.description && <div>{formik.errors.description}</div>}

      <button type="submit">상품 등록</button>
    </form>
  );
}
