// src/pages/UserManagement.jsx
import React, { useEffect, useState } from 'react';
import '../../styles/AdminUserManagement.css';
import axiosInstance from '../../api/axiosInstance';

export default function UserManagement() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axiosInstance.get('/admin/users');
        setUsers(res.data.content);
      } catch (err) {
        console.warn('서버 실패 → localStorage 대체');
        const fallbackUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const deduplicated = Array.from(
          new Map(fallbackUsers.map(u => [u.id, u])).values()
        );
        setUsers(deduplicated);
      }
    };

    fetchUsers();
  }, []);

  const changeRole = async (id, newRole) => {
    try {
      await axiosInstance.put(`/admin/users/${id}/role`, { role: newRole });
      setUsers(users.map(u => u.id === id ? { ...u, role: newRole } : u));
    } catch (err) {
      console.warn('서버 실패 → localStorage 업데이트 시도');
      const updated = users.map(u => u.id === id ? { ...u, role: newRole } : u);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  const deleteUser = async (id, email) => {
    const confirmed = window.confirm(`${email} 계정을 삭제할까요?`);
    if (!confirmed) return;

    try {
      await axiosInstance.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.warn('서버 실패 → localStorage 삭제 시도');
      const updated = users.filter(u => u.id !== id);
      setUsers(updated);
      localStorage.setItem('users', JSON.stringify(updated));
    }
  };

  return (
    <div className="admin-user-management">
      <h2>회원 관리</h2>
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
            <tr key={user.id}>
              <td>{user.email}</td>
              <td>{user.nickname || user.name || '-'}</td>
              <td>
                <select
                  value={user.role}
                  onChange={(e) => changeRole(user.id, e.target.value)}
                >
                  <option value="USER">user</option>
                  <option value="SHOP_OWNER">owner</option>
                  <option value="ADMIN">admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => deleteUser(user.id, user.email)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
