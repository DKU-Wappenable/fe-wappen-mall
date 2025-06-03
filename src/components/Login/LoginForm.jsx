import React, { useEffect, useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useUser } from "../UserContext";
import { toast } from "react-toastify";
import axiosInstance from "../../api/axiosInstance";
import "../../styles/AuthForm.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useUser();

  // 상태 관리
  const [formData, setFormData] = useState({
    email: location.state?.email || "", // 회원가입에서 전달된 이메일
    password: ""
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // 회원가입 완료 메시지 표시
  useEffect(() => {
    if (location.state?.message) {
      toast.success(location.state.message);
      // state 초기화
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ 컴포넌트 마운트 시에만 기존 로그인 상태 확인
  useEffect(() => {
    // 이미 로그인된 상태로 /login 페이지에 접근한 경우에만 리다이렉션
    if (user) {
      console.log("🔄 이미 로그인된 사용자, 리다이렉션:", user);
      redirectUser(user);
    }
  }, []); // 의존성 배열 비움 - 마운트 시에만 실행

  // 사용자 역할에 따른 리다이렉션
  const redirectUser = (userData) => {
    if (userData.role === "ADMIN") {
      navigate("/admin");
    } else if (userData.role === "SHOP_OWNER") {
      navigate("/admin/upload");
    } else {
      navigate("/");
    }
  };

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // 에러 메시지 초기화
    if (error) setError("");
  };

  // 로그인 처리
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // 기본 유효성 검증
    if (!formData.email.trim()) {
      setError("아이디를 입력해주세요.");
      setIsLoading(false);
      return;
    }
    
    if (!formData.password.trim()) {
      setError("비밀번호를 입력해주세요.");
      setIsLoading(false);
      return;
    }

    try {
      console.log("🚀 로그인 요청:", { email: formData.email });
      
      // 1. 로그인 API 호출
      const loginResponse = await axiosInstance.post("/users/login", {
        email: formData.email,
        password: formData.password
      });

      const { accessToken, refreshToken } = loginResponse.data;
      console.log("✅ 로그인 성공, 토큰 받음");

      // 2. 토큰 저장 및 axios 헤더 설정
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem("refresh_token", refreshToken);
      axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      try {
        // 3. 사용자 정보 조회
        console.log("👤 사용자 정보 조회 중...");
        const userResponse = await axiosInstance.get("/users/me");
        const userData = userResponse.data;
        
        console.log("✅ 사용자 정보 조회 성공:", userData);

        // 4. 사용자 정보 저장 및 상태 업데이트 - 성공 시에만!
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`환영합니다, ${userData.nickname}님!`);

        // 5. 약관 동의 여부에 따른 처리
        if (userData.role !== "admin" && !userData.termsAccepted) {
          console.log("📋 약관 동의가 필요한 사용자 - 약관 모달 표시");
          // 약관 모달이 자동으로 표시됨 (UserContext의 useEffect에 의해)
          // 약관 동의 완료 후 수동으로 리다이렉션 필요
        } else {
          console.log("✅ 약관 동의 완료된 사용자 - 즉시 리다이렉션");
          // 약관 동의가 이미 완료된 사용자는 즉시 리다이렉션
          redirectUser(userData);
        }

      } catch (meError) {
        console.error("❌ 사용자 정보 조회 실패:", meError);
        
        // ❌ 토큰 정리 및 로그인 실패 처리 - setUser 호출하지 않음
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user"); // 사용자 정보도 제거
        delete axiosInstance.defaults.headers.common["Authorization"];
        
        setError("로그인에 실패했습니다. 다시 시도해주세요.");
        // ✅ 화면 이동하지 않음 - 로그인 페이지에 머물러있음
      }

    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      
      // 토큰 및 사용자 정보 완전 정리
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      delete axiosInstance.defaults.headers.common["Authorization"];
      
      // ✅ user 상태도 null로 초기화 (혹시 모를 상황 대비)
      setUser(null);
      
      // 서버 에러 처리
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 400) {
          // 유효성 검증 오류 (아이디 형식 등)
          setError(data.error || "입력 형식을 확인해주세요.");
        } else if (status === 401) {
          // 로그인 정보 불일치
          setError("아이디 또는 비밀번호를 확인해주세요.");
        } else if (status === 404) {
          // 사용자 없음
          setError("등록되지 않은 아이디입니다.");
        } else if (status >= 500) {
          setError("서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
        } else {
          setError(data.error || "로그인에 실패했습니다. 다시 시도해주세요.");
        }
      } else if (error.request) {
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setError("예상치 못한 오류가 발생했습니다.");
      }
      
      // ❌ 중복 토스트 제거: setError로 에러 메시지 표시가 충분함  
      // toast.error("로그인에 실패했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 소셜 로그인 처리
  const handleSocialLogin = (provider) => {
    const baseURL = axiosInstance.defaults.baseURL.replace('/api', '');
    const providers = {
      카카오: `${baseURL}/oauth2/authorization/kakao`,
      네이버: `${baseURL}/oauth2/authorization/naver`,
      구글: `${baseURL}/oauth2/authorization/google`,
    };
    
    if (providers[provider]) {
      console.log(`🔗 ${provider} 소셜 로그인:`, providers[provider]);
      window.location.href = providers[provider];
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>로그인</h2>
        <p className="sub-heading">WAPPENABLE 계정으로 로그인</p>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            name="email"
            placeholder="아이디"
            value={formData.email}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="비밀번호"
            value={formData.password}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
          <button 
            type="submit" 
            className="submit-btn black"
            disabled={isLoading}
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <div className="auth-links">
          <p>
            아직 계정이 없으신가요? <Link to="/signup">회원가입</Link>
          </p>
          <p style={{ marginTop: '8px' }}>
            <Link to="/find-id" style={{ marginRight: '12px' }}>아이디 찾기</Link>
            <Link to="/find-pw">비밀번호 찾기</Link>
          </p>
        </div>

        <div className="divider">또는 다른 서비스 계정으로 로그인</div>
        <div className="social-login-group">
          <button 
            className="social-btn kakao" 
            onClick={() => handleSocialLogin("카카오")}
            disabled={isLoading}
          >
            <img src="/assets/kakao_icon.png" alt="카카오 로그인" />
          </button>
          <button 
            className="social-btn naver" 
            onClick={() => handleSocialLogin("네이버")}
            disabled={isLoading}
          >
            <img src="/assets/naver_icon.png" alt="네이버 로그인" />
          </button>
          <button 
            className="social-btn google" 
            onClick={() => handleSocialLogin("구글")}
            disabled={isLoading}
          >
            <img src="/assets/google_icon.png" alt="구글 로그인" />
          </button>
        </div>
      </div>
    </div>
  );
}
