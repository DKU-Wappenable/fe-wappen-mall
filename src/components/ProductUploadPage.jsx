import React from "react";
import ProductUploadForm from "./ProductUploadForm";
import "../styles/UploadForm.css";

export default function ProductUploadPage() {
  return (
    <div className="upload-page-container">
      <h2>📦 상품 등록 페이지 (관리자용)</h2>
      <ProductUploadForm />
    </div>
  );
}
