import { useEffect, useState } from "react"; // React hook'larını import ediyoruz: state ve effect
import { getTransactionHistory } from "../services/transactionService"; // Backend'den transaction geçmişini çeken servis
import "../css/Transactions.css"; // Sayfa stil dosyası

export default function Transactions() {
  // ===================== STATE TANIMLARI =====================
  const [transactions, setTransactions] = useState([]); // Kullanıcının işlem geçmişi
  const [loading, setLoading] = useState(true);         // Yükleniyor durumu (spinner vs.)
  const [error, setError] = useState("");               // Hata mesajı

  // ===================== USEEFFECT: SAYFA AÇILDIĞINDA VERİ ÇEK =====================
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        // Backend'e istek atarak işlem geçmişini al
        const data = await getTransactionHistory();
        setTransactions(data); // Alınan veriyi state'e kaydet
      } catch (err) {
        // Hata durumunda hata mesajını set et
        setError(err.message || "İşlem geçmişi alınamadı.");
      } finally {
        // İstek tamamlandıktan sonra loading durumunu kapat
        setLoading(false);
      }
    };
    fetchTransactions(); // Async fonksiyonu çağır
  }, []); // [] dependency array → component mount olduğunda çalışır

  return (
    <div className="transactions-page">
      <h2>Hesap Hareketleri</h2>

      {loading && <p className="admin-error">Yükleniyor...</p>}
      {error && <p className="error">{error}</p>}

      {!loading && !error && (
        <table className="transactions-table">
          <thead>
            <tr>
              <th>Tarih</th>
              <th>Gönderen</th>
              <th>Alıcı</th>
              <th>Tutar</th>
              <th>Açıklama</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 && (
              <tr>
                <td colSpan="6">Henüz işlem yok</td>
              </tr>
            )}
            {transactions.map((tx) => (
              <tr key={tx._id}>
                <td>{new Date(tx.createdAt).toLocaleString()}</td>
                <td>{tx.fromUser?.name || "-"} {tx.fromUser?.surname || "-"}</td>
                <td>{tx.toUser?.name || "-"} {tx.toUser?.surname || "-"} ({tx.toUser?.iban || "-"})</td>
                <td>{tx.amount} ₺</td>
                <td>{tx.description || "-"}</td>
                <td>{tx.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
