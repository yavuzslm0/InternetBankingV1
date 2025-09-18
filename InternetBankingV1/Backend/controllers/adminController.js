// controllers/adminController.js

import {
  getAllUsersService,
  deleteUserService,
  updateUserRoleService
} from "../services/adminService.js";

// Tüm kullanıcıları çek
export const getAllUsers = async (_req, res) => {
  try {
    const users = await getAllUsersService();
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Kullanıcı sil
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id, req.user._id);
    res.json({ message: "Kullanıcı silindi" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Rol güncelle
export const updateUserRole = async (req, res) => {
  try {
    const user = await updateUserRoleService(req.params.id, req.body.role);
    res.json({ message: "Rol güncellendi", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
