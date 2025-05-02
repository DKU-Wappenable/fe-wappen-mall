// ✅ 정리 + 보완된 완성형 버전

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const [showTerms, setShowTerms] = useState(false);
  const [tempToken, setTempToken] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      toast.error("소셜 로그인 실패: 토큰이 없습니다.");
      navigate("/login");
      return;
    }

    const agreed = localStorage.getItem("agreed_terms") === "true";
    if (agreed) {
      localStorage.setItem("access_token", token);
      toast.success("소셜 로그인 완료!");
      navigate("/");
    } else {
      setTempToken(token);
      setShowTerms(true); // 약관 동의 필요
    }
  }, [navigate]);

  const handleAgree = () => {
    localStorage.setItem("agreed_terms", "true");
    localStorage.setItem("access_token", tempToken);
    toast.success("약관에 동의하고 로그인되었습니다!");
    navigate("/");
  };

  return (
    <>
      {showTerms ? (
        <div className="terms-modal">
          <div className="terms-box">
            <h2>이용약관</h2>
            <div className="terms-content">
              <p><strong>제1조 (목적)</strong></p>
              <p>본 약관은 형이 만든 Wappen 서비스(이하 “서비스”)의 이용조건 및 절차, 회원의 권리와 의무, 기타 필요한 사항을 규정함을 목적으로 합니다.</p>

              <p><strong>제2조 (약관의 명시와 개정)</strong></p>
              <ol>
                <li>서비스는 이 약관을 서비스 화면에 게시합니다.</li>
                <li>서비스는 관계법령을 위배하지 않는 범위 내에서 이 약관을 개정할 수 있습니다.</li>
                <li>개정 시에는 적용일자 및 개정사유를 명시하여 사전 공지합니다.</li>
                <li>회원이 변경된 약관에 동의하지 않을 경우, 서비스 탈퇴를 요청할 수 있습니다.</li>
              </ol>

              <p><strong>제3조 (용어의 정의)</strong></p>
              <p>이 약관에서 사용하는 용어의 정의는 관계법령 및 개별서비스의 안내에 따릅니다.</p>
            </div>

            <button onClick={handleAgree} className="submit-btn black" style={{ marginTop: '16px' }}>
              동의하고 계속하기
            </button>
          </div>
        </div>
      ) : (
        <div>로그인 처리 중...</div>
      )}
    </>
  );
}
