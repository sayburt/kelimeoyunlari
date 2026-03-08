# pSEO (Programmatic SEO) Stratejisi ve Uygulama Rehberi

Bu döküman, Kelime Oyunları projesi için "çöplük" oluşturmadan, kullanıcı faydasını merkezine alan ve arama motoru standartlarına (Google Helpful Content) uygun bir pSEO altyapısı kurma yol haritasını içerir.

## 1. Temel Prensipler ve Altın Kurallar

Google'ın cezalandırmayacağı, aksine ödüllendireceği bir yapı için şu kurallara sadık kalınacaktır:
*   **Alet (Tool) Mantığı:** Sayfalar "makale" gibi değil, kullanıcının o anki sorununu çözen bir "araç" gibi davranmalıdır.
*   **İnce İçerik (Thin Content) Yasağı:** Sadece bir liste verip bırakmak yerine, o listeye özel istatistikler, ipuçları ve oyun yönlendirmeleri eklenmelidir.
*   **Kademeli Yayın:** Binlerce sayfayı bir anda değil, önce en yüksek hacimli sorgularla başlayarak (taramayı bütçesini koruyarak) yayınlamak.
*   **Hız ve Mobil Uyumluluk:** pSEO sayfaları en hafif ve en hızlı sayfalar olmalıdır.

---

## 2. Uygulama Fazları (Roadmap)

### Faz 1: Altyapı Hazırlığı (Core Engine)
Her yeni sayfada kod yazmamak için esnek bir motor kurulur.
- **Supabase Entegrasyonu:** Kelime listelerinin ve sayfa meta verilerinin veritabanına taşınması.
- **Dinamik Rota Şablonları:** `src/app/games/[gameId]/p/[slug]/page.tsx` gibi genel bir yapı.
- **Sitemap Generator:** Yeni sayfalar eklendikçe `sitemap.ts`'in bunu otomatik algılaması.

### Faz 2: Wordle Pilot Uygulaması (Kelime Bulucu / Solver)
İnternette en çok aratılan "Wordle yardımcı" sorgularına odaklanılır.
- **Kapsam:** 
    - "A ile başlayan 5 harfli kelimeler"
    - "Sonu ET ile biten kelimeler"
    - "İçinde J ve Z olmayan kelimeler" (Negatif filtreleme)
- **Sayfa İçeriği:** 
    - Harf filtresine uyan kelime listesi.
    - Wordle strateji kartları.
    - "Bu kelimenin Wordle'da çıkma olasılığı" gibi matematiksel veriler.

### Faz 3: Adam Asmaca ve Boggle Genişlemesi
Oyun mekaniklerine göre strateji değiştirilir.
- **Adam Asmaca:** "En çok kullanılan Türkçede harf frekansları" ve "Bulmacada sık çıkan kelimeler".
- **Boggle:** "Kök ve Ek (Prefix/Suffix) rehberleri". (Örn: "-MAK/-MEK ile biten 5 harfli kelimeler").

### Faz 4: Karşılaştırma ve Trend Sayfaları
- "Wordle vs [Benzer Oyun]" sayfaları.
- "2026'nın En Popüler Türkçe Kelime Oyunları" gibi listeler.

---

## 3. Oyun Özelinde pSEO Stratejileri

### Wordle
- **Odak:** Teknik çözümleme ve ipuçları.
- **Anahtar Kelime Tipi:** "X harfiyle başlayan 5 harfli..."
- **Değer Önerisi:** Kullanıcıya o günkü oyunu kazandırma.

### Adam Asmaca
- **Odak:** Harf frekansı ve tahmin stratejisi.
- **Anahtar Kelime Tipi:** "İçinde en çok sesli olan 6 harfli kelimeler".
- **Değer Önerisi:** En az hata ile oyun bitirme rehberi.

### Boggle
- **Odak:** Harf bağlama ve kelime türetme.
- **Anahtar Kelime Tipi:** "Kelimelerin sonundaki ekler rehberi".

---

## 4. Dikkat Edilmesi Gereken Teknik Detaylar

1.  **Dinamik Canonical Etiketleri:** Aynı listeyi veren iki farklı URL (Örn: `a-ile-baslayan` ve `a-ile-baslayan-5-harfli`) oluşursa, tek bir ana URL'ye işaret edilmelidir.
2.  **Internal Linking:** pSEO sayfasından mutlaka ana oyuna ("Wordle Oyna") ve diğer ilgili listelere linkler verilmelidir.
3.  **Thin Content Koruması:** Eğer bir filtreleme sonucunda sadece 1-2 kelime listeleniyorsa, o sayfanın 'noindex' (Google'a gösterme) olması sağlanmalıdır. Google "çöp" sayfaları sevmez.
4.  **Otomatik "Unique" İçerik:** Her sayfanın başında yer alacak 1-2 cümlelik açıklama kısımları, belirli şablonlarla ama dinamik verilerle (harf sayısı, kelime sayısı vb.) oluşturulmalıdır.

---

## 5. Başarı Metrikleri
*   **İndekslenme Oranı:** Üretilen sayfaların ne kadarı Google tarafından kabul edildi?
*   **Ortalama Konum:** "5 harfli ..." aramalarında ilk sayfada mıyız?
*   **Hemen Çıkma Oranı:** Kullanıcı sayfayı yararlı bulup listeden sonra oyuna geçiyor mu?

> [!IMPORTANT]
> **Strateji Özeti:** Biz sadece sayfa üretmiyoruz; biz Türkiye'nin en kapsamlı "Kelime Veri Bankası"nı oluşturuyoruz. Google'ı kandırmaya çalışmıyoruz, Google'ın aradığı cevabı en hızlı biz veriyoruz.
