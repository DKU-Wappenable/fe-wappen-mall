import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/App.css';

import { useUser } from './components/UserContext';
import Navigation from './components/Navigation';
import Footer from './components/Footer/Footer.jsx';


// 모든 컴포넌트 그대로 유지 (생략)
import Home from './components/Home';
import MyPage from './components/MyPage';
import WappenCustomize from './components/WappenCustomize';
import MyWappens from './components/MyWappens';
import LoginForm from './components/Login/LoginForm';
import SignupForm from './components/Login/SignupForm';
import FindForm from './components/Login/FindForm';
import OAuthCallback from './components/Login/OAuthCallback';
import ProductUploadPage from './components/product/ProductUploadPage';
import PurchaseSuccessPage from './components/payment/PurchaseSuccessPage';
import ProductDetailPage from './components/product/ProductDetailPage';
import PurchaseModal from './components/payment/PurchaseModal';
import OrderFormPage from './components/payment/OrderFormPage';
import PaymentCompletePage from './components/payment/PaymentCompletePage';
import AutoLogoutManager from './components/Login/AutoLogoutManager';
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

function ProtectedRoute({ children }) {
  const { user } = useUser();
  React.useEffect(() => {
    if (!user) toast.error('로그인이 필요한 서비스입니다.');
  }, [user]);
  return user ? children : null;
}

function App() {
  return (
    <div className="wrapper"> {/* ✅ 전체 페이지 wrapper */}
      <Navigation />

      <main> {/* ✅ 가운데 main 영역 */}
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
          <Route path="/order/form" element={<ProtectedRoute><OrderFormPage /></ProtectedRoute>} />
          <Route path="/order/complete" element={<PaymentCompletePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProductList />} />
          <Route path="/admin/edit/:id" element={<ProtectedRoute><AdminProductEdit /></ProtectedRoute>} />
          <Route path="/admin/reviews" element={<AdminReviewDashboard />} />
          <Route path="/my-orders/:id" element={<OrderDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/Point" element={<ProtectedRoute><PointHistory /></ProtectedRoute>} />
          <Route path="/ResetPasswordModal" element={<ResetPasswordModal />} />
          <Route path="/payment/mock" element={<IamportPayment />} />
          <Route path="/withdraw" element={<WithdrawPage />} />
          <Route path="/signup/complete" element={<SignupComplete />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/subscribe" element={<Subscribe />} />
          <Route path="/create" element={<ProtectedRoute><WappenCustomize /></ProtectedRoute>} />
          <Route path="/collect" element={<ProtectedRoute><MyWappens /></ProtectedRoute>} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path ="/Like" element={<ProtectedRoute><LikedProductsPage /></ProtectedRoute>} />
          <Route path="/products" element={<CategoryProductPage />} />
          <Route path ="/account-settings" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
        </Routes>
      </main>

      <Footer /> {/* ✅ 항상 맨 아래 */}
      <ToastContainer position="top-center" autoClose={2000} />
    </div>
  );
}

export default App;
