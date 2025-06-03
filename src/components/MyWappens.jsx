// src/components/MyWappens.jsx
import React, { useEffect, useState } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import '../styles/MyWappens.css';

export default function MyWappens() {
  const { user } = useUser();
  const [designs, setDesigns] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    const fetchWappens = async () => {
      try {
        const res = await axiosInstance.get(`/wappens?email=${user.id}`);
        setDesigns(res.data);
      } catch (err) {
        console.warn('서버 실패, 로컬 저장에서 불러옵니다.');
        const local = JSON.parse(localStorage.getItem(`savedWappens_${user.id}`) || '[]');
        setDesigns(local);
      }
    };

    fetchWappens();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('이 디자인을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/wappens/${id}`);
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.warn('서버 실패, 로컬 삭제 진행');
      const local = JSON.parse(localStorage.getItem(`savedWappens_${user.id}`) || '[]');
      const updated = local.filter(d => d.id !== id);
      localStorage.setItem(`savedWappens_${user.id}`, JSON.stringify(updated));
      setDesigns(updated);
    }

    const shared = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
    const updatedShared = shared.filter(d => d.id !== id);
    localStorage.setItem('sharedWappens', JSON.stringify(updatedShared));

    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const newCart = cart.filter(item => item.product.id !== id);
    localStorage.setItem('cart', JSON.stringify(newCart));

    const liked = JSON.parse(localStorage.getItem('liked') || '[]');
    const newLiked = liked.filter(item => item.id !== id);
    localStorage.setItem('liked', JSON.stringify(newLiked));
  };

  const handleShare = async (design) => {
    const shared = {
      ...design,
      nickname: user.id || user.name || 'user',
      category: '유저디자인',
      name: design.title || `유저 디자인`,
      images: [design.image || '/assets/default.png'],
      price: 500 + (design.wappens?.length || 0) * 500,
      createdAt: design.createdAt || new Date().toISOString(),
      id: design.id || Date.now(),
    };

    try {
      await axiosInstance.post('/products', shared);
      alert('공유 완료! 관리자 승인 후 반영됩니다.');
    } catch (err) {
      console.warn('서버 실패, 로컬 공유 저장');
      const prev = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
      const updated = [shared, ...prev.filter(d => d.id !== shared.id)];
      localStorage.setItem('sharedWappens', JSON.stringify(updated));
      alert('공유 완료!');
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
              {design.image ? (
                <div className="my-wappen-preview">
                  <img
                    src={design.image}
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
                  총 가격: {(500 + (design.wappens?.length || 0) * 500).toLocaleString()}원
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
