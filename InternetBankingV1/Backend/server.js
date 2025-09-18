// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import http from "http"; // ← Socket.io için gerekli
import { Server } from "socket.io"; // ← Socket.io import
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js"; // ← Transaction rotası ekledik

dotenv.config();

const app = express();

// 📌 MongoDB bağlantısı
connectDB();

// 📌 JSON body parser
app.use(express.json());

// 📌 Cookie parser
app.use(cookieParser());

// 📌 CORS ayarları
app.use(
  cors({
    origin: ["http://localhost:5173"], // frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// 📌 Basit sağlık kontrol endpointi
app.get("/api/health", (_req, res) => res.json({ ok: true, ts: Date.now() }));

// 📌 Auth rotaları
app.use("/api/auth", authRoutes);

// 📌 Admin rotaları
app.use("/api/admin", adminRoutes);

// 📌 Transaction rotaları
app.use("/api/transactions", transactionRoutes); // ← yeni eklenen rota

// 📌 Global 404 handler
app.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

// 📌 Global error handler
app.use((err, _req, res, _next) => {
  console.error("Global error:", err);
  res.status(err.status || 500).json({ message: err.message || "Server error" });
});

// ======================== SOCKET.IO ENTEGRASYONU ========================

// HTTP sunucusunu oluştur (express ile birlikte)
const server = http.createServer(app);

// Socket.io server
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Socket.io bağlantı dinleme
io.on("connection", (socket) => {
  console.log("Yeni kullanıcı bağlandı, socket id:", socket.id);

  // kullanıcıyı join edebiliriz
  socket.on("join", (userId) => {
    socket.join(userId); // her kullanıcı kendi odasına katılır
    console.log(`Kullanıcı ${userId} odasına katıldı`);
  });

  socket.on("disconnect", () => {
    console.log("Kullanıcı ayrıldı, socket id:", socket.id);
  });
});

// Socket.io objesini global kullanıma açmak için export edebiliriz
export { io };

// 📌 Sunucuyu başlat
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`API + Socket.io listening on http://localhost:${PORT}`);
});
