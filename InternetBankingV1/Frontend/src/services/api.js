// src/services/api.js
import axios from "axios"; // HTTP istekleri yapmak için axios paketini import ediyoruz

// Axios instance'ı oluşturuyoruz
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
});

export default api; // Bu instance'ı diğer dosyalarda kullanabilmek için export ediyoruz
