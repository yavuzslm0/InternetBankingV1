// src/pages/AdminPanel.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers, removeUser, changeUserRole } from "../services/adminService"; // servis fonksiyonları
import "../css/adminPanel.css";

export default function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers(); // servis çağrısı
        setUsers(data);
      } catch (err) {
        if (err.status === 403 || err.status === 401) {
          setError("Yetkiniz yok. 3 saniye içinde Anasayfa’ya yönlendiriliyorsunuz...");
        } else {
          setError("Kullanıcıları getirirken bir hata oluştu");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [navigate]);

  const deleteUser = async (id) => {
    if (!window.confirm("Bu kullanıcıyı silmek istediğinize emin misiniz?")) return;
    try {
      await removeUser(id);
      setUsers(users.filter((u) => u._id !== id));
    } catch {
      alert("Kullanıcı silinirken bir hata oluştu");
    }
  };

  const updateRole = async (id, role) => {
    try {
      const newRole = role === "admin" ? "user" : "admin";
      const updatedUser = await changeUserRole(id, newRole);
      setUsers(users.map((u) => (u._id === id ? updatedUser : u)));
    } catch {
      alert("Rol güncellenirken bir hata oluştu");
    }
  };

  if (loading) return <div className="admin-error">Loading...</div>;
  if (error) return <div className="admin-error">{error}</div>;

  return (
    <div className="admin-panel">
      <h2>Kullanıcı Listesi</h2>
      <div className="admin-table-wrapper">
        <table className="admin-table">
          <thead>
            <tr>
              <th>T.C.</th>
              <th>Ad</th>
              <th>Soyad</th>
              <th>Email</th>
              <th>Rol</th>
              <th>İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>{user.tc}</td>
                <td>{user.name}</td>
                <td>{user.surname}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>
                  <button className="admin-btn delete" onClick={() => deleteUser(user._id)}>Sil</button>
                  <button className="admin-btn role" onClick={() => updateRole(user._id, user.role)}>
                    {user.role === "admin" ? "User Yap" : "Admin Yap"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
