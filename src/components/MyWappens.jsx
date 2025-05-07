import React, { useState, useEffect } from 'react';
import { useUser } from '../components/UserContext';
import { useNavigate } from 'react-router-dom';
import '../styles/MyWappens.css';

export default function MyWappens() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [savedWappens, setSavedWappens] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const wappens = JSON.parse(localStorage.getItem(`savedWappens_${user.email}`) || '[]');
    setSavedWappens(wappens);
  }, [user, navigate]);

  const handleDelete = (wappenId) => {
    const confirmed = window.confirm('이 와펜을 삭제하시겠습니까?');
    if (!confirmed) return;

    const updatedWappens = savedWappens.filter(w => w.id !== wappenId);
    localStorage.setItem(`savedWappens_${user.email}`, JSON.stringify(updatedWappens));
    setSavedWappens(updatedWappens);
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
    <div className="my-wappens-container">
      <h2>나의 와펜</h2>

      {savedWappens.length === 0 ? (
        <div className="no-wappens">
          <p>저장된 와펜이 없습니다.</p>
          <button onClick={() => navigate('/wappen-customize')} className="create-btn">
            와펜 만들러 가기
          </button>
        </div>
      ) : (
        <div className="wappens-grid">
          {savedWappens.map(savedWappen => (
            <div key={savedWappen.id} className="wappen-card">
              <div className="wappen-preview">
                <div
                  className="strap-preview"
                  style={{
                    backgroundColor: savedWappen.strap.color,
                    width: '230px',
                    height: savedWappen.strap.height * 0.5,
                    borderRadius: '4px',
                    position: 'relative'
                  }}
                >
                  {savedWappen.wappens.map(wappen => (
                    <div
                      key={wappen.id}
                      style={{
                        ...wappen.style,
                        position: 'absolute',
                        left: `${(wappen.position.x / 500) * 230}px`,
                        top: `${(wappen.position.y / 300) * (savedWappen.strap.height * 0.5)}px`,
                        transform: 'translate(-50%, -50%) scale(0.5)',
                        minWidth: '20px',
                        minHeight: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      {wappen.text}
                    </div>
                  ))}
                </div>
              </div>
              <div className="wappen-info">
                <span className="created-at">{formatDate(savedWappen.createdAt)}</span>
                <button
                  onClick={() => handleDelete(savedWappen.id)}
                  className="delete-btn"
                >
                  삭제
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ✅ 관리자 상품 등록 페이지 이동 버튼 */}
      {user?.email === 'test@example.com' && (
        <button
          onClick={() => navigate('/admin/upload')}
          className="admin-btn"
          style={{
            marginTop: '2rem',
            display: 'block',
            padding: '12px 24px',
            fontSize: '1rem',
            borderRadius: '8px',
            backgroundColor: '#222',
            color: '#fff',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          🛒 관리자 상품 등록 페이지
        </button>
      )}
    </div>
  );
}
