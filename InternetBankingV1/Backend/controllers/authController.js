// controllers/authController.js

import { registerService, loginService, getMeService } from "../services/authService.js";

// Register
export const register = async (req, res) => {
  try {
    const { user, token } = await registerService(req.body);
    res.cookie(process.env.COOKIE_NAME || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(201).json({ message: "Kayıt başarılı", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Login
export const login = async (req, res) => {
  try {
    const { user, token } = await loginService(req.body);
    res.cookie(process.env.COOKIE_NAME || "token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000,
      path: "/",
    });
    res.status(200).json({ message: "Giriş başarılı", user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Me
export const me = async (req, res) => {
  try {
    const user = await getMeService(req.user._id);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Logout
export const logout = async (_req, res) => {
  res.clearCookie(process.env.COOKIE_NAME || "token", {
    httpOnly: true,
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
  res.json({ message: "Çıkış yapıldı" });
};
