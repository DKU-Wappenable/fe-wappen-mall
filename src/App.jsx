// React 및 리액트 라우터, 토스트 메시지, 스타일 import
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

// 사용자 컨텍스트 import
import { useUser } from './components/UserContext';

// 페이지/컴포넌트 import
import Navigation from './components/Navigation';
import Home from './components/Home';
import MyPage from './components/MyPage';
import WappenCustomize from './components/WappenCustomize';
import MyWappens from './components/MyWappens';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import FindForm from './components/FindForm';
import OAuthCallback from './components/OAuthCallback';

// 로그인된 사용자만 접근 가능한 라우트 정의
function ProtectedRoute({ children }) {
  const { user } = useUser(); // 사용자 상태 확인
  React.useEffect(() => {
    if (!user) toast.error('로그인이 필요한 서비스입니다.'); // 로그인 안 돼 있으면 에러 토스트
  }, [user]);
  return user ? children : null; // 로그인 O: 자식 렌더링, X: 아무것도 안 보여줌
}

// App 컴포넌트 정의
function App() {
  return (
    <>
      {/* 상단 네비게이션 바 */}
      <Navigation />

      {/* 라우터 정의 */}
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* 로그인, 회원가입 */}
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />

        {/* 소셜 로그인 콜백 처리 */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* 아이디/비밀번호 찾기 */}
        <Route
          path="/find-id"
          element={<FindForm mode="id" onClose={() => window.history.back()} />}
        />
        <Route
          path="/find-pw"
          element={<FindForm mode="pw" onClose={() => window.history.back()} />}
        />

        {/* 와펜 커스터마이징 (로그인 필요) */}
        <Route
          path="/wappen-customize"
          element={
            <ProtectedRoute>
              <WappenCustomize />
            </ProtectedRoute>
          }
        />

        {/* 마이페이지 (로그인 필요) */}
        <Route
          path="/my-page"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />

        {/* 내가 만든 와펜 목록 (로그인 필요) */}
        <Route
          path="/my-wappens"
          element={
            <ProtectedRoute>
              <MyWappens />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* 전역 토스트 알림 컨테이너 설정 */}
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
