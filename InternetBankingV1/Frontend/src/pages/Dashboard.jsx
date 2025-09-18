import React, { useMemo, useState } from "react";
import "../css/Dashboard.css";
import AccountCard from "../components/AccountCard"; // Özel bir hesap özeti component'i

export default function Dashboard() {
  // ===================== KART VERİLERİ =====================
  const cards = [
    { id: 1, title: "Hesaplarım", content: "Hesap özeti ve bakiye bilgileri burada…" },
    { id: 2, title: "Süper Şube", content: "Müşteri grubu, hedefler, kampanyalar…" },
    { id: 3, title: "Kredi Kartlarım", content: "Kart listesi ve hızlı başvuru…" },
    { id: 4, title: "Yatırım", content: "Portföy dağılımı ve son işlemler…" },
    { id: 5, title: "Ödemeler", content: "Fatura, kurum ve düzenli ödeme…" },
    { id: 6, title: "Döviz & Altın", content: "Anlık kurlar ve alarm kur…" },
    { id: 7, title: "Kesin Ödeme", content: "Bekleyen talimatlar ve onaylar…" },
    { id: 8, title: "Kolay Limit", content: "Hızlı limit başvurusu…" },
    { id: 9, title: "Açık Bankacılık", content: "Bağlı banka hesapların…" },
  ];

  // ===================== SAYFALAMA (HER SAYFADA 3 KART) =====================
  const pages = useMemo(() => {
    const out = [];
    for (let i = 0; i < cards.length; i += 3) 
      out.push(cards.slice(i, i + 3)); // 3'erli kart grupları oluştur
    return out;
  }, [cards]);
  // useMemo → cards değişmediği sürece pages yeniden hesaplanmaz

  const [page, setPage] = useState(0); // Başlangıç sayfası

  // ===================== SAYFA GEÇİŞ FONKSİYONLARI =====================
  const prevPage = () => setPage((p) => Math.max(0, p - 1)); // Geri tuşu, 0'ın altına düşmez
  const nextPage = () => setPage((p) => Math.min(pages.length - 1, p + 1)); // İleri tuşu, max sayfayı geçmez

  // ===================== RENDER =====================
  return (
    <div className="dash3-viewport">
      {/* Sol ok butonu */}
      <button
        className="dash3-nav dash3-nav--left"
        onClick={prevPage}
        disabled={page === 0} // Eğer ilk sayfadaysa tıklanamaz
      >
        ‹
      </button>

      {/* Kart maskesi ve kaydırma alanı */}
      <div className="dash3-mask">
        <div
          className="dash3-track"
          style={{ transform: `translateX(-${page * 100}%)` }} 
          // CSS transform ile sayfa kaydırma
        >
          {pages.map((group, gIdx) => (
            <div className="dash3-slide" key={gIdx}>
              <div className="dash3-grid">
                {group.map((card, idx) => {
                  const globalIndex = gIdx * 3 + idx; // Kartın toplam indexi
                  const toneClass = globalIndex % 2 === 0 ? "is-white" : "is-gray"; // Alternatif renk

                  // Eğer ilk kartsa AccountCard component'i render et
                  if (globalIndex === 0) {
                    return (
                      <div className={`dash3-card ${toneClass}`} key={card.id}>
                        <AccountCard /> {/* Özel component */}
                      </div>
                    );
                  }

                  // Diğer kartlar normal render
                  return (
                    <article className={`dash3-card ${toneClass}`} key={card.id}>
                      <header className="dash3-card-head">
                        <h2 className="dash3-card-title">{card.title}</h2>
                      </header>
                      <div className="dash3-card-body">
                        <p>{card.content}</p>
                      </div>
                      <footer className="dash3-card-foot">
                        <button className="dash3-btn dash3-btn--primary">İşleme Git</button>
                        <button className="dash3-btn">Detay</button>
                      </footer>
                    </article>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sağ ok butonu */}
      <button
        className="dash3-nav dash3-nav--right"
        onClick={nextPage}
        disabled={page === pages.length - 1} // Son sayfadaysa tıklanamaz
      >
        ›
      </button>
    </div>
  );
}
