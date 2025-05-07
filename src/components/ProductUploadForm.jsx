import React, { useState } from 'react';
import '../styles/UploadForm.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';

export default function ProductUploadForm() {
  const [imagePreviews, setImagePreviews] = useState([]);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      stock: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('상품명을 입력하세요.'),
      price: Yup.number().required('가격을 입력하세요.'),
      stock: Yup.number().required('재고 수량을 입력하세요.'),
    }),
    onSubmit: (values, { resetForm }) => {
      const newProduct = {
        id: Date.now().toString(),
        name: values.name,
        price: parseInt(values.price),
        stock: parseInt(values.stock),
        images: imagePreviews, // ✅ 반드시 포함
      };

      const prev = JSON.parse(localStorage.getItem('products') || '[]');
      localStorage.setItem('products', JSON.stringify([newProduct, ...prev]));

      console.log('폼 제출됨:', newProduct);
      console.log('이미지들:', imagePreviews);

      resetForm();
      setImagePreviews([]);
      alert('상품이 등록되었습니다!');
    },
  });

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews].slice(0, 5));
  };

  const removeImage = (index) => {
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

      <button type="submit">상품 등록</button>
    </form>
  );
}
