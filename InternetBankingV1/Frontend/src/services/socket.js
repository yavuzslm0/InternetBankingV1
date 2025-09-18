// src/services/socket.js
import { io } from "socket.io-client";

// Backend socket server adresi
const SOCKET_URL = "http://localhost:5000"; // backend portuna göre ayarla

// Socket.io client instance
export const socket = io(SOCKET_URL, {
  autoConnect: false, // sadece connectSocket çağrıldığında bağlan
});

// Kullanıcıyı bağla ve backend’deki odasına join et
export const connectSocket = (userId) => {
  if (!socket.connected) {
    socket.connect();
    // Backend "join" eventini dinliyor, ona uygun emit etmeliyiz
    socket.emit("join", userId);
  }
};

// Disconnect fonksiyonu
export const disconnectSocket = () => {
  if (socket.connected) {
    socket.disconnect();
  }
};
