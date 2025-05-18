//  FindForm.jsx - 서버 연동 + 로컬 fallback 구조 반영
import React, { useState } from 'react';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/FindForm.css';

export default function FindForm() {
  const [mode, setMode] = useState('findId'); // 'findId' | 'findPw'
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const handleFind = async () => {
    setMessage('');
    if (mode === 'findId') {
      try {
        const res = await axiosInstance.post('/api/users/find-id', { name, phone });
        setMessage(`아이디는 ${res.data.email} 입니다.`);
      } catch (err) {
        console.warn('서버 실패, 로컬에서 대체');
        const users = ['admin', 'owner', 'user']
          .map(key => JSON.parse(localStorage.getItem(key) || 'null'))
          .filter(Boolean);
        const found = users.find(u => u.name === name && u.phone === phone);
        setMessage(found ? `아이디는 ${found.email} 입니다.` : '일치하는 계정을 찾을 수 없습니다.');
      }
    } else {
      try {
        await axiosInstance.post('/api/users/reset-password-request', { email });
        setMessage('비밀번호 재설정 메일을 전송했습니다.');
      } catch (err) {
        console.warn('서버 실패, 로컬 처리');
        const user = ['admin', 'owner', 'user']
          .map(key => JSON.parse(localStorage.getItem(key) || 'null'))
          .find(u => u.email === email);
        setMessage(user ? '임시 비밀번호: temp1234' : '존재하지 않는 이메일입니다.');
      }
    }
  };

  return (
    <div className="find-form-container">
      <h2>{mode === 'findId' ? '아이디 찾기' : '비밀번호 찾기'}</h2>
      <div className="find-mode-toggle">
        <button onClick={() => setMode('findId')} className={mode === 'findId' ? 'active' : ''}>아이디 찾기</button>
        <button onClick={() => setMode('findPw')} className={mode === 'findPw' ? 'active' : ''}>비밀번호 찾기</button>
      </div>
      {mode === 'findId' ? (
        <>
          <input
            type="text"
            placeholder="이름 입력"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="전화번호 입력"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </>
      ) : (
        <>
          <input
            type="email"
            placeholder="이메일 입력"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </>
      )}

      <button onClick={handleFind}>찾기</button>
      {message && <p className="result-message">{message}</p>}
    </div>
  );
}
