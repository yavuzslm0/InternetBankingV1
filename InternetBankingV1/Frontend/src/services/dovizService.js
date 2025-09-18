// 📁 services/dovizService.js
import axios from "axios"; // HTTP istekleri yapmak için axios paketini import ediyoruz

// API’nin temel URL’i
const BASE_URL = "https://api.frankfurter.app";

// ---- Basit hafıza (in-memory) cache ----
let _latestCache = null; // Son alınan döviz kurları burada saklanacak
const TTL_MS = 30 * 60 * 1000; // Cache geçerlilik süresi = 30 dakika

// ---- /latest endpoint çağrısı ----
async function fetchLatest(symbols = []) {
  // symbols: ['USD','TRY',...] gibi bir array
  const res = await axios.get(`${BASE_URL}/latest`, {
    params: {
      from: "EUR",          // Baz para birimi her zaman EUR
      to: symbols.join(","), // Dönüştürülecek para birimleri
    },
  });

  // API’den dönen veriyi normalize ediyoruz
  return {
    base: res.data.base || "EUR",   // Baz para birimi
    rates: res.data.rates || {},    // Döviz kurları
    date: res.data.date,            // Kurun alındığı tarih
  };
}

// ---- Para birimi sembollerini çekmek ----
export const fetchCurrencySymbols = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/currencies`);
    // API şu formatı döner: { "USD":"US Dollar", "EUR":"Euro", ... }
    return Object.keys(res.data || {}); // sadece semboller
  } catch (e) {
    console.warn("Semboller alınamadı, varsayılan listeye geçiliyor.", e?.message || e);
    return ["EUR", "USD", "GBP", "TRY"]; // hata olursa default liste
  }
};

// ---- /latest ile oran hesaplama ve cache yönetimi ----
async function getLatestRates(symbolsNeeded = []) {
  const now = Date.now(); // Şu anki zaman

  // 1️⃣ Hafızadaki cache geçerli ise kullan
  if (_latestCache && now - _latestCache.timestamp < TTL_MS) {
    const hasAll = symbolsNeeded.every(
      (s) => s === "EUR" || _latestCache.rates[s] != null
    );
    if (hasAll) return _latestCache; // cache geçerli → return
  }

  // 2️⃣ API’den yeni verileri al
  const symbols = Array.from(new Set(["EUR", ...symbolsNeeded])); // EUR her zaman dahil
  const data = await fetchLatest(symbols);

  // Hafızaya kaydet
  _latestCache = { timestamp: now, base: data.base, rates: data.rates };

  return _latestCache; // güncel veriyi döndür
}

// ---- Döviz dönüştürme fonksiyonu ----
export const convertCurrency = async (from, to, amount = 1) => {
  if (!from || !to) throw new Error("from/to zorunlu"); // kontrol
  if (from === to) return amount; // aynı para birimi ise değişmeyecek

  const { rates } = await getLatestRates([from, to]); // güncel kur değerlerini al
  const rateFrom = from === "EUR" ? 1 : rates[from];  // EUR bazlı oran
  const rateTo = to === "EUR" ? 1 : rates[to];

  if (rateFrom == null || rateTo == null) {
    throw new Error("Kur verisi eksik: " + from + "/" + to);
  }

  const fx = rateTo / rateFrom; // dönüştürme oranı
  return amount * fx;           // sonucu döndür
};

// ---- Grafik verisi için son X gün (default 7) ----
export const fetchChartData = async (days = 7) => {
  const end = new Date(); // bugünün tarihi
  const start = new Date(end.getTime() - days * 24 * 60 * 60 * 1000); // geçmiş günler
  const fmt = (d) => d.toISOString().slice(0, 10); // YYYY-MM-DD format

  try {
    // API’den tarih aralığını al
    const res = await axios.get(`${BASE_URL}/${fmt(start)}..${fmt(end)}`, {
      params: { from: "EUR", to: "USD,TRY" },
    });

    const series = res.data.rates || {};
    const daysList = Object.keys(series).sort(); // tarihleri sırala

    return daysList.map((date) => {
      const row = series[date] || {};
      const usd_per_eur = Number(row["USD"]); 
      const try_per_eur = Number(row["TRY"]);

      // 1 USD kaç TRY eder
      const usdTry = usd_per_eur && try_per_eur ? try_per_eur / usd_per_eur : null;
      // 1 EUR kaç TRY eder
      const eurTry = try_per_eur || null;

      return {
        date,                       // YYYY-MM-DD
        usdRate: usdTry ? parseFloat(usdTry.toFixed(3)) : null,
        eurRate: eurTry ? parseFloat(eurTry.toFixed(3)) : null,
      };
    });
  } catch (e) {
    // API çalışmazsa fallback
    console.warn("Grafik verisi alınamadı, fallback'e düşülüyor.", e?.message || e);

    const { rates } = await getLatestRates(["USD", "TRY"]);
    const usd_per_eur = rates["USD"];
    const try_per_eur = rates["TRY"];
    const usdTry = usd_per_eur && try_per_eur ? try_per_eur / usd_per_eur : null;
    const eurTry = try_per_eur ?? null;

    const today = new Date().toISOString().slice(0, 10);
    return [
      {
        date: today,
        usdRate: usdTry ? parseFloat(usdTry.toFixed(3)) : null,
        eurRate: eurTry ? parseFloat(eurTry.toFixed(3)) : null,
      },
    ];
  }
};
