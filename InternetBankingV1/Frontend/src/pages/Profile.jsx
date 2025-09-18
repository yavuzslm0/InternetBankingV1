import { useEffect, useState } from "react";
import { getMe } from "../services/authService"; // servis katmanından çekiyoruz
import "../css/Profile.css";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getMe(); // servis fonksiyonu kullanılıyor
        setUser(data);
      } catch (err) {
        console.error("Profil çekme hatası:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div className="admin-error">Yükleniyor...</div>;
  if (!user) return <div>Kullanıcı bilgisi bulunamadı.</div>;

  return (
    <div className="profile-container">
      <h1>Profilim</h1>
      <div className="profile-info">
        <p><strong>AD :</strong> {user.name}</p>
        <p><strong>SOYAD :</strong> {user.surname}</p>
        <p><strong>TC NO :</strong> {user.tc}</p>
        <p><strong>EMAİL :</strong> {user.email}</p>
        <p><strong>ROL :</strong> {user.role}</p>
      </div>
    </div>
  );
}
