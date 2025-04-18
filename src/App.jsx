import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import SignupForm from "./components/SignupForm";
import FindForm from "./components/FindForm";
import { UserProvider, useUser } from "./components/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import "./styles/App.css";

function Header({ onLoginClick, onSignupClick }) {
  const { user, logout } = useUser();

  return (
    <header className="app-header">
      <div className="header-inner">
        <div className="logo">WAPPEN</div>
        <div className="header-right">
          {user ? (
            <>
              <span>{user.nickname}님 환영합니다!</span>
              <button onClick={logout}>로그아웃</button>
            </>
          ) : (
            <>
              <button onClick={onLoginClick}>로그인</button>
              <button onClick={onSignupClick}>회원가입</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function AppContent() {
  const [modalType, setModalType] = useState(null);
  const [signupStep, setSignupStep] = useState("kakao");
  const { user } = useUser();

  useEffect(() => {
    const esc = (e) => {
      if (e.key === "Escape") setModalType(null);
    };
    window.addEventListener("keydown", esc);
    return () => window.removeEventListener("keydown", esc);
  }, []);

  return (
    <div>
      <Header
        onLoginClick={() => setModalType("login")}
        onSignupClick={() => {
          setSignupStep("kakao");
          setModalType("signup");
        }}
      />

      {!user && modalType === "login" && (
        <LoginForm
          onClose={() => setModalType(null)}
          onSwitch={setModalType}
          setStep={setSignupStep}
        />
      )}
      {!user && modalType === "signup" && (
        <SignupForm
          onClose={() => setModalType(null)}
          step={signupStep}
          setStep={setSignupStep}
        />
      )}
      {!user && modalType === "find-id" && <FindForm onClose={() => setModalType(null)} mode="id" />}
      {!user && modalType === "find-pw" && <FindForm onClose={() => setModalType(null)} mode="pw" />}
    </div>
  );
}

function App() {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
        </Routes>
        <ToastContainer position="top-center" autoClose={2000} />
      </Router>
    </UserProvider>
  );
}

export default App;
