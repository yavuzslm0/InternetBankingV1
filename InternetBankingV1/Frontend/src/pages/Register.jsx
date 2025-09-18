import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [tc, setTc] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    if (tc.length !== 11) {
      setError("TC Kimlik No 11 haneli olmalıdır.");
      return;
    }

    try {
      await registerUser(tc, password, email, name, surname);
      setError("");
      navigate("/"); // kayıt sonrası login sayfasına yönlendir
    } catch (err) {
      setError(err.message || "Kayıt sırasında bir hata oluştu!");
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <img src="/logo.png" alt="Ziraat Bankası" className="logo" />
        <h2>Kayıt Ol</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="T.C. / Yabancı Kimlik Numaranız"
            value={tc}
            onChange={(e) => setTc(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Adınız"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Soyadınız"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Mail Adresiniz"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
          <button type="submit">Kayıt Ol</button>
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{ marginTop: "10px" }}
          >
            Geri Dön
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
