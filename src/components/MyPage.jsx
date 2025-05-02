import React from 'react';
import { useUser } from '../components/UserContext';
import '../styles/MyPage.css';

export default function MyPage() {
  const { user } = useUser();

  return (
    <div className="my-page-container">
      <div className="mypage-header">
        <h1>마이페이지</h1>
        <p>나의 정보를 확인할 수 있습니다.</p>
      </div>

      <div className="user-info-section">
        <h2>내 정보</h2>
        <div className="info-item">
          <label>이메일:</label>
          <span>{user?.email}</span>
        </div>
        <div className="info-item">
          <label>이름:</label>
          <span>{user?.name}</span>
        </div>
        <div className="action-buttons">
          <button className="action-btn">프로필 수정</button>
          <button className="action-btn">비밀번호 변경</button>
        </div>
      </div>
    </div>
  );
} 