import React from 'react';
import ProductUploadForm from '../product/ProductUploadForm';

export default function AdminProductUpload() {
  return (
    <div style={{ padding: '2rem' }}>
      <h2>📦 관리자 상품 등록</h2>
      {/* ✅ 추후 연동용 주석 */}
      {/* 백엔드 API 연동 시, ProductUploadForm에서 form 제출 → POST /api/products */}
      <ProductUploadForm />
    </div>
  );
}
