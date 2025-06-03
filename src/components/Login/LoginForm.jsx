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

  // 이미 로그인된 사용자 리다이렉션
  useEffect(() => {
    if (user) {
      console.log("🔄 이미 로그인된 사용자:", user);
      redirectUser(user);
    }
  }, [user, navigate]);

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

        // 4. 사용자 정보 저장 및 상태 업데이트
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`환영합니다, ${userData.nickname}님!`);

        // 5. 역할에 따른 페이지 이동
        redirectUser(userData);

      } catch (meError) {
        console.error("❌ 사용자 정보 조회 실패:", meError);
        
        // 사용자 정보 조회 실패 시 기본 정보로 처리
        const fallbackUser = {
          email: formData.email,
          nickname: formData.email,
          role: "USER",
          termsAccepted: false
        };

        localStorage.setItem("user", JSON.stringify(fallbackUser));
        setUser(fallbackUser);
        
        toast.success("로그인 성공!");
        navigate("/");
      }

    } catch (error) {
      console.error("❌ 로그인 실패:", error);
      
      // 서버 에러 처리
      if (error.response) {
        const { status, data } = error.response;
        
        if (status === 401) {
          setError("아이디 또는 비밀번호가 올바르지 않습니다.");
        } else if (status === 400) {
          setError(data.message || "입력 정보를 확인해주세요.");
        } else {
          setError("로그인에 실패했습니다. 다시 시도해주세요.");
        }
      } else if (error.request) {
        setError("서버에 연결할 수 없습니다. 네트워크를 확인해주세요.");
      } else {
        setError("예상치 못한 오류가 발생했습니다.");
      }
      
      toast.error("로그인에 실패했습니다.");
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
