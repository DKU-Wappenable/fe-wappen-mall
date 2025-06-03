import React from 'react';
import { Link } from 'react-router-dom';

export default function SignupComplete() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
      <h2> 회원가입이 완료되었습니다!</h2>
      <p style={{ margin: '1rem 0' }}>WAPPENABLE에 오신 것을 환영합니다.</p>

      <Link to="/login">
        <button
          style={{
            marginTop: '1.5rem',
            padding: '0.8rem 2rem',
            backgroundColor: '#003366',
            color: '#fff',
            border: 'none',
            borderRadius: '6px',
            fontSize: '16px',
            cursor: 'pointer',
          }}
        >
          로그인 하러 가기
        </button>
      </Link>
    </div>
  );
}
