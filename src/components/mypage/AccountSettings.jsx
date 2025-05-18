// src/components/mypage/AccountSettings.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../UserContext';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/AccountSettings.css';

export default function AccountSettings() {
  const { user, setUser, logout } = useUser();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || '',
        phone: user.phone || '',
        password: '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setSaved(false);
  };

  const handleSave = async () => {
    setError("");

    if (!form.name || !form.phone) {
      alert('이름과 전화번호를 입력해주세요.');
      return;
    }

    if (!/^010\d{7,8}$/.test(form.phone)) {
      alert('전화번호는 010으로 시작하고 10~11자리여야 합니다.');
      return;
    }

    if (form.password && form.password.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    const updatedUser = {
      ...user,
      name: form.name,
      phone: form.phone,
      ...(form.password ? { password: form.password } : {}),
    };

    try {
      //  서버 연동 우선
      const res = await axiosInstance.put("/users/me", updatedUser);
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
      setSaved(true);
    } catch (err) {
      console.warn("서버 실패, 로컬 fallback 시도:", err);
      try {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        setUser(updatedUser);
        setSaved(true);
      } catch (fallbackErr) {
        console.error("정보 저장 실패:", fallbackErr);
        setError("정보 저장 중 오류가 발생했습니다.");
      }
    }
  };

  const socialNames = {
    kakao: '카카오',
    naver: '네이버',
    google: '구글',
  };

  const handleUnlink = async (provider) => {
    const confirmed = window.confirm(`${socialNames[provider]} 연동을 해제하시겠습니까?`);
    if (!confirmed) return;

    const updatedUser = {
      ...user,
      linkedSocials: user.linkedSocials?.filter(p => p !== provider),
    };

    try {
      await axiosInstance.delete(`/users/link/${provider}`);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (err) {
      console.warn("서버 실패, 로컬 fallback:", err);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  const handleWithdraw = async () => {
    const confirmed = window.confirm("정말로 탈퇴하시겠습니까?");
    if (!confirmed) return;

    try {
      await axiosInstance.delete("/users/withdraw");
      alert("회원 탈퇴가 완료되었습니다.");
    } catch (err) {
      console.warn("서버 탈퇴 실패, 로컬 fallback");
    }

    logout();
  };

  return (
    <div className="account-settings">
      <h3>회원 정보 수정</h3>

      <div className="form-group">
        <label>이메일 (수정 불가)</label>
        <input value={user?.email || ''} disabled />
      </div>

      <div className="form-group">
        <label>이름</label>
        <input name="name" value={form.name} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>연락처 (010으로 시작)</label>
        <input name="phone" value={form.phone} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>비밀번호 (변경 시에만 입력)</label>
        <input name="password" type="password" value={form.password} onChange={handleChange} />
      </div>

      <button onClick={handleSave}>정보 저장</button>
      {saved && <p className="success-msg">정보가 저장되었습니다!</p>}
      {error && <p className="error-message">{error}</p>}

      {/*  연결된 소셜 계정 표시 */}
      {user.linkedSocials && user.linkedSocials.length > 0 && (
        <div className="social-unlink-section">
          <h4>연결된 소셜 계정</h4>
          <ul className="social-unlink-list">
            {user.linkedSocials.map((provider) => (
              <li key={provider} className="social-item">
                <div className="social-info">
                  <img
                    src={`/assets/${provider}_icon.png`}
                    alt={`${provider} 아이콘`}
                    className="social-icon"
                  />
                  <span>{socialNames[provider]} 계정 연동됨</span>
                </div>
                <button className="unlink-btn" onClick={() => handleUnlink(provider)}>
                  연동 해제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button className="withdraw-btn" onClick={handleWithdraw}>
        회원 탈퇴
      </button>
    </div>
  );
}
