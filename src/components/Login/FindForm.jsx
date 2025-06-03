import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import ResetPasswordModal from './ResetPasswordModal';

export default function FindForm({ mode = 'id', onClose }) {
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [email, setEmail] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [foundId, setFoundId] = useState('');

  const handleFind = async () => {
    if (mode === 'id') {
      if (!recoveryEmail) return alert('이메일을 입력하세요.');
      try {
        const res = await axiosInstance.post('/users/find-id', {
          recoveryEmail,
        });
        setFoundId(res.data); // 서버가 문자열만 주는 구조면 이거 그대로
      } catch (err) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find((u) => u.recoveryEmail === recoveryEmail);
        if (found) setFoundId(found.email); // email = 아이디
        else alert('일치하는 사용자를 찾을 수 없습니다.');
      }
    } else {
      if (!email || !recoveryEmail) return alert('아이디와 이메일을 모두 입력하세요.');
      try {
        await axiosInstance.post('/users/find-pw', {
          email,
          recoveryEmail,
        });
        setVerifiedUser({ email, recoveryEmail });
        setShowResetModal(true);
      } catch (err) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find((u) => u.email === email && u.recoveryEmail === recoveryEmail);
        if (found) {
          setVerifiedUser(found);
          setShowResetModal(true);
        } else {
          alert('일치하는 사용자를 찾을 수 없습니다.');
        }
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <button className="close-btn" onClick={onClose}>×</button>
        <h2 className="auth-title">{mode === 'id' ? '아이디 찾기' : '비밀번호 찾기'}</h2>

        {mode === 'id' ? (
          <>
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="가입 시 입력한 본인 이메일"
            />
            <button onClick={handleFind} className="submit-btn blue">아이디 찾기</button>
            {foundId && (
              <div className="result-box">
                <p>가입된 아이디: <strong>{foundId}</strong></p>
              </div>
            )}
          </>
        ) : (
          <>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="아이디"
            />
            <input
              type="email"
              value={recoveryEmail}
              onChange={(e) => setRecoveryEmail(e.target.value)}
              placeholder="가입 시 입력한 본인 이메일"
            />
            <button onClick={handleFind} className="submit-btn blue">비밀번호 찾기</button>
          </>
        )}

        <button onClick={onClose} className="cancel-btn">닫기</button>

        {showResetModal && verifiedUser && (
          <ResetPasswordModal
            email={verifiedUser.email}
            onClose={() => setShowResetModal(false)}
          />
        )}
      </div>
    </div>
  );
}
