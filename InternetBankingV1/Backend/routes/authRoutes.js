// routes/authRoutes.js
import { Router } from "express";
import { register, login, me, logout } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout); 
router.get("/me", authMiddleware, me);

export default router;
