import React, { useState } from 'react';
import OrderHistory from './mypage/OrderHistory';
import PendingReviews from './mypage/PendingReviews';
import AccountSettings from './mypage/AccountSettings';
import MyReviews from './mypage/MyReviews';
import PointHistory from './mypage/PointHistory';
import { Link } from 'react-router-dom';
import '../styles/MyPage.css';

export default function MyPage() {
  const [activeTab, setActiveTab] = useState('orders');

  return (
    <div className="mypage-container">
      <h2>마이페이지</h2>

      <div className="mypage-tabs-wrapper">
        <div className="mypage-tabs">
          <button
            onClick={() => setActiveTab('orders')}
            className={activeTab === 'orders' ? 'active' : ''}
          >
            주문 내역
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={activeTab === 'reviews' ? 'active' : ''}
          >
            작성 가능한 리뷰
          </button>
          <button
            onClick={() => setActiveTab('myreviews')}
            className={activeTab === 'myreviews' ? 'active' : ''}
          >
            내 리뷰
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={activeTab === 'settings' ? 'active' : ''}
          >
            계정 설정
          </button>
          <button
            onClick={() => setActiveTab('points')}
            className={activeTab === 'points' ? 'active' : ''}
          >
            포인트 내역
          </button>

          {/*  포인트 옆에 정렬된 회원 탈퇴 버튼 */}
          <Link to="/withdraw">
            <button className="withdraw-btn">회원 탈퇴</button>
          </Link>
        </div>
      </div>

      <div className="mypage-content">
        {activeTab === 'orders' && <OrderHistory />}
        {activeTab === 'reviews' && <PendingReviews />}
        {activeTab === 'myreviews' && <MyReviews />}
        {activeTab === 'settings' && <AccountSettings />}
        {activeTab === 'points' && <PointHistory />}
      </div>
    </div>
  );
}
