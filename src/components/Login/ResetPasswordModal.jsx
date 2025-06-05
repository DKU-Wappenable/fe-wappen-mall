//  ResetPasswordModal.jsx - 서버 연동 + 실패 시 로컬 fallback 구조 추가
import React, { useState } from 'react';
import '../../styles/ResetPasswordModal.css';
import axiosInstance from '../../api/axiosInstance';
import axiosNoApi from '../../api/axiosNoApi';
import { useNavigate } from 'react-router-dom';

export default function ResetPasswordModal({ email, onClose }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (newPassword.length < 8) {
      setMessage('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage('비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      await axiosNoApi.post('api/users/reset-password', {
        email,
        newPassword,
      });
      alert('비밀번호가 성공적으로 변경되었습니다.');
      onClose();
      navigate('/login'); // 로그인 페이지로 이동
    } catch (err) {
      console.error('❌ 비밀번호 재설정 실패:', err);

      if (err.response?.status === 400) {
        setMessage('잘못된 요청입니다. 다시 시도해주세요.');
      } else if (err.response?.status === 404) {
        setMessage('사용자를 찾을 수 없습니다.');
      } else if (err.response?.status === 403) {
        setMessage('접근 권한이 없습니다. 관리자에게 문의하세요.');
      } else {
        setMessage('비밀번호 변경에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div className="reset-modal-backdrop" onClick={onClose}>
      <div
        className="reset-modal-content"
        onClick={(e) => e.stopPropagation()}
      >
        <h3> 비밀번호 재설정</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="새 비밀번호"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="비밀번호 확인"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          {message && <p className="error-msg">{message}</p>}
          <button type="submit">변경하기</button>
          <button type="button" onClick={onClose} className="cancel-btn">
            취소
          </button>
        </form>
      </div>
    </div>
  );
}
