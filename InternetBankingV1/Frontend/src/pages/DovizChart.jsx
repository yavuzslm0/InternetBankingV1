// 📁 DovizChart.jsx
import React, { useEffect, useState } from "react"; 
import {
  AreaChart, Area, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
} from "recharts"; // Recharts kütüphanesinden grafik komponentleri
import { fetchChartData } from "../services/dovizService"; 
import { format, parseISO } from "date-fns"; 
import { tr } from "date-fns/locale"; // Tarih formatlama kütüphanesi ve Türkçe lokalizasyon
import "../css/DovizChart.css"; // ✅ CSS stil dosyası

export default function DovizChart() {
  const [data, setData] = useState([]); // Grafik verisi state'i
  const [loading, setLoading] = useState(true); // API çağrısı süresi boyunca yükleniyor durumu
  const [days, setDays] = useState(7); // Son kaç günlük veriyi göstereceğimiz
  const [chartType, setChartType] = useState("area"); // Grafik tipi (area veya line)

  useEffect(() => {
    // Component mount olduğunda veya "days" değiştiğinde çalışır
    const getRates = async () => {
      try {
        const rates = await fetchChartData(days); 
        // API’den veya servis katmanından veriyi al
        setData(rates); // state’i güncelle
      } catch (error) {
        console.error("Grafik verisi alınamadı:", error); // Hata loglama
      } finally {
        setLoading(false); // API tamamlandı, yükleniyor durumu false
      }
    };

    getRates(); // API çağrısını başlat
  }, [days]); // "days" değiştiğinde tekrar çalışır

  // Dinamik min/max değerlerini hesapla
  const allRates = data.flatMap((d) => [d.usdRate, d.eurRate]).filter(Boolean);
  const minRate = Math.min(...allRates);
  const maxRate = Math.max(...allRates);

  // ✅ Custom Tooltip component
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      let formattedDate = label;
      try {
        formattedDate = format(parseISO(label), "d MMM ''yy", { locale: tr });
      } catch (e) {
        console.warn("Tarih formatlanamadı:", e); // Hata durumunda uyarı
      }

      return (
        <div className="custom-tooltip">
          <p className="tooltip-date">{formattedDate}</p>
          {payload.map((entry, idx) => (
            <div key={idx} className="tooltip-value">
              <p className="tooltip-label">{entry.name}</p>
              <p className={`tooltip-price ${entry.dataKey}`}>
                {entry.value.toFixed(3)} ₺
              </p>
            </div>
          ))}
        </div>
      );
    }
    return null; // Tooltip aktif değilse null döndür
  };

  return (
    <div className="chart-container">
      {/* Başlık ve kontrol butonları */}
      <div className="chart-header">
        <h3 className="chart-title">USD & EUR / TRY Kur Grafiği</h3>
        <div className="chart-controls">
          {/* Gün seçimi butonları */}
          {[7, 30, 90].map((d) => (
            <button
              key={d}
              onClick={() => setDays(d)} // days state’i değişir, useEffect tetiklenir
              className={`chart-button ${days === d ? "active" : ""}`}
            >
              {d}G
            </button>
          ))}

          {/* Grafik tipi seçim butonları */}
          <button
            onClick={() => setChartType("area")}
            className={`chart-button ${chartType === "area" ? "active-type" : ""}`}
          >
            Area
          </button>
          <button
            onClick={() => setChartType("line")}
            className={`chart-button ${chartType === "line" ? "active-type" : ""}`}
          >
            Line
          </button>
        </div>
      </div>

      {/* Yükleniyor ve veri yok kontrolü */}
      {loading ? (
        <p className="admin-error">Yükleniyor...</p> // API çağrısı devam ediyor
      ) : data.length === 0 ? (
        <p>Veri alınamadı.</p> // Veri gelmedi
      ) : (
        <ResponsiveContainer height={400}>
          {chartType === "area" ? (
            <AreaChart
              data={data} // Grafik verisi
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              {/* Gradient renkler */}
              <defs>
                <linearGradient id="usdColor" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff1a1aff" stopOpacity={0.95} />
                  <stop offset="90%" stopColor="#ff1a1a" stopOpacity={0.2} />
                </linearGradient>
                <linearGradient id="eurColor" x1="0" y1="0" x2="0" y2="0.8">
                  <stop offset="5%" stopColor="#0066ffff" stopOpacity={0.95} />
                  <stop offset="90%" stopColor="#0066ffff" stopOpacity={0} />
                </linearGradient>
              </defs>

              <XAxis
                dataKey="date" // x ekseni tarih
                tickFormatter={(date) => format(new Date(date), "dd MMM ''yy", { locale: tr })}
              />
              <YAxis
                domain={[minRate * 0.93, maxRate * 1.01]} // min/max oranları biraz genişlet
                tickFormatter={(value) => value.toFixed(3)}
              />
              <Tooltip content={<CustomTooltip />} /> {/* Özel tooltip */}
              
              {/* USD grafiği */}
              <Area
                type="linear" // çizgi tipi (monotone: yumuşak eğri)
                dataKey="usdRate"
                stroke="#cc0000"
                strokeWidth={1.5} // çizgi kalınlığı
                fill="url(#usdColor)" // gradient dolgu
                name="USD/TRY"
              />

              {/* EUR grafiği */}
              <Area
                type="linear"
                dataKey="eurRate"
                stroke="#0033cc"
                strokeWidth={1.5}
                fill="url(#eurColor)"
                name="EUR/TRY"
              />
            </AreaChart>
          ) : (
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 10, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                tickFormatter={(date) => format(new Date(date), "dd MMM ''yy", { locale: tr })}
              />
               <YAxis
                domain={[minRate * 0.93, maxRate * 1.01]} // min/max oranları biraz genişlet
                tickFormatter={(value) => value.toFixed(3)}
              />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              
              <Line
                type="monotone"
                dataKey="usdRate"
                stroke="#b30000"
                strokeWidth={2}
                name="USD/TRY"
              />
              <Line
                type="monotone"
                dataKey="eurRate"
                stroke="#0044cc"
                strokeWidth={2}
                name="EUR/TRY"
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
}
