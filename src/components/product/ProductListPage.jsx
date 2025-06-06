// src/pages/ProductListPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/ProductListPage.css";

export default function ProductListPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const keyword = new URLSearchParams(location.search).get("keyword") || "";

    const fetchProducts = async () => {
      try {
        const res = await axiosInstance.get(`/products?keyword=${keyword}`);
        setProducts(res.data);
      } catch {
        console.warn("서버 실패 → 로컬 대체");
        const local = JSON.parse(localStorage.getItem("products") || "[]");
        const shared = JSON.parse(localStorage.getItem("sharedWappens") || "[]");
        const all = [...local, ...shared];
        const filtered = keyword
          ? all.filter((p) => (p.name || "").includes(keyword))
          : all;
        setProducts(filtered);
      }
    };

    fetchProducts();
  }, [location.search]);

  return (
    <div className="product-list-container">
      <h2>상품 목록</h2>
      <div className="product-grid">
        {products.map((product) => (
          <div
            key={product.id}
            className="product-card"
            onClick={() => navigate(`/product/${product.id}`)}
          >
            <img
              src={product.images?.[0] || "/assets/default.png"}
              alt={product.name}
              onError={(e) => (e.target.src = "/assets/default.png")}
            />
            <h4>{product.name || '유저 디자인'}</h4>

            {/* 유저디자인일 때만 이메일 표시 */}
            {(product.category === '유저디자인') && (
              <p style={{ fontSize: '13px', color: '#666' }}>
                유저디자인: {product.createdBy || product.owner || 'unknown'}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}