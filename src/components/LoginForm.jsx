import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useUser } from '../components/UserContext';
import '../styles/AuthForm.css';

export default function LoginForm() {
  const navigate = useNavigate();
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError('이메일 또는 비밀번호가 올바르지 않습니다.');
    }
  };

  const handleSocialLogin = (provider) => {
    const providers = {
      카카오: '/oauth2/authorization/kakao',
      네이버: '/oauth2/authorization/naver',
      구글: '/oauth2/authorization/google',
    };

    if (providers[provider]) {
      window.location.href = providers[provider];
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>로그인</h2>
        <p></p>
        <p className="sub-head">WAPPENABLE 계정으로 로그인</p>

        {error && <div className="error-message">{error}</div>}

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

        <div className="additional-links">
          <Link to="/find-id" className="find-link">아이디 찾기</Link>
          <span className="divider-line">ㅣ</span>
          <Link to="/find-pw" className="find-link">비밀번호 찾기</Link>
          <span className="divider-line">ㅣ</span>
          <Link to="/signup" className="find-link">회원가입</Link>
        </div>

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