// ✅ MyWappens.jsx - 중복 허용 및 uniqueKey 사용 + 서버 연동 주석 포함 버전
import React, { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyWappens.css';
import deleteProductEverywhere from '../api/deleteProductEverywhere';
import axiosInstance from '../api/axiosInstance'; // ✅ 서버 연동용

export default function MyWappens() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [savedWappens, setSavedWappens] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareTarget, setShareTarget] = useState(null);
  const [shareInfo, setShareInfo] = useState({ title: '', description: '' });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    const local = localStorage.getItem(`savedWappens_${user.email}`);
    const data = JSON.parse(local || '[]').map((w, index) => ({
      ...w,
      uniqueKey: `${w.id}-${index}`
    }));
    setSavedWappens(data);
  }, [user, navigate]);

  const handleDelete = async (id) => {
    if (!window.confirm('이 와펜을 삭제할까요?')) return;
    const updated = savedWappens.filter(w => w.id !== id);
    setSavedWappens(updated);
    localStorage.setItem(`savedWappens_${user.email}`, JSON.stringify(updated));
    deleteProductEverywhere(Number(id), user.email);

    // ✅ 서버 연동 시
    try {
      await axiosInstance.delete(`/wappens/${id}`);
    } catch (err) {
      console.error('서버 삭제 실패:', err);
    }
  };

  const calculateCustomWappenPrice = (design) => {
    const strapPrice = 500;
    const wappenPrice = 500;
    return strapPrice + wappenPrice * design.wappens.length;
  };

  const handleBuy = (design) => {
    const product = {
      id: design.id,
      name: design.title || '커스터마이징 와펜',
      price: calculateCustomWappenPrice(design),
      images: [design.image],
      description: design.description || '',
      nickname: user.nickname || '사용자',
      category: '유저디자인',
      createdAt: design.createdAt || new Date().toISOString(),
      isSharedWappen: true
    };
    navigate('/order/form', { state: { product } });
  };

  const handleShare = async () => {
    if (!shareTarget) return;

    const shared = {
      id: shareTarget.id,
      author: user.email,
      nickname: user.nickname || '사용자',
      image: shareTarget.image,
      images: [shareTarget.image],
      strap: shareTarget.strap,
      wappens: shareTarget.wappens,
      createdAt: new Date().toISOString(),
      title: shareInfo.title,
      description: shareInfo.description,
      category: '유저디자인',
      price: calculateCustomWappenPrice(shareTarget)
    };

    const prev = JSON.parse(localStorage.getItem('sharedWappens') || '[]');
    const updated = [shared, ...prev]; // 중복 허용
    localStorage.setItem('sharedWappens', JSON.stringify(updated));

    // ✅ 서버 연동 시
    try {
      await axiosInstance.post('/shared-wappens', shared);
    } catch (err) {
      console.error('게시 실패:', err);
    }

    alert('디자인이 유저디자인 카테고리에 게시되었습니다!');
    setShowShareModal(false);
    setShareInfo({ title: '', description: '' });
    setShareTarget(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="my-wappens-wrapper">
      <h2 className="my-wappens-title">나의 와펜</h2>
      {savedWappens.length === 0 ? (
        <div className="no-wappens">
          <p>저장된 와펜이 없습니다.</p>
        </div>
      ) : (
        <div className="my-wappens-grid">
          {savedWappens.map((item) => (
            <div key={item.uniqueKey} className="my-wappen-card">
              <h5>나만의 커스텀 와펜</h5>
              <img src={item.image} alt="preview" className="my-wappen-img" />
              <div className="wappen-label">#{'WAPPEN-' + item.id.toString().slice(-5)}</div>
              <div className="wappen-info">
                <span className="created-at">{formatDate(item.createdAt)}</span>
                <button className="delete-btn" onClick={() => handleDelete(item.id)}>삭제</button>
                <button className="buy-btn" onClick={() => handleBuy(item)}>구매하기</button>
                <button className="buy-btn" onClick={() => {
                  setShareTarget(item);
                  setShowShareModal(true);
                }}>디자인 게시</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showShareModal && (
        <div className="share-modal">
          <div className="modal-content">
            <h3>디자인 게시하기</h3>
            <input
              type="text"
              placeholder="제목 입력"
              value={shareInfo.title}
              onChange={(e) => setShareInfo({ ...shareInfo, title: e.target.value })}
            />
            <textarea
              placeholder="설명 입력"
              rows={4}
              value={shareInfo.description}
              onChange={(e) => setShareInfo({ ...shareInfo, description: e.target.value })}
            ></textarea>
            <button onClick={handleShare} className="buy-btn">디자인 게시 완료</button>
            <button onClick={() => setShowShareModal(false)} style={{ marginTop: '8px' }}>취소</button>
          </div>
        </div>
      )}
    </div>
  );
}
