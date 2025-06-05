import React from 'react';
import ProductUploadForm from '../product/ProductUploadForm';

export default function AdminProductUpload() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2> 관리자 상품 등록</h2>
      {/* 
         ProductUploadForm 컴포넌트 내부에서 
        서버 연동 (POST /products) + 실패 시 localStorage fallback 구조로 구현되어 있음 
      */}
      <ProductUploadForm />
    </div>
  );
}