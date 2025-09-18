// components/AccountCard.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMe } from "../services/authService"; 
import { socket } from "../services/socket"; 
import "../css/accountCard.css";

export default function AccountCard() {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({
    accountNumber: "",
    balance: 0,
    iban: "",
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getMe(); // API çağrısı artık servis üzerinden
        setUserData({
          accountNumber: data.accountNumber || "",
          balance: data.balance ?? 0,
          iban: data.iban || "",
        });
      } catch (err) {
        console.error("Kullanıcı bilgisi çekilemedi:", err);
      }
    };

    fetchUserData();

    // 🔴 Socket ile bakiye güncellemelerini dinle
    socket.on("balanceUpdate", (newBalance) => {
      setUserData((prev) => ({
        ...prev,
        balance: newBalance,
      }));
    });

    return () => {
      socket.off("balanceUpdate");
    };
  }, []);

  return (
    <div className="account-card">
      <h2 className="account-title">Hesaplarım</h2>
      <div className="account-card-icon">
        <img src="/hesap-img2.png" alt="Defter" />
      </div>
      <h3 className="account-card-bank">ZİRAAT SÜPER ŞUBE</h3>
      <div className="account-info-list">
        <div className="account-info-row">
          <span className="account-label">Hesap No</span>
          <span className="account-value">{userData.accountNumber}</span>
        </div>
        <div className="account-info-row">
          <span className="account-label">Bakiye</span>
          <span className="account-value">{userData.balance} ₺</span>
        </div>
        <div className="account-info-row">
          <span className="account-label">IBAN</span>
          <span className="account-value account-value--mono">
            {userData.iban}
          </span>
        </div>
      </div>
      <div className="account-card-footer">
        <button
          className="account-card-btn account-card-btn--primary"
          onClick={() => navigate("/transfer")}
        >
          Para Transferi
        </button>
        <button
          className="account-card-btn"
          onClick={() => navigate("/transactions")}
        >
          Hesap Hareketlerim
        </button>
      </div>
    </div>
  );
}
