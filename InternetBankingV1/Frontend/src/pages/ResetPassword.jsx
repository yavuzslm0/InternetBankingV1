import { useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword() {
  const navigate = useNavigate();
  const [tc, setTc] = useState("");
  const [info, setInfo] = useState("");

  const handleReset = (e) => {
    e.preventDefault();
    if (tc.length === 11) {
      setInfo("Şifre sıfırlama talimatı kayıtlı telefonunuza gönderildi.");
      setTimeout(() => navigate("/"), 3000);
    } else {
      setInfo("Geçerli bir TC Kimlik Numarası giriniz!");
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-box">
        <h2>Şifre Sıfırlama</h2>
        <form onSubmit={handleReset}>
          <input
            type="text"
            placeholder="TC Kimlik Numaranız"
            value={tc}
            onChange={(e) => setTc(e.target.value)}
          />
          <button type="submit">Şifre Sıfırla</button>
        </form>
        <button onClick={() => navigate("/")}>Geri Dön</button>
        {info && <p className="info-message">{info}</p>}
      </div>
    </div>
  );
}

export default ResetPassword;
