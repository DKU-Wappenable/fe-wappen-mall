// src/pages/AdminDashboard.jsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // ✅ 백엔드 연동 시 관리자 인증 확인용 (예: useEffect로 인증 API 호출)
  useEffect(() => {
    // TODO: axios.get('/api/admin/check-auth') → 실패 시 navigate('/')
  }, []);

  return (
    <div className="admin-dashboard-container">
      <h2>🛠 관리자 대시보드</h2>
      <div className="admin-button-group">
        <button onClick={() => navigate('/admin/upload')}>상품 등록</button>
        <button onClick={() => navigate('/admin/products')}>상품 목록 / 삭제</button>
        <button onClick={() => alert('회원 관리 준비 중입니다.')}>회원 관리</button>
      </div>
    </div>
  );
}
