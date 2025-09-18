// services/transactionService.js
import api from "./api";

// ======================== TRANSACTION HISTORY ========================
// Kullanıcının gönderdiği ve aldığı tüm işlemleri döndürür
export const getTransactionHistory = async () => {
  try {
    const res = await api.get("/transactions/history");
    return res.data.transactions; // sadece transactions döndür
  } catch (err) {
    console.error("getTransactionHistory Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
