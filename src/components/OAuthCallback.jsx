import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useUser } from "../components/UserContext";

export default function OAuthCallback() {
  const navigate = useNavigate();
  const { socialLogin } = useUser(); // 새로 만든 함수

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");

    if (!token) {
      toast.error("소셜 로그인 실패: 토큰이 없습니다.");
      navigate("/login");
      return;
    }

    // 소셜 로그인 처리 요청
    socialLogin(token)
      .then(() => {
        toast.success("소셜 로그인 완료!");
        navigate("/");
      })
      .catch((err) => {
        toast.error(err.message || "소셜 로그인 처리 중 오류 발생");
        navigate("/login");
      });
  }, [navigate, socialLogin]);

  return <div>로그인 처리 중...</div>;
}
