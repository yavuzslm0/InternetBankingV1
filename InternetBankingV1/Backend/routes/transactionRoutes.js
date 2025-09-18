// routes/transactionRoutes.js

import { Router } from "express";
import { sendMoney, getTransactionHistory } from "../controllers/transactionController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = Router();

router.post("/send", authMiddleware, sendMoney);
router.get("/history", authMiddleware, getTransactionHistory);

export default router;
