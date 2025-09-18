//pages/DovizConverter.jsx
import React, { useState, useEffect } from "react"; 
import { fetchCurrencySymbols, convertCurrency } from "../services/dovizService"; 
import "../css/DovizConverter.css";

export default function Converter() {
  const [amount, setAmount] = useState(""); // Kullanıcının girdiği miktar
  const [fromCurrency, setFromCurrency] = useState("USD"); // Çevirilecek para birimi
  const [toCurrency, setToCurrency] = useState("TRY"); // Hedef para birimi
  const [result, setResult] = useState(null); // Çeviri sonucu
  const [currencies, setCurrencies] = useState([]); // Para birimi listesi

  // sayfa yüklendiğinde döviz sembollerini al
  useEffect(() => {
    const getCurrencies = async () => {
      try {
        const data = await fetchCurrencySymbols(); // API’den sembolleri çek
        setCurrencies(data); // state’e kaydet
      } catch {
        alert("Para birimleri alınamadı"); // API çalışmazsa uyar
      }
    };
    getCurrencies();
  }, []); // boş array → sadece component mount olduğunda çalışır

  // Döviz çevirme fonksiyonu
  const handleConvert = async () => {
    if (!amount || amount <= 0) {
      alert("Geçerli bir miktar girin"); // negatif veya boş miktar uyarısı
      return;
    }

    try {
      const converted = await convertCurrency(fromCurrency, toCurrency, amount);
      setResult(converted); // sonucu state’e kaydet
    } catch {
      alert("Dönüşüm başarısız"); // API veya hesaplama hatası
    }
  };

  return (
    <div className="converter-container">
      <h2 className="converter-title">Döviz Çevirici</h2>
      {/* Miktar inputu */}
      <input
        type="number"
        value={amount}
        min="0"
        onChange={(e) => setAmount(e.target.value)}
        className="converter-input"
        placeholder="Miktar Giriniz"
      />
      {/* Kaynak + hedef para birimi */}
<div className="converter-select-group">
  <select
    value={fromCurrency}
    onChange={(e) => setFromCurrency(e.target.value)}
    className="converter-select"
  >
    {currencies.map((cur) => (
      <option key={cur} value={cur}>
        {cur}
      </option>
    ))}
  </select>

  <span className="converter-arrow">⇄</span>

  <select
    value={toCurrency}
    onChange={(e) => setToCurrency(e.target.value)}
    className="converter-select"
  >
    {currencies.map((cur) => (
      <option key={cur} value={cur}>
        {cur}
      </option>
    ))}
  </select>
</div>
      {/* Çevirme butonu */}
      <button onClick={handleConvert} className="converter-button">
        Çevir <a className="converter-icon">⇄</a>
      </button>
      {/* Çeviri sonucu */}
      {result !== null && (
        <p className="converter-result">
          {amount} {fromCurrency} = {result} {toCurrency}
        </p>
      )}
    </div>
  );
}
