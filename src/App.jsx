// React 및 리액트 라우터, 토스트 메시지, 스타일 import
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
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
import ProductUploadPage from './components/ProductUploadPage';
import PurchaseSuccessPage from './components/PurchaseSuccessPage';
import ProductDetailPage from './components/ProductDetailPage';
import PurchaseModal from './components/PurchaseModal';
import OrderFormPage from './components/OrderFormPage';
import PaymentCompletePage from './components/PaymentCompletePage';

// 로그인된 사용자만 접근 가능한 라우트 정의
function ProtectedRoute({ children }) {
  const { user } = useUser();
  React.useEffect(() => {
    if (!user) toast.error('로그인이 필요한 서비스입니다.');
  }, [user]);
  return user ? children : null;
}

// App 컴포넌트 정의
function App() {
  return (
    <>
      <Navigation />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/find-id" element={<FindForm mode="id" onClose={() => window.history.back()} />} />
        <Route path="/find-pw" element={<FindForm mode="pw" onClose={() => window.history.back()} />} />
        <Route path="/wappen-customize" element={<ProtectedRoute><WappenCustomize /></ProtectedRoute>} />
        <Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        <Route path="/my-wappens" element={<ProtectedRoute><MyWappens /></ProtectedRoute>} />
        <Route path="/admin/upload" element={<ProductUploadPage />} />
        <Route path="/purchase-success" element={<PurchaseSuccessPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/purchase-test" element={<PurchaseModal />} />
        <Route path="/order" element={<OrderFormPage />} />
        <Route path="/order/complete" element={<PaymentCompletePage />} />
      </Routes>

      <ToastContainer position="top-center" autoClose={2000} />
    </>
  );
}

export default App;
