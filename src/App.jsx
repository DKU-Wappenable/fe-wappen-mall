//  App.jsx
import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { useUser } from './components/UserContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer/Footer.jsx';

// 페이지 import 생략 없이 전체 포함
import Home from './components/Home';
import MyPage from './components/MyPage';
import WappenCustomize from './components/WappenCustomize';
import MyWappens from './components/MyWappens';
import LoginForm from './components/Login/LoginForm';
import SignupForm from './components/Login/SignupForm';
import FindForm from './components/Login/FindForm';
import OAuthCallback from './components/Login/OAuthCallback';
import ProductUploadPage from './components/product/ProductUploadPage';
import ProductDetailPage from './components/product/ProductDetailPage';
import PurchaseModal from './components/payment/PurchaseModal';
import OrderFormPage from './components/payment/OrderFormPage';
import PaymentCompletePage from './components/payment/PaymentCompletePage';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProductUpload from './components/admin/AdminProductUpload';
import AdminProductList from './components/admin/AdminProductList';
import AdminProductEdit from './components/admin/AdminProductEdit';
import AdminReviewDashboard from './components/admin/AdminReviewDashboard';
import OrderDetailPage from './components/mypage/OrderDetailPage';
import CartPage from './components/payment/CartPage';
import PointHistory from './components/mypage/PointHistory';
import ResetPasswordModal from './components/Login/ResetPasswordModal';
import IamportPayment from './components/payment/IamportPayment';
import WithdrawPage from './components/Login/WithdrawPage';
import SignupComplete from './components/Login/SignupComplete';
import Careers from './components/Footer/Careers';
import HelpCenter from './components/Footer/HelpCenter';
import Subscribe from './components/Footer/Subscribe';
import TermsOfService from './components/Footer/TermsOfService';
import PrivacyPolicy from './components/Footer/PrivacyPolicy';
import LikedProductsPage from './components/LikedProductsPage.jsx';
import CategoryProductPage from './components/CategoryProductPage';
import AccountSettings from './components/mypage/AccountSettings.jsx';
import UserManagement from './components/admin/UserManagement.jsx';

function ProtectedRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  return children;
}

function AdminRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'ADMIN') return <Navigate to="/" />;
  return children;
}
function AdminOrOwnerRoute({ children }) {
  const { user } = useUser();
  if (!user) return <Navigate to="/login" />;
  if (user.role !== 'ADMIN' && user.role !== 'SHOP_OWNER') return <Navigate to="/" />;
  return children;
}


function App() {
  useEffect(() => {
  const defaultUsers = [
    {
      email: 'admin@example.com', password: 'admin1234', nickname: '관리자', role: 'ADMIN', phone: '010-0000-0000', termsAccepted: true, linkedSocials: []
    },
    {
      email: 'owner@example.com', password: 'owner1234', nickname: '오너', role: 'SHOP_OWNER', phone: '010-1111-1111', termsAccepted: true, linkedSocials: []
    },
    {
      email: 'user@example.com', password: 'user1234', nickname: '사용자', role: 'USER', phone: '010-2222-2222', termsAccepted: true, linkedSocials: []
    },
    {
      email: 'test@example.com', password: 'test1234', nickname: '테스트', role: 'ADMIN', phone: '010-3333-4444', termsAccepted: false, linkedSocials: ['kakao']
    }
  ];

  if (!localStorage.getItem('users')) {
    localStorage.setItem('users', JSON.stringify(defaultUsers));
    //  개별 유저도 따로 저장
    defaultUsers.forEach(user => {
      const key = user.email.split('@')[0]; // admin, owner, user, test
      localStorage.setItem(key, JSON.stringify(user));
    });
  }
}, []);


  return (
    <div className="wrapper">
      <Navigation />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
          <Route path="/find-id" element={<FindForm mode="id" onClose={() => window.history.back()} />} />
          <Route path="/find-pw" element={<FindForm mode="pw" onClose={() => window.history.back()} />} />

          <Route path="/wappen-customize" element={<ProtectedRoute><WappenCustomize /></ProtectedRoute>} />
          <Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
          <Route path="/my-wappens" element={<ProtectedRoute><MyWappens /></ProtectedRoute>} />
          <Route path="/order/form" element={<ProtectedRoute><OrderFormPage /></ProtectedRoute>} />
          <Route path="/Point" element={<ProtectedRoute><PointHistory /></ProtectedRoute>} />
          <Route path="/account-settings" element={<ProtectedRoute><AccountSettings /></ProtectedRoute>} />
          <Route path="/collect" element={<ProtectedRoute><MyWappens /></ProtectedRoute>} />
          <Route path="/Like" element={<LikedProductsPage />} />

          <Route path="/admin/products" element={<AdminRoute><AdminProductList /></AdminRoute>} />
          <Route path="/admin/edit/:id" element={<AdminRoute><AdminProductEdit /></AdminRoute>} />
          <Route path="/admin/reviews" element={<AdminRoute><AdminReviewDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><UserManagement /></AdminRoute>} />
          <Route path="/admin/upload" element={<AdminOrOwnerRoute><ProductUploadPage /></AdminOrOwnerRoute>} />


          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/purchase-test" element={<PurchaseModal />} />
          <Route path="/order/complete" element={<PaymentCompletePage />} />
          <Route path="/my-orders/:id" element={<OrderDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/ResetPasswordModal" element={<ResetPasswordModal />} />
          <Route path="/payment/mock" element={<IamportPayment />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/signup/complete" element={<SignupComplete />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />

          <Route path="/careers" element={<Careers />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/products" element={<CategoryProductPage />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;