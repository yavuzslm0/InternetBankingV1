import { Link } from "react-router-dom"; // React Router'dan Link komponentini import ediyoruz (sayfa geçişleri için)
import { logoutUser } from "../services/authService"; // Backend logout işlemi için fonksiyon
import { useNavigate } from "react-router-dom"; // Sayfa yönlendirmeleri için hook
import { disconnectSocket } from "../services/socket";
import "../css/Navbar.css";

export default function TopMenuScroller() {
  const navigate = useNavigate(); // Sayfa yönlendirmek için hook'u kullanıyoruz

  // Logout butonuna basınca çalışacak fonksiyon
  const handleLogout = async () => {
    try {
      disconnectSocket();      // Socket bağlantısını kopar
      await logoutUser();      // Backend'e logout isteği gönder
      navigate("/login");      // Başarılı ise kullanıcıyı login sayfasına yönlendir
    } catch (err) {
      console.error("Logout failed:", err); // Hata varsa konsola yaz
    }
  };

  return (
    <nav className="navbar"> {/* Navbar ana container */}
      <div className="navbar-logo-wrapper"> {/* Logo wrapper */}
        <Link to="/dashboard"> {/* Logo tıklanınca dashboard sayfasına git */}
          <img
            src="/Ziraat-Bankasi-Symbol.PNG" // Logo resmi
            alt="Ziraat Bankası"              // Alternatif metin
            className="navbar-logo"           // CSS class
          />
        </Link>
      </div>

      {/* Menü Linkleri */}
      <ul className="navbar-links"> {/* Menü liste container */}
        <li><Link to="/dashboard">Ana Sayfa</Link></li> {/* Ana sayfa linki */}
        <li><Link to="/profile">Profil</Link></li>     {/* Profil sayfası linki */}
        <li>
          <button 
            onClick={handleLogout}                     // Çıkış butonuna basınca logout çalışır
            className="logout-button"                  // CSS class
          >
            Çıkış
          </button>
        </li>
      </ul>
    </nav>
  );
}
