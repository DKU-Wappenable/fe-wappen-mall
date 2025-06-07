import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useUser } from '../components/UserContext';
// import axiosInstance from '../api/axiosInstance'; // ← 서버 연동 시 사용
import '../styles/Navigation.css';

export default function Navigation() {
  const { user, logout } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const keyword = params.get('keyword') || '';
    setSearchText(keyword); //  검색어 유지
  }, [location.search]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleUnlink = (provider) => {
    alert(`${provider} 연동 해제됨 (local only)`);
    // await axiosInstance.delete(`/api/users/link/${provider}`);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchText.trim()) return;
    navigate(`/products?keyword=${encodeURIComponent(searchText.trim())}`);
  };

  const clearSearch = () => {
    setSearchText('');
    navigate('/products'); //
  };

  return (
    <header className="nav-wrapper">
      <div className="nav-container">
        <Link to="/" className="nav-logo">Wappenable</Link>

        <div className="nav-search">
  <form onSubmit={handleSearch} className="nav-search-form">
    <span className="material-icons search-icon">search</span>
    <input
      type="text"
      value={searchText}
      onChange={(e) => setSearchText(e.target.value)}
      placeholder="검색어 입력"
      className="nav-search-input"
    />
    {searchText && (
      <button
        type="button"
        className="clear-btn"
        onClick={() => setSearchText('')}
        aria-label="검색어 초기화"
      >
        <span className="material-icons">close</span>
      </button>
    )}

  </form>
</div>
        <div className="nav-right">
          <Link to="/like" className="nav-icon heart-icon">
            <img src="/assets/icons/heart.png" alt="좋아요" className="nav-img-icon" />
          </Link>

          <Link to="/cart" className="nav-icon cart-icon">
            <img src="/assets/icons/cart.png" alt="장바구니" className="nav-img-icon" />
          </Link>

          <div className="nav-user" ref={dropdownRef}>
            <img
              src="/assets/icons/user.png"
              alt="User"
              className="nav-img-icon user-avatar"
              onClick={() => setShowDropdown(prev => !prev)}
            />

            {showDropdown && (
              <div className="dropdown-menu">
               {user ? (
            <>
              <Link to="/my-page" onClick={() => setShowDropdown(false)}>마이페이지</Link>
              <Link to="/wappen-customize" onClick={() => setShowDropdown(false)}>와펜 만들기</Link>
              <Link to="/my-wappens" onClick={() => setShowDropdown(false)}>내 와펜</Link>
              <Link to="/account-settings" onClick={() => setShowDropdown(false)}>계정 설정</Link>
              {user.role === 'ADMIN' && (
                <Link to="/admin" onClick={() => setShowDropdown(false)}>관리자 대시보드</Link>
              )}
              {user && (user.role === 'SHOP_OWNER' || user.role === 'ADMIN') && (
                <button onClick={() => navigate('/admin/upload')}>상품 등록</button>
              )}
              <button onClick={handleLogout}>로그아웃</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setShowDropdown(false)}>로그인</Link>
              <Link to="/signup" onClick={() => setShowDropdown(false)}>회원가입</Link>
            </>
          )}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
