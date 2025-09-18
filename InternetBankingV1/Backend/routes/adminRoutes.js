// routes/adminRoutes.js
import express from "express";
import { getAllUsers, deleteUser, updateUserRole } from "../controllers/adminController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import adminMiddleware from "../middleware/adminMiddleware.js";

const router = express.Router();

// 🔒 Tüm route’lar önce auth, sonra admin middleware ile korunuyor
router.get("/users", authMiddleware, adminMiddleware, getAllUsers);
router.delete("/users/:id", authMiddleware, adminMiddleware, deleteUser);
router.patch("/users/:id/role", authMiddleware, adminMiddleware, updateUserRole);

export default router;
