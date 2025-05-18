//  MyWappens.jsx - 서버 연동 + 로컬 fallback 구조 반영
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
        const res = await axiosInstance.get(`/api/wappens?email=${user.email}`);
        setDesigns(res.data);
      } catch (err) {
        console.warn('서버 실패, 로컬 저장에서 불러옵니다.');
        const local = JSON.parse(localStorage.getItem(`savedWappens_${user.email}`) || '[]');
        setDesigns(local);
      }
    };

    fetchWappens();
  }, [user]);

  const handleDelete = async (id) => {
    const confirm = window.confirm('이 디자인을 삭제하시겠습니까?');
    if (!confirm) return;

    try {
      await axiosInstance.delete(`/api/wappens/${id}`);
      setDesigns(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.warn('서버 실패, 로컬 삭제 진행');
      const local = JSON.parse(localStorage.getItem(`savedWappens_${user.email}`) || '[]');
      const updated = local.filter(d => d.id !== id);
      localStorage.setItem(`savedWappens_${user.email}`, JSON.stringify(updated));
      setDesigns(updated);
    }
  };

  const handleShare = async (design) => {
    const shared = { ...design, id: Date.now(), nickname: user.nickname || user.name || 'user' };
    try {
      await axiosInstance.post('/api/products', shared);
      alert('공유 완료! 관리자 승인 후 반영됩니다.');
    } catch (err) {
      console.warn('서버 실패, 로컬 공유 저장');
      const prev = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
      localStorage.setItem('sharedWappens', JSON.stringify([shared, ...prev]));
      alert('공유 완료! (로컬 반영)');
    }
  };

  return (
    <div className="mywappens-container">
      <h2>나의 와펜 디자인</h2>
      {designs.length === 0 ? (
        <p>저장된 디자인이 없습니다.</p>
      ) : (
        <div className="mywappens-grid">
          {designs.map((design) => (
            <div key={design.id} className="wappen-card">
              <img
                src={design.image}
                alt="saved design"
                className="wappen-preview"
                onError={(e) => (e.target.src = '/assets/default.png')}
              />
              <div className="wappen-buttons">
                <button onClick={() => navigate(`/wappen/${design.id}`, { state: design })}>상세 보기</button>
                <button onClick={() => handleDelete(design.id)}>삭제</button>
                <button onClick={() => handleShare(design)}>디자인 개시하기</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
