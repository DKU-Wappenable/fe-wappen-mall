import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Home.css";

export default function Home() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("products") || "[]");
    setProducts(stored);
  }, []);

  return (
    <div className="home-container">
      <h2>🔥 인기 와펜 상품</h2>

      {products.length === 0 ? (
        <p>등록된 상품이 없습니다.</p>
      ) : (
        <div className="product-grid">
          {products.map((p) => (
            <div key={p.id} className="product-card" onClick={() => navigate(`/product/${p.id}`)}>
              <img src={p.images[0]} alt={p.name} />
              <h3>{p.name}</h3>
              <p>₩{p.price.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
