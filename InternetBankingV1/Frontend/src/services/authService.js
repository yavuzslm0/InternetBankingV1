// services/authService.js
import api from "./api"; // axios instance

// ======================== REGISTER ========================
export const registerUser = async (tc, password, email, name, surname) => {
  try {
    const response = await api.post("/auth/register", {
      tc,
      password,
      email,
      name,
      surname,
    });
    return response.data;
  } catch (err) {
    console.error("registerUser Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ======================== LOGIN ========================
export const loginUser = async (tc, password) => {
  try {
    const response = await api.post("/auth/login", { tc, password }, { withCredentials: true });
    return response.data;
  } catch (err) {
    console.error("loginUser Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ======================== LOGOUT ========================
export const logoutUser = async () => {
  try {
    const response = await api.get("/auth/logout", { withCredentials: true });
    return response.data;
  } catch (err) {
    console.error("logoutUser Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

// ======================== ME ========================
export const getMe = async () => {
  try {
    const response = await api.get("/auth/me", { withCredentials: true });
    return response.data;
  } catch (err) {
    console.error("getMe Hatası:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};