import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { useUser } from './components/UserContext';

import Navigation from './components/Navigation';
import Home from './components/Home';
import MyPage from './components/MyPage';
import WappenCustomize from './components/WappenCustomize';
import MyWappens from './components/MyWappens';
import LoginForm from './components/LoginForm';
import SignupForm from './components/SignupForm';
import FindForm from './components/FindForm';
import OAuthCallback from './components/OAuthCallback';

function ProtectedRoute({ children }) {
  const { user } = useUser();
  React.useEffect(() => {
    if (!user) toast.error('로그인이 필요한 서비스입니다.');
  }, [user]);
  return user ? children : null;
}

function App() {
  return (
    <>
      <Navigation />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />

        {/* 아이디 찾기와 비밀번호 찾기 라우트 */}
        <Route
          path="/find-id"
          element={<FindForm mode="id" onClose={() => window.history.back()} />}
        />
        <Route
          path="/find-pw"
          element={<FindForm mode="pw" onClose={() => window.history.back()} />}
        />

        <Route
          path="/wappen-customize"
          element={
            <ProtectedRoute>
              <WappenCustomize />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-page"
          element={
            <ProtectedRoute>
              <MyPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-wappens"
          element={
            <ProtectedRoute>
              <MyWappens />
            </ProtectedRoute>
          }
        />
      </Routes>
      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;