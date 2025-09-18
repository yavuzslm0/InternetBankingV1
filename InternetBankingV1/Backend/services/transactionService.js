import User from "../models/User.js";          // User model (MongoDB)
import Transaction from "../models/Transaction.js"; // Transaction model
import { io } from "../server.js";             // Socket.io sunucusu (anlık bakiye güncelleme için)

// Para gönderme işlemi (backend service layer)
export const sendMoneyService = async ({ fromUserId, toIban, toName, amount, description }) => {

  // 1️⃣ Gönderen kullanıcıyı MongoDB'den bul
  const fromUser = await User.findById(fromUserId);
  if (!fromUser) throw new Error("Gönderen kullanıcı bulunamadı");

  // 2️⃣ Temel input doğrulaması (IBAN, isim, tutar)
  if (!toIban || !toName || !amount || amount <= 0) {
    throw new Error("Geçersiz IBAN, İsim veya Tutar");
  }

  // 3️⃣ Bakiyeyi kontrol et
  if (fromUser.balance < amount) throw new Error("Bakiye yetersiz");

  // 4️⃣ Alıcı kullanıcıyı IBAN üzerinden bul
  const toUser = await User.findOne({ iban: toIban });
  if (!toUser) throw new Error("Hedef IBAN bulunamadı");

  // 5️⃣ Gönderen kendi hesabına transfer yapamaz
  if (fromUser._id.toString() === toUser._id.toString()) {
    throw new Error("Kendi hesabınıza transfer yapamazsınız");
  }

  // 6️⃣ IBAN ve isim doğrulaması
  const fullName = `${toUser.name} ${toUser.surname}`.toLowerCase().trim();
  if (fullName !== toName.toLowerCase().trim()) throw new Error("IBAN ve isim uyuşmuyor");

  // 7️⃣ Yeni transaction nesnesi oluştur (status: Beklemede)
  const transaction = new Transaction({
    fromUser: fromUser._id,
    toUser: toUser._id,
    amount,
    status: "Beklemede",
    description: description || "",
  });

  // 8️⃣ Bakiyeleri güncelle
  fromUser.balance -= amount; // Gönderen bakiyesi azalır
  toUser.balance += amount;   // Alıcı bakiyesi artar

  // 9️⃣ Kullanıcıları MongoDB'ye kaydet
  await fromUser.save();
  await toUser.save();

  // 10️⃣ Transaction durumunu güncelle ve kaydet
  transaction.status = "Transfer Başarılı.✅";
  await transaction.save();

  // 11️⃣ Socket.io ile anlık bakiye güncelleme
  io.to(fromUserId.toString()).emit("balanceUpdate", fromUser.balance);
  io.to(toUser._id.toString()).emit("balanceUpdate", toUser.balance);

  // 12️⃣ Transaction nesnesini frontend’e döndür
  return transaction;
};

// Transaction geçmişi çekme
export const getTransactionHistoryService = async (userId) => {
  const transactions = await Transaction.find({
    $or: [{ fromUser: userId }, { toUser: userId }],
  })
    .populate("fromUser", "name surname iban")
    .populate("toUser", "name surname iban")
    .sort({ createdAt: -1 });

  return transactions;
};
