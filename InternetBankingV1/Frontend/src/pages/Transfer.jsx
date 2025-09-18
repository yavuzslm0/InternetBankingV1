import { useEffect, useState } from "react";
import { socket } from "../services/socket"; // socket.io istemcisi
import { sendMoney, getBalance } from "../services/transferService"; // API çağrı fonksiyonları
import "../css/Transfer.css";

export default function Transfer() {
  // Kullanıcının anlık bakiyesi
  const [balance, setBalance] = useState(0);
  // Transfer form verileri
  const [formData, setFormData] = useState({
    toIban: "",
    toName: "",
    amount: "",
    description: "",
  });

  // Modal mesajı ve kontrolü
  const [modalMessage, setModalMessage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // ===================== BAKİYEYİ ÇEK =====================
  useEffect(() => {
    // Component mount olduğunda bakiye getir
    const fetchBalance = async () => {
      try {
        const b = await getBalance(); // backend'den bakiye döner
        setBalance(b); // state'i güncelle
      } catch (err) {
        // Hata durumunda console'a bas (kullanıcıya göstermeyi burada yönetebilirsin)
        console.error("Bakiye alınırken hata:", err);
      }
    };
    fetchBalance();
  }, []); // boş bağımlılık -> sadece ilk renderda çalışır

  // ===================== SOCKET.IO BAKİYE GÜNCELLEME =====================
  useEffect(() => {
    // Sunucudan "balanceUpdate" event'i geldiğinde setBalance ile güncelle
    // setBalance referansı sabittir, bu yüzden doğrudan handler kullanmak güvenlidir.
    socket.on("balanceUpdate", setBalance);

    // component unmount olduğunda listener'ı kaldır
    return () => {
      socket.off("balanceUpdate");
    };
  }, []); // boş -> sadece mount/unmount sırasında

  // ===================== FORM INPUT HANDLE =====================
  const handleChange = (e) => {
    // Generic input handler: input name attribute'u ile state'i güncelliyoruz
    // Örn: name="toIban" olduğunda formData.toIban güncellenir
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ===================== TRANSFER İŞLEMİ =====================
  const handleSubmit = async (e) => {
    e.preventDefault(); // formun sayfayı yenilemesini engeller

    // Basit client-side doğrulama: tüm alanların dolu olması gerekli
    if (!formData.toIban || !formData.toName || !formData.amount) {
      setModalMessage("Lütfen Tüm Alanları Doldurun.");
      setIsModalOpen(true);
      return;
    }

    try {
      // amount string olduğu için Number ile dönüştür; server tarafında tekrar kontrol edilmeli
      const res = await sendMoney({
        toIban: formData.toIban,
        toName: formData.toName,
        amount: Number(formData.amount),
        description: formData.description,
      });

      // Başarılıysa formu temizle ve kullanıcıya sunucu mesajını göster
      setFormData({ toIban: "", toName: "", amount: "", description: "" });
      setModalMessage(res.message); // sendMoney'den dönen mesaj
      setIsModalOpen(true);
    } catch (err) {
      // Hata: sunucudan dönen hata mesajı varsa onu, yoksa genel bir mesaj göster
      setModalMessage(err?.message || "Transfer Başarısız.❌");
      setIsModalOpen(true);
    }
  };

  return (
    <div className="transfer-container">
      <h2 className="transfer-title">Para Transferi</h2>

      <div className="transfer-balance">
        Güncel Bakiyeniz: <b>{balance} ₺</b>
      </div>

      <form onSubmit={handleSubmit} className="transfer-form">
        <input
          type="text"
          name="toIban"
          value={formData.toIban}
          onChange={handleChange}
          placeholder="TR IBAN"
          className="transfer-input"
          maxLength={26}
          autoComplete="off"
        />
        <input
          type="text"
          name="toName"
          value={formData.toName}
          onChange={handleChange}
          placeholder="Adı Soyadı"
          className="transfer-input"
          autoComplete="off"
        />
        <input
          type="number"
          name="amount"
          value={formData.amount}
          onChange={handleChange}
          placeholder="Tutar"
          min="1"
          className="transfer-input"
        />
        <input
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Açıklama (Opsiyonel)"
          className="transfer-textarea"
          autoComplete="off"
        />
        <button type="submit" className="transfer-button">
          Gönder
        </button>
      </form>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal modal-animate">
            <p>{modalMessage}</p>
            <button onClick={() => setIsModalOpen(false)}>Kapat</button>
          </div>
        </div>
      )}
    </div>
  );
}
