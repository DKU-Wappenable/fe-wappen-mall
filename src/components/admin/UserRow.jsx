export default function UserRow({ user, onRoleChange, onDelete, onDetailClick }) {
  const handleChange = (e) => {
    const newRole = e.target.value;
    onRoleChange(user.email, newRole);
  };

  const handleDelete = () => {
    if (window.confirm(`${user.nickname || user.name} 님을 삭제할까요?`)) {
      onDelete(user.email);
    }
  };

  return (
    <tr>
      <td>{user.email}</td>
      <td>{user.nickname || user.name || '-'}</td>
      <td>
        <select value={user.role} onChange={handleChange}>
          <option value="USER">user</option>
          <option value="SHOP_OWNER">owner</option>
          <option value="ADMIN">admin</option>
        </select>
      </td>
      <td>
        <button onClick={onDetailClick}>상세보기</button>
        <button onClick={handleDelete}>삭제</button>
      </td>
    </tr>
  );
}
