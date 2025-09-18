import { useEffect, useState } from "react"; // React hook’larını import ediyoruz
import { Navigate } from "react-router-dom"; // Sayfa yönlendirmesi için
import api from "../services/api"; // Backend istekleri için axios instance

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true); // API’den doğrulama gelene kadar loading durumu
  const [authenticated, setAuthenticated] = useState(false); // Kullanıcı doğrulandı mı?

  useEffect(() => {
    // Component yüklendiğinde backend’e kimlik doğrulama isteği atıyoruz
    api.get("/auth/me")
      .then(() => setAuthenticated(true)) // Başarılı ise kullanıcı authenticated olarak işaretlenir
      .catch(() => setAuthenticated(false)) // Hata varsa kullanıcı authenticated değil
      .finally(() => setLoading(false)); // API çağrısı bitti, loading false
  }, []); // [] → sadece component mount olduğunda çalışır

  if (loading) return <div className="admin-error">Loading...</div>; 
  // API’den cevap gelene kadar kullanıcıya “Loading…” göster

  if (!authenticated) return <Navigate to="/login" replace />;
  // Kullanıcı doğrulanmamışsa login sayfasına yönlendir
  // replace → history stack’i değiştirme, back ile dönülemez

  return children; 
  // Eğer kullanıcı authenticated ise, ProtectedRoute içine sarılmış component render edilir
}
