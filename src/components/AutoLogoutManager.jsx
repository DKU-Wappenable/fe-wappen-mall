// src/components/AutoLogoutManager.jsx
import { useEffect } from "react";
import { useUser } from "./UserContext";  // 경로 수정: contexts → components
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function AutoLogoutManager() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;

    let timer;
    const resetTimer = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        logout();
        toast.info("30분 동안 활동이 없어 자동 로그아웃되었습니다.");
        navigate("/");
      }, 1000 * 60 * 30);
    };

    ["mousemove", "keydown", "click", "scroll"].forEach((ev) =>
      window.addEventListener(ev, resetTimer)
    );
    resetTimer();

    return () => {
      clearTimeout(timer);
      ["mousemove", "keydown", "click", "scroll"].forEach((ev) =>
        window.removeEventListener(ev, resetTimer)
      );
    };
  }, [user, logout, navigate]);

  return null;
}
