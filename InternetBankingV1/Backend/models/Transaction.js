// models/Transaction.js

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    fromUser: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    toUser: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    amount: { 
      type: Number, 
      required: true,
      min: 1 
    },
    status: { 
      type: String, 
      enum: ["Beklemede", "Transfer Başarılı.✅", "Transfer Başarısız.❌"], 
      default: "Beklemede" 
    },
    description: { 
      type: String, 
      default: "" // isteğe bağlı açıklama
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
