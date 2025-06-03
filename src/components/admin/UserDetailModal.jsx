// src/components/admin/UserDetailModal.jsx
import React from 'react';
import '../../styles/UserDetailModal.css';

export default function UserDetailModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="user-modal-backdrop" onClick={onClose}>
      <div className="user-modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>회원 정보</h3>
        <p><strong>이메일:</strong> {user.email}</p>
        <p><strong>닉네임:</strong> {user.nickname || user.name || '-'}</p>
        <p><strong>(추후) 전화번호:</strong> {user.phone || '-'}</p>
        <p><strong>역할:</strong> {user.role}</p>
        <p><strong>(추후) 약관 동의:</strong> {user.termsAccepted ? '동의' : '미동의'}</p>
        <p><strong>(추후) 소셜 연동:</strong> {user.linkedSocials?.join(', ') || '없음'}</p>

        <button onClick={onClose}>닫기</button>
      </div>
    </div>
  );
}
