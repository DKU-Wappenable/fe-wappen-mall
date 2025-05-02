import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import '../styles/Navigation.css';

export default function Navigation() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="nav-container">
      <div className="nav-left">
        <Link to="/" className="nav-logo">WAPPENABLE</Link>
      </div>
      <div className="nav-right">
        {user ? (
          <>
            <Link to="/wappen-customize" className="nav-link">와펜 만들기</Link>
            <Link to="/my-wappens" className="nav-link">내 와펜</Link>
            <Link to="/my-page" className="nav-link">마이페이지</Link>
            <button onClick={handleLogout} className="nav-link logout-btn">로그아웃</button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">로그인</Link>
            <Link to="/signup" className="nav-link">회원가입</Link>
          </>
        )}
      </div>
    </nav>
  );
} 