import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../UserContext';
// import axios from '../../api/axiosInstance'; // ✅ 서버 연동 시

export default function WithdrawPage() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [confirm, setConfirm] = useState(false);

  const handleWithdraw = async () => {
    if (!confirm) {
      setConfirm(true);
      return;
    }

    // ✅ 서버 연동 예시
    /*
    try {
      await axios.post('/users/withdraw', {
        email: user.email,
        password,
      });
    } catch (err) {
      console.error('탈퇴 실패:', err);
      setError('비밀번호가 틀렸거나 오류가 발생했습니다.');
      return;
    }
    */

    // ✅ localStorage 기반 테스트
    logout(); // UserContext 내의 logout 호출
    alert('회원 탈퇴가 완료되었습니다.');
    navigate('/');
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
        {confirm ? '🔥 탈퇴 확정' : '회원 탈퇴'}
      </button>
    </div>
  );
}
