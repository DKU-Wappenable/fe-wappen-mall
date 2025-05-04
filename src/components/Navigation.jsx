
import React from 'react';
import { Link, useNavigate } from 'react-router-dom'; // 라우팅 처리를 위한 훅과 컴포넌트 import
import { useUser } from '../components/UserContext'; // 사용자 정보 및 로그아웃 함수 사용
import '../styles/Navigation.css'; // 네비게이션 스타일 import

// Navigation 컴포넌트: 상단 네비게이션 바 UI 및 로직 정의
export default function Navigation() {
  const { user, logout } = useUser(); // 현재 로그인된 사용자 정보 및 로그아웃 함수 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수

  // 로그아웃 버튼 클릭 시 실행되는 함수
  const handleLogout = () => {
    logout(); // 로그아웃 처리
    navigate('/'); // 홈으로 이동
  };

  return (
    <nav className="nav-container">
      {/* 좌측 로고 영역 */}
      <div className="nav-left">
        <Link to="/" className="nav-logo">WAPPENABLE</Link>
      </div>

      {/* 우측 네비게이션 링크 영역 */}
      <div className="nav-right">
        {user ? (
          // 로그인된 경우 보이는 메뉴들
          <>
            <Link to="/wappen-customize" className="nav-link">와펜 만들기</Link>
            <Link to="/my-wappens" className="nav-link">내 와펜</Link>
            <Link to="/my-page" className="nav-link">마이페이지</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">로그아웃</button>
          </>
        ) : (
          // 비로그인 상태일 때 보이는 메뉴들
          <>
            <Link to="/login" className="nav-link">로그인</Link>
            <Link to="/signup" className="nav-link">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
}