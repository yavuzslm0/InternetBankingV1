// services/adminService.js

import User from "../models/User.js";

// Tüm kullanıcıları çek
export const getAllUsersService = async () => {
  const users = await User.find().select("-password");
  return users;
};

// Kullanıcı sil
export const deleteUserService = async (userIdToDelete, requestingUserId) => {
  if (userIdToDelete === requestingUserId.toString()) {
    throw new Error("Kendi hesabınızı silemezsiniz");
  }

  const user = await User.findByIdAndDelete(userIdToDelete);
  if (!user) throw new Error("Kullanıcı bulunamadı");

  return user;
};

// Kullanıcı rolünü güncelle
export const updateUserRoleService = async (userId, role) => {
  if (!["user", "admin"].includes(role)) throw new Error("Geçersiz rol");

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true }
  ).select("-password");

  if (!user) throw new Error("Kullanıcı bulunamadı");

  return user;
};
