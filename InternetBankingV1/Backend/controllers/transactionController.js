// controllers/transactionController.js

import { sendMoneyService, getTransactionHistoryService } from "../services/transactionService.js";

// Para gönderme
export const sendMoney = async (req, res) => {
  try {
    const transaction = await sendMoneyService({
      fromUserId: req.user._id,
      ...req.body
    });
    res.status(200).json({ message: "Transfer Başarılı.✅", transaction });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Transaction geçmişi
export const getTransactionHistory = async (req, res) => {
  try {
    const transactions = await getTransactionHistoryService(req.user._id);
    res.status(200).json({ transactions });
  } catch (err) {
    res.status(500).json({ message: "Sunucu hatası", error: err.message });
  }
};
