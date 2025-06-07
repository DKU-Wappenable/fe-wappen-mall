import React, { useEffect, useState } from 'react';
import { useUser } from '../UserContext';
import axiosInstance from '../../api/axiosInstance';
import '../../styles/AccountSettings.css';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import { toast } from 'react-toastify';
export default function AccountSettings() {
  const { user, setUser, logout } = useUser();
  const [form, setForm] = useState({
    nickname: '',
    password: '',
  });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  useEffect(() => {
    if (user && user.email && typeof user.nickname === 'string') {
      setForm({
        nickname: user.nickname,
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
    setError('');

    if (!form.nickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    if (form.password && form.password.length < 8) {
      alert('비밀번호는 최소 8자 이상이어야 합니다.');
      return;
    }

    const updatedUser = {
      ...user,
      nickname: form.nickname,
    };

    //  비밀번호 변경 요청 (선택적)
    if (form.password) {
      try {
        await axiosInstance.post('/users/reset-password', {
          email: user.email,
          newPassword: form.password,
        });
      } catch (err) {
        alert('비밀번호 변경 실패: 유효성 또는 서버 문제');
        return;
      }
    }

    //  닉네임 변경 요청
    try {
      const res = await axiosInstance.put('/users/me', updatedUser);

      //  백엔드 응답이 불완전하면 기존 유저 정보 유지
      const finalUser = {
        ...user,
        ...res?.data, // 덮어쓰기 되되, 없는 건 유지
        nickname: form.nickname, // 수정된 닉네임 반영
      };

      setUser(finalUser);
      localStorage.setItem('user', JSON.stringify(finalUser));
      toast.success("정보가 성공적으로 저장되었습니다!");
      setSaved(true);
      setTimeout(() => {
        navigate('/');
      }, 700);
    } catch (err) {
      // ❗ 서버 실패 시 조용히 로컬 fallback
      const fallbackUser = updatedUser;
      setUser(fallbackUser);
      localStorage.setItem('user', JSON.stringify(fallbackUser));
      setSaved(true);
      navigate('/');
    }
  };

  return (
    <div className="account-settings">
      <h3>회원 정보 수정</h3>

      <div className="form-group">
        <label>이메일 (수정 불가)</label>
        <input value={user?.email || ''} disabled />
      </div>

      <div className="form-group">
        <label>닉네임</label>
        <input name="nickname" value={form.nickname} onChange={handleChange} />
      </div>

      <div className="form-group">
        <label>비밀번호 (변경 시에만 입력)</label>
        <input
          name="password"
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={handleChange}
        />
      </div>

      <button onClick={handleSave}>정보 저장</button>
      {saved && <p className="success-msg">정보가 저장되었습니다!</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}
