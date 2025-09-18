// src/services/adminService.js
import api from "./api"; // axios instance

// Tüm kullanıcıları çek
export const getUsers = async () => {
  try {
    const res = await api.get("/admin/users");
    return res.data; // kullanıcı listesi
  } catch (err) {
    // Hata durumunda status bilgisini de atıyoruz
    throw { status: err.response?.status, message: err.response?.data?.message || err.message };
  }
};

// Kullanıcı sil
export const removeUser = async (id) => {
  try {
    await api.delete(`/admin/users/${id}`);
  } catch (err) {
    throw { status: err.response?.status, message: err.response?.data?.message || err.message };
  }
};

// Kullanıcı rolünü güncelle
export const changeUserRole = async (id, newRole) => {
  try {
    const res = await api.patch(`/admin/users/${id}/role`, { role: newRole });
    return res.data.user; // güncellenmiş kullanıcı
  } catch (err) {
    throw { status: err.response?.status, message: err.response?.data?.message || err.message };
  }
};
