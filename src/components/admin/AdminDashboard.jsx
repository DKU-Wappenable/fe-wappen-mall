// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../components/UserContext';
import axiosInstance from '../../api/axiosInstance'; //  서버 연동용
import '../../styles/AdminDashboard.css';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        //  서버 인증 시도
        const res = await axiosInstance.get('/admin/check-auth');
        if (res.data?.role === 'ADMIN') {
          setIsAuthorized(true);
        } else {
          throw new Error('not admin');
        }
      } catch (err) {
        //  서버 실패 시 로컬 fallback
        if (user && user.role === 'ADMIN') {
          console.warn('⚠️ 서버 인증 실패. 로컬 user.role 기반으로 관리자 권한 부여됨.');
          setIsAuthorized(true);
        } else {
          alert('관리자만 접근할 수 있습니다.');
          navigate('/');
        }
      }
    };

    checkAuth();
  }, [user, navigate]);

  if (!isAuthorized) return null; // 인증되기 전엔 아무것도 안 보여줌

  return (
    <div className="admin-dashboard-container">
      <h2>관리자 대시보드</h2>
      <p className="admin-welcome">안녕하세요, {user?.name || '관리자'}님</p>

      <div className="admin-button-group">
        <button onClick={() => navigate('/admin/upload')}>상품 등록</button>
        <button onClick={() => navigate('/admin/products')}>상품 목록 / 삭제</button>
        <button onClick={() => navigate('/admin/users')}>회원 관리</button>
      </div>
    </div>
  );
}
