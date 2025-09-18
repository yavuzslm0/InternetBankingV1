// middleware/authMiddleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export default async function authMiddleware(req, res, next) {
  try {
    // Cookie'den token al
    const token = req.cookies?.token;

  
    if (!token) {
      return res.status(401).json({ message: "Yetkilendirme yok" });
    }

    // Token'i doğrula
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Kullanıcıyı bul
    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      console.log("Kullanıcı bulunamadı, 401 dönecek");
      return res.status(401).json({ message: "Kullanıcı bulunamadı" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.log("JWT doğrulama hatası:", err.message);
    return res.status(401).json({ message: "Geçersiz veya süresi dolmuş token" });
  }
}
