import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { loginUser } from "../services/authService"; // ✅ backend login servisi

function Login() {
  const navigate = useNavigate();
  const [tc, setTc] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    if (tc.length !== 11) {
      setError("TC Kimlik No 11 haneli olmalıdır.");
      return;
    }

    try {
      // ✅ backend login isteği
      await loginUser(tc, password);
      setError("");
      navigate("/dashboard"); // giriş başarılı → dashboard
    } catch (err) {
      setError(
        err.response?.data?.message || "TC Kimlik No veya Şifre hatalı!"
      );
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <img src="/logo.png" alt="Ziraat Bankası" className="logo" />
        <h3>İnternet Şubemize Hoş Geldiniz</h3>
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="TC Kimlik / Müşteri Numaranız"
            value={tc}
            onChange={(e) => setTc(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Şifreniz"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p style={{ color: "#b30000", fontSize: "14px", margin: "5px" }}>
              {error}
            </p>
          )}

          <button type="submit">Giriş Yap</button>

          <button
            type="button"
            onClick={() => navigate("/register")}
            style={{ marginTop: "10px" }}
          >
            Kayıt Ol
          </button>

          <p style={{ marginTop: "13px", marginBottom: "-2px" }}>
            <a
              href="/reset-password"
              style={{ color: "#b30000", textDecoration: "none" }}
            >
              Şifremi Unuttum?
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
