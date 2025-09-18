import { NavLink } from "react-router-dom";  // Sayfa geçişleri için router'ın NavLink componentini alıyoruz
import { useState } from "react";            // Sidebar'ı açıp kapatmak için state hook'unu alıyoruz
import "../css/Sidebar.css";                 // CSS dosyasını import ediyoruz

export default function Sidebar() {
  // collapsed: sidebar daraltılmış mı?
  // setCollapsed: sidebar'ın durumunu değiştiren fonksiyon
  const [collapsed, setCollapsed] = useState(false);

  // Sidebar'daki menü öğeleri (sayfaların adresi, adı, ikonu)
  const items = [
    { to: "/dashboard", label: "Hesaplarım", icon: "🏦" },
    { to: "/transfer", label: "Transfer", icon: "💸" },
    { to: "/transactions", label: "Hesap Hareketleri", icon: "📅" },
    { to: "/converter", label: "Çevirici", icon: "💱" },
    { to: "/chart", label: "Kur Grafiği", icon: "📈" },
    { to: "/cards", label: "Kartlarım", icon: "💳" },
    { to: "/settings", label: "Ayarlar", icon: "⚙️" },
    { to: "/help", label: "Yardım", icon: "❓" },
    { to:"/admin", label: "Admin Paneli", icon: "👨‍💼" },
  ];

  return (
    // collapsed true ise sidebar'a ekstra bir CSS sınıfı ekleniyor
    <aside className={collapsed ? "sidebar sidebar--collapsed" : "sidebar"}>
      
      {/* Menü linklerini döngüyle yazdırıyoruz */}
      <nav className="nav">
        {items.map((it) => (
          <NavLink
            key={it.to}     // React için unique key
            to={it.to}      // Hangi sayfaya gideceğini belirtiyor
            className={({ isActive }) =>
              "nav-item " + (isActive ? "active" : "") // aktif sayfa ise "active" class ekle
            }
          >
            {/* Menü ikonu */}
            <span className="nav-icon">{it.icon}</span>
            {/* Eğer sidebar daraltılmamışsa label (yazı) göster */}
            {!collapsed && <span className="nav-label">{it.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Sidebar'ın alt kısmında aç/kapat butonu */}
      <div style={{ marginTop: "auto" }}>
        <button
          onClick={() => setCollapsed((v) => !v)} // Butona basıldığında collapsed state tersine çevrilir
          className={`sidebar-btn ${collapsed ? "collapsed" : ""}`}
        >
          {/* Eğer kapalıysa ▶ göster, açıksa ◀ göster */}
          <span className="nav-icon">{collapsed ? "▶" : "◀"}</span>
          {/* Eğer sidebar kapalı değilse "Kapat" yazısını da göster */}
          {!collapsed && <span className="btn-text">Kapat</span>}
        </button>
      </div>
    </aside>
  );
}
