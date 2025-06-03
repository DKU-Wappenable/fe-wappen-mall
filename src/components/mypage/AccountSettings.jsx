import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../api/axiosInstance';
import { useUser } from '../UserContext';
import '../../styles/AccountSettings.css';

export default function AccountSettings() {
  const { user, setUser } = useUser();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    password: '',
  });
  const [saved, setSaved] = useState(false);

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

  const handleSave = () => {
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

    // ✅ 로컬 저장 및 상태 업데이트
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setSaved(true);

    // ✅ 서버 연동 시
    /*
    axios.put('/users/me', updatedUser)
      .then(res => {
        setUser(res.data);
        localStorage.setItem('user', JSON.stringify(res.data));
        setSaved(true);
      })
      .catch(err => {
        console.error('수정 실패:', err);
        alert('수정 중 오류 발생');
      });
    */
  };

  // ✅ 소셜 연동 해제
  const socialNames = {
    kakao: '카카오',
    naver: '네이버',
    google: '구글',
  };

  const handleUnlink = (provider) => {
    const confirmed = window.confirm(`${socialNames[provider]} 연동을 해제하시겠습니까?`);
    if (!confirmed) return;

    const updatedUser = {
      ...user,
      linkedSocials: user.linkedSocials?.filter((p) => p !== provider),
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);

    // ✅ 서버 연동 시
    /*
    axios.delete(`/api/users/link/${provider}`)
      .then(() => {
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      })
      .catch(err => {
        console.error('소셜 연동 해제 실패:', err);
        alert('연동 해제 중 오류가 발생했습니다.');
      });
    */
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

      {/* ✅ 소셜 로그인 연동 해제 */}
      {user.linkedSocials && user.linkedSocials.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <h4>🔗 연결된 소셜 계정</h4>
          <ul>
            {user.linkedSocials.map((provider) => (
              <li key={provider} style={{ marginBottom: '0.5rem' }}>
                {socialNames[provider]} 계정
                <button
                  onClick={() => handleUnlink(provider)}
                  style={{
                    marginLeft: '1rem',
                    padding: '0.3rem 0.8rem',
                    backgroundColor: '#dc3545',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                  }}
                >
                  연동 해제
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ✅ 회원 탈퇴 버튼 */}
      <Link to="/withdraw">
        <button
          style={{
            marginTop: '2rem',
            color: 'white',
            backgroundColor: '#dc3545',
            padding: '0.5rem 1.5rem',
            border: 'none',
            borderRadius: '6px',
          }}
        >
          회원 탈퇴
        </button>
      </Link>
    </div>
  );
}
