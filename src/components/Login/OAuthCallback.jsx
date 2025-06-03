//  OAuthCallback.jsx - 소셜 로그인 후 서버 연동 + 실패 시 localStorage fallback 구조 추가
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosInstance from '../../api/axiosInstance';
import { useUser } from '../UserContext';

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
          const res = await axiosInstance.get('/users/me');
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
          console.warn('서버 실패, localStorage fallback 시도');
          const fallbackUser = {
            email: 'social@example.com',
            nickname: provider + ' 유저',
            role: 'USER',
            phone: '010-0000-0000',
            linkedSocials: [provider],
            termsAccepted: false,
          };
          localStorage.setItem('user', JSON.stringify(fallbackUser));
          setUser(fallbackUser);
          navigate('/');
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