// React와 필요한 훅/컨텍스트 import
import React from 'react';
import { useNavigate } from 'react-router-dom'; // 페이지 이동을 위한 훅
import { useUser } from '../components/UserContext'; // 사용자 정보 접근을 위한 커스텀 컨텍스트
import '../styles/Home.css'; // Home 컴포넌트에 대한 CSS 스타일 import

// Home 컴포넌트 정의
export default function Home() {
  const navigate = useNavigate(); // 페이지 이동 함수
  const { user } = useUser(); // 현재 로그인된 사용자 정보 가져오기

  return (
    // 전체 페이지를 감싸는 컨테이너 div
    <div className="home-container">
      {/* 콘텐츠를 감싸는 내부 div */}
      <div className="home-content">
        {/* 로고 또는 브랜드명을 보여주는 섹션 */}
        <div className="logo-section">
          <h1>WAPPENABLE</h1> {/* 서비스 이름 또는 로고 텍스트 */}
        </div>
      </div>
    </div>
  );
}
