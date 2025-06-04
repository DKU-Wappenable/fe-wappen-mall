// src/components/Login/WithdrawPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
import { toast } from 'react-toastify';
import axiosInstance from '../../api/axiosInstance'; //  서버 연동용

export default function WithdrawPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handleWithdraw = async () => {
    setError('');

    if (!confirm) {
      setConfirm(true);
      return;
    }

    try {
      //  서버 연동
      await axiosInstance.post('/users/withdraw', {
        email: user.email,
        password,
      });

      logout();
      toast.success('회원 탈퇴가 완료되었습니다.');
      navigate('/');
    } catch (err) {
      console.error('❌ 회원 탈퇴 실패:', err);
      
      // ❌ localStorage fallback 제거 - 실제 서버 응답에만 의존
      if (err.response?.status === 401) {
        setError('비밀번호가 틀렸습니다.');
      } else {
        setError('회원 탈퇴에 실패했습니다. 다시 시도해주세요.');
      }
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '500px', margin: '0 auto' }}>
      <h2>회원 탈퇴</h2>
      <p>정말 탈퇴하시겠습니까? 아래 정보를 확인하고 진행해 주세요.</p>

      <div style={{ marginBottom: '1rem' }}>
        <label>이메일</label>
        <input
          value={user?.email || ''}
          disabled
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <label>비밀번호</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호 입력"
          style={{ width: '100%', marginTop: '4px' }}
        />
      </div>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <button
        onClick={handleWithdraw}
        style={{
          padding: '0.7rem 1.5rem',
          backgroundColor: confirm ? '#d9534f' : '#6c757d',
          color: '#fff',
          border: 'none',
          borderRadius: '6px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
      >
        {confirm ? '탈퇴 확정' : '회원 탈퇴'}
      </button>
    </div>
  );
}
