import React, { useState } from 'react';
import ResetPasswordModal from './ResetPasswordModal';

export default function FindForm({ mode = 'id', onClose }) {
  const [email, setEmail] = useState('');
  const [id, setId] = useState('');
  const [showResetModal, setShowResetModal] = useState(false);
  const [verifiedUser, setVerifiedUser] = useState(null);
  const [foundId, setFoundId] = useState('');

  const handleFind = async () => {
    if (mode === 'id') {
      if (!email) return alert('이메일을 입력하세요.');
      try {
        const res = await axiosInstance.post('/users/find-id', { email });
        setFoundId(res.data);
      } catch (err) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.email === email);
        if (found) setFoundId(found.id);
        else alert('일치하는 사용자를 찾을 수 없습니다.');
      }
    } else {
      if (!id || !email) return alert('아이디와 이메일을 모두 입력하세요.');
      try {
        await axiosInstance.post('/users/find-pw', { id, email });
        setVerifiedUser({ id, email });
        setShowResetModal(true);
      } catch (err) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const found = users.find(u => u.id === id && u.email === email);
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
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
              value={id}
              onChange={(e) => setId(e.target.value)}
              placeholder="아이디"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="이메일"
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
