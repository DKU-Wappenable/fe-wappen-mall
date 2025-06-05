//  OAuthCallback.jsx - 소셜 로그인 후 서버 연동 + 실패 시 localStorage fallback 구조 추가
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../UserContext';
import axiosNoApi from "../../api/axiosNoApi";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const token = query.get('token');
    const provider = query.get('provider');

    if (token) {
      localStorage.setItem('access_token', token);
      axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;

      const fetchUser = async () => {
        try {
          const res = await axiosNoApi.get('/users/me');
          const userData = {
            ...res.data,
            linkedSocials: [provider],
          };
          localStorage.setItem('user', JSON.stringify(userData));
          setUser(userData);

          if (userData.role === 'ADMIN') navigate('/admin');
          else if (userData.role === 'SHOP_OWNER') navigate('/admin/upload');
          else navigate('/');
        } catch (err) {
          console.error('❌ 소셜 로그인 실패:', err);
          
          // ❌ localStorage fallback 제거 - 실제 서버 응답에만 의존
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user');
          delete axiosInstance.defaults.headers.common['Authorization'];
          
          alert('소셜 로그인에 실패했습니다. 다시 시도해주세요.');
          navigate('/login');
        }
      };

      fetchUser();
    } else {
      alert('소셜 로그인 실패: 유효한 토큰이 없습니다.');
      navigate('/login');
    }
  }, [location.search, navigate, setUser]);

  return (
    <div style={{ padding: '2rem' }}>
      <h2> 로그인 중입니다...</h2>
    </div>
  );
}