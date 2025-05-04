// 필요한 라이브러리 import
import { useEffect } from "react";
import { useUser } from "./UserContext";  // 사용자 상태 관리를 위한 커스텀 훅
import { toast } from "react-toastify";   // 알림 메시지 표시 라이브러리
import { useNavigate } from "react-router-dom"; // 페이지 이동을 위한 훅

// AutoLogoutManager 컴포넌트 정의
export default function AutoLogoutManager() {
  const { user, logout } = useUser(); // user 객체와 logout 함수 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 함수 생성

  // 컴포넌트 마운트 및 user 변경 시 실행
  useEffect(() => {
    if (!user) return; // user가 없으면 아무 작업도 하지 않음

    let timer; // 타이머 변수 선언

    // 유저 활동이 있을 때마다 타이머를 초기화하는 함수
    const resetTimer = () => {
      clearTimeout(timer); // 이전 타이머 제거
      timer = setTimeout(() => {
        logout(); // 로그아웃 실행
        toast.info("30분 동안 활동이 없어 자동 로그아웃되었습니다."); // 알림 표시
        navigate("/"); // 홈으로 이동
      }, 1000 * 60 * 30); // 30분 후 자동 로그아웃
    };

    // 주요 사용자 활동 이벤트에 resetTimer 연결
    ["mousemove", "keydown", "click", "scroll"].forEach((ev) =>
      window.addEventListener(ev, resetTimer)
    );

    resetTimer(); // 컴포넌트 초기 실행 시 타이머 설정

    // 컴포넌트 언마운트 시 이벤트 제거 및 타이머 클리어
    return () => {
      clearTimeout(timer); // 타이머 제거
      ["mousemove", "keydown", "click", "scroll"].forEach((ev) =>
        window.removeEventListener(ev, resetTimer)
      );
    };
  }, [user, logout, navigate]); // 의존성 배열: user, logout, navigate 변경 시 재실행

  return null; // 이 컴포넌트는 화면에 아무것도 렌더링하지 않음
}
