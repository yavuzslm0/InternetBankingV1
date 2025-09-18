// src/layouts/AuthLayout.jsx
// Giriş/kayıt/reset sayfaları için sade bir layout.
// Basitçe formu ortaya alacak CSS ile birlikte kullan.

import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="auth-container">
      {/* Ortalanmış auth kutusu: Login/Register içerikleri Outlet aracılığıyla gelir */}
      <div className="auth-box">
        <Outlet />
      </div>
    </div>
  );
}
