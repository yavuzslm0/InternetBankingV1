// config/db.js
import mongoose from "mongoose"; // MongoDB ile iletişim kurmak için Mongoose kütüphanesini import ediyoruz

// MongoDB bağlantısını başlatan asenkron fonksiyon
const connectDB = async () => {
  try {
    // MongoDB'ye .env dosyasındaki MONGO_URI ile bağlanıyoruz
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB bağlantısı başarılı"); // Bağlantı başarılıysa konsola mesaj yazdır
  } catch (error) {
    // Bağlantı hatası olursa burası çalışır
    console.error("❌ MongoDB bağlantı hatası:", error.message); // Hata mesajını konsola yazdır
    process.exit(1); // Hata oluşursa Node.js uygulamasını durdur
  }
};

export default connectDB; // Bu fonksiyonu başka dosyalarda kullanmak için export ediyoruz
