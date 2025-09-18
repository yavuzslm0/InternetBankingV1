// services/transferService.js
import api from "./api"; // global axios instance

// ======================== PARA GÖNDERME ========================
export const sendMoney = async ({ toIban, toName, amount, description }) => {
  try {
    const response = await api.post("/transactions/send", {
      toIban,
      toName,
      amount,
      description,
    });
    return response.data; // { message, transaction }
  } catch (err) {
    console.error("sendMoney Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ======================== BAKİYE ÇEKME ========================
export const getBalance = async () => {
  try {
    const res = await api.get("/auth/me");
    return res.data.balance;
  } catch (err) {
    console.error("Bakiye çekme hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};
