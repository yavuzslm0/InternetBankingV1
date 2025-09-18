// services/authService.js

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Token oluşturma
const signToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "1d",
  });

// IBAN & hesap numarası üretme
function generateAccountNumber() {
  let accountNumber = "";
  for (let i = 0; i < 22; i++) {
    accountNumber += Math.floor(Math.random() * 10);
  }
  return accountNumber;
}

function generateIban() {
  const countryCode = "TR";
  const checkDigits = "00";
  const accountNumber = generateAccountNumber();
  return { iban: countryCode + checkDigits + accountNumber, accountNumber };
}

// Kullanıcı oluşturma (register)
export const registerService = async ({ tc, email, password, name, surname }) => {
  if (!tc?.trim() || !email?.trim() || !password?.trim() || !name?.trim() || !surname?.trim()) {
    throw new Error("Lütfen tüm alanları doldurun");
  }

  const existsEmail = await User.findOne({ email });
  if (existsEmail) throw new Error("Email zaten kayıtlı");

  const existsTc = await User.findOne({ tc });
  if (existsTc) throw new Error("TC zaten kayıtlı");

  const hash = await bcrypt.hash(password, 10);

  const { iban, accountNumber } = generateIban();

  const user = await User.create({
    tc,
    email,
    password: hash,
    name,
    surname,
    iban,
    accountNumber,
    balance: 1000,
  });

  const token = signToken(user._id, user.role);

  return { user, token };
};

// Kullanıcı giriş (login)
export const loginService = async ({ tc, password }) => {
  if (!tc?.trim() || !password?.trim()) throw new Error("T.C Numaranız ve şifre gerekli");

  const user = await User.findOne({ tc });
  if (!user) throw new Error("Kullanıcı bulunamadı");

  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error("Şifre hatalı");

  const token = signToken(user._id, user.role);

  return { user, token };
};

// Kullanıcı bilgilerini çekme (me)
export const getMeService = async (userId) => {
  const user = await User.findById(userId).select("-password");
  if (!user) throw new Error("Kullanıcı bulunamadı");
  return user;
};
