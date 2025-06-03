// React 및 필요한 훅/모듈 import
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 라우팅 및 링크 이동
import { useUser } from '../UserContext'; // 사용자 컨텍스트
import '../../styles/AuthForm.css'; // 로그인 폼에 대한 스타일시트
import { userService } from '../../api/services/userService';
import { toast } from 'react-toastify';

/**
 * 로그인 폼 컴포넌트
 * 백엔드 API와 연동하여 사용자 인증을 처리하는 예제 컴포넌트
 */
const LoginForm = ({ onLoginSuccess }) => {
  const navigate = useNavigate(); // 페이지 이동 함수
  const { login } = useUser(); // 사용자 로그인 함수 가져오기

  // 폼 상태 관리
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // 입력 필드 변경 처리
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = '이메일을 입력해주세요.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '올바른 이메일 형식이 아닙니다.';
    }

    if (!formData.password) {
      newErrors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 6) {
      newErrors.password = '비밀번호는 최소 6자 이상이어야 합니다.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      
      const response = await userService.login(formData);
      
      toast.success('로그인에 성공했습니다!');
      
      // 로그인 성공 콜백 호출
      if (onLoginSuccess) {
        onLoginSuccess(response);
      }
      
      // 폼 초기화
      setFormData({
        email: '',
        password: ''
      });
      
    } catch (error) {
      console.error('로그인 실패:', error);
      
      if (error.response?.status === 401) {
        toast.error('이메일 또는 비밀번호가 잘못되었습니다.');
      } else {
        toast.error('로그인 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 소셜 로그인 버튼 클릭 시 실행되는 함수
  const handleSocialLogin = (provider) => {
    const providers = {
      카카오: '/oauth2/authorization/kakao',
      네이버: '/oauth2/authorization/naver',
      구글: '/oauth2/authorization/google',
    };

    // 해당 provider에 맞는 URL로 이동
    if (providers[provider]) {
      window.location.href = providers[provider];
    }
  };

  // 실제 렌더링 되는 컴포넌트 반환
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">로그인</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* 이메일 입력 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            이메일
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="이메일을 입력하세요"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="비밀번호를 입력하세요"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-lg font-medium text-white transition-colors ${
            loading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              로그인 중...
            </div>
          ) : (
            '로그인'
          )}
        </button>
      </form>

      {/* 추가 링크들 */}
      <div className="mt-6 text-center space-y-2">
        <div className="flex justify-center space-x-4 text-sm">
          <button className="text-blue-500 hover:text-blue-700 hover:underline">
            아이디 찾기
          </button>
          <span className="text-gray-300">|</span>
          <button className="text-blue-500 hover:text-blue-700 hover:underline">
            비밀번호 찾기
          </button>
        </div>
        <div className="text-sm text-gray-600">
          계정이 없으신가요?{' '}
          <button className="text-blue-500 hover:text-blue-700 hover:underline font-medium">
            회원가입
          </button>
        </div>
      </div>

      {/* 소셜 로그인 안내 및 버튼 */}
      <div className="divider">또는 다른 서비스 계정으로 로그인</div>

      <div className="social-login-group">
        <button className="social-btn kakao" onClick={() => handleSocialLogin('카카오')}>
          <img src="/assets/kakao_icon.png" alt="카카오 로그인" />
        </button>
        <button className="social-btn naver" onClick={() => handleSocialLogin('네이버')}>
          <img src="/assets/naver_icon.png" alt="네이버 로그인" />
        </button>
        <button className="social-btn google" onClick={() => handleSocialLogin('구글')}>
          <img src="/assets/google_icon.png" alt="구글 로그인" />
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
