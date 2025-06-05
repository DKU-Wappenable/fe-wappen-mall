// src/components/MyWappens.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/MyWappens.css';

const IMAGE_BASE_URL = "http://localhost:8080"; // 실제 배포 시 서버 주소로 변경

export default function MyWappens() {
  const { user } = useUser();
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();
 
// ✅ 강제 디버깅
const localUser = JSON.parse(localStorage.getItem("user"));
console.log("🔍 useUser():", user);
console.log("🔍 localStorage user:", localUser);

// ✅ user.id 보장
const userId = user?.id || localUser?.id;
  
  //const userId = user?.id || JSON.parse(localStorage.getItem("user"))?.id;

  useEffect(() => {
    if (!user) return;
  
    const fetchWappens = async () => {
      try {
        const res = await axiosInstance.get('/custom-images');
        console.log("🔥 전체 디자인:", res.data);
        const userDesigns = res.data.filter(d => d.userId === userId);
        console.log("🎨 내 디자인:", userDesigns);
        setDesigns(userDesigns);
      } catch (err) {
        console.warn('서버 실패, 로컬 저장에서 불러옵니다.');
        const local = JSON.parse(localStorage.getItem(`savedWappens_${user.id}`) || '[]');
        setDesigns(local);
      }
    };
  
    fetchWappens();
  }, [userId]);
  
  const handleDelete = async (id) => {
    const confirm = window.confirm('이 디자인을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/wappens/${id}`);
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.warn('서버 실패, 로컬 삭제 진행');
      const local = JSON.parse(localStorage.getItem(`savedWappens_${userId}`) || '[]');
      const updated = local.filter(d => d.id !== id);
      localStorage.setItem(`savedWappens_${userId}`, JSON.stringify(updated));
      setDesigns(updated);
    }

    const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
    localStorage.setItem('sharedWappens', JSON.stringify(shared.filter(d => d.id !== id)));

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    localStorage.setItem('cart', JSON.stringify(cart.filter(item => item.product.id !== id)));

    const liked = JSON.parse(localStorage.getItem('liked') || '[]');
    localStorage.setItem('liked', JSON.stringify(liked.filter(item => item.id !== id)));
  };

  const handleShare = async (design) => {
    try {
      await axiosInstance.post(`/products/publish-custom/${design.id}`);
      alert('디자인이 상품으로 등록되었습니다!');
      navigate('/'); // 홈으로 이동 (또는 상품 페이지로 이동 가능)
    } catch (err) {
      console.error('상품화 실패:', err);
      alert('상품 등록에 실패했습니다.');
    }
  };
  

  return (
    <div className="my-wappens-wrapper">
      <h2 className="my-wappens-title">나의 와펜 디자인</h2>
      {designs.length === 0 ? (
        <p className="no-wappens">저장된 디자인이 없습니다.</p>
      ) : (
        <div className="my-wappens-grid">
          {designs.map((design) => (
            <div key={design.id} className="my-wappen-card">
              {design.customizedImageUrl ? (
                <div className="my-wappen-preview">
                  <img
                    src={`${IMAGE_BASE_URL}${design.customizedImageUrl}`}
                    alt="saved design"
                    className="my-wappen-img"
                    onError={(e) => (e.target.src = '/assets/default.png')}
                  />
                </div>
              ) : (
                <div className="my-wappen-preview fallback-wappen">
                  <img src={`/assets/${design.strap}.png`} className="fallback-strap" />
                  {design.wappens.map((w, i) => (
                    <img
                      key={i}
                      src={`/assets/${w.type}.png`}
                      className="fallback-wappen-img"
                      style={{ top: `${w.y}px`, left: `${w.x}px` }}
                    />
                  ))}
                </div>
              )}
              <div className="wappen-info">
                <span className="created-at">{new Date(design.createdAt).toLocaleDateString()}</span>
                <span className="wappen-label">
                  총 가격: {(design.price || 0).toLocaleString()}원
                </span>
              </div>
              <div className="wappen-buttons">
                <button
                  className="wappen-btn outline"
                  onClick={() => navigate(`/product/${design.id}`, { state: design })}
                >제품 상세</button>
                <button
                  className="wappen-btn outline"
                  onClick={() => handleDelete(design.id)}
                >삭제</button>
              </div>
              <button
                className="wappen-btn full"
                onClick={() => handleShare(design)}
              >디자인 개시하기</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 
