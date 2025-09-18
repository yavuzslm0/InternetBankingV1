// models/User.js

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    tc: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6, },
    role: { type: String, enum: ["user", "admin"], required: true, default: "user" },
    balance: { type: Number, required: true, default: 1000 },
    accountNumber: { type: String, required: true, unique: true },
    iban: { type: String, required: true, unique: true }, 
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
