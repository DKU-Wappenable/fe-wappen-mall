// src/components/common/LoginRequiredModal.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/Modal.css';

export default function LoginRequiredModal({ onClose }) {
  const navigate = useNavigate();

  const handleGoLogin = () => {
    onClose();
    navigate('/login');
  };

  return (
    <div className="reset-modal-backdrop" onClick={onClose}>
      <div className="reset-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>로그인이 필요합니다</h3>
        <p>로그인창으로 이동합니다.</p>
    <button className="cancel-btn" onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
