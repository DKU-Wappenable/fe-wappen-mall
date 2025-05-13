// React 및 필요한 훅/모듈 import
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // 라우팅 및 링크 이동
import { useUser } from '../UserContext'; // 사용자 컨텍스트
import '../../styles/AuthForm.css'; // 로그인 폼에 대한 스타일시트

// LoginForm 컴포넌트 정의
export default function LoginForm() {
  const navigate = useNavigate(); // 페이지 이동 함수
  const { login } = useUser(); // 사용자 로그인 함수 가져오기

  // 입력 필드 상태 변수들 정의
  const [email, setEmail] = useState(''); // 이메일 상태
  const [password, setPassword] = useState(''); // 비밀번호 상태
  const [error, setError] = useState(''); // 에러 메시지 상태

  // 로그인 폼 제출 시 실행되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault(); // 기본 폼 제출 동작 방지
    setError(''); // 에러 메시지 초기화

    try {
      // 로그인 시도
      await login({ email, password });
      navigate('/'); // 로그인 성공 시 홈으로 이동
    } catch (err) {
      // 로그인 실패 시 에러 메시지 설정
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
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
    <div className="auth-container">
      <div className="auth-box">
        <h2>로그인</h2>
        <p></p>
        <p className="sub-head">WAPPENABLE 계정으로 로그인</p>

        {/* 에러 메시지 표시 */}
        {error && <div className="error-message">{error}</div>}

        {/* 로그인 폼 */}
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="이메일 주소 또는 아이디"
            required
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호"
            required
          />
          <button type="submit" className="submit-btn black">
            로그인
          </button>
        </form>

        {/* 추가 링크 (아이디/비번 찾기, 회원가입) */}
        <div className="additional-links">
          <Link to="/find-id" className="find-link">아이디 찾기</Link>
          <span className="divider-line">ㅣ</span>
          <Link to="/find-pw" className="find-link">비밀번호 찾기</Link>
          <span className="divider-line">ㅣ</span>
          <Link to="/signup" className="find-link">회원가입</Link>
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
    </div>
  );
}
