//  UserManagement.jsx - 서버 연동 + 실패 시 localStorage fallback 처리 (개선됨)
import React, { useEffect, useState } from 'react';
import '../../styles/AdminUserManagement.css';
import axiosInstance from '../../api/axiosInstance';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users');
        setUsers(res.data);
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');
        const fallbackUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const deduplicated = Array.from(
          new Map(fallbackUsers.map(u => [u.email, u])).values()
        );
        setUsers(deduplicated);
      }
    };

    fetchUsers();
  }, []);

  const changeRole = async (email, newRole) => {
    try {
      await axiosInstance.put(`/admin/users/${email}/role`, { role: newRole });
      setUsers(users.map(u => u.email === email ? { ...u, role: newRole } : u));
    } catch (err) {
      console.warn('서버 실패 → localStorage 업데이트 시도');
      const updated = users.map(u => u.email === email ? { ...u, role: newRole } : u);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      const key = email.split('@')[0];
      localStorage.setItem(key, JSON.stringify(updated.find(u => u.email === email)));
    }
  };

  const deleteUser = async (email) => {
    const confirmed = window.confirm(`${email} 계정을 삭제할까요?`);
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/admin/users/${email}`);
      setUsers(users.filter(u => u.email !== email));
    } catch (err) {
      console.warn('서버 실패 → localStorage 삭제 시도');
      const updated = users.filter(u => u.email !== email);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
      const key = email.split('@')[0];
      localStorage.removeItem(key);
    }
  };

  return (
    <div className="admin-user-management">
      <h2> 회원 관리</h2>
      <table>
        <thead>
          <tr>
            <th>이메일</th>
            <th>닉네임</th>
            <th>권한</th>
            <th>관리</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.email}>
              <td>{user.email}</td>
              <td>{user.nickname || user.name || '-'}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.email, e.target.value)}
                >
                  <option value="user">user</option>
                  <option value="owner">owner</option>
                  <option value="admin">admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user.email)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
