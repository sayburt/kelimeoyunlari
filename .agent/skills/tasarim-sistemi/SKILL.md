---
name: tasarim-sistemi
description: Kelime Oyunları projesi renk, tipografi ve UI bileşen kuralları.
---

# Kelime Oyunları — Tasarım Sistemi

## 1. Tema ve Renkler
Kullanıcı tercihine veya sistem ayarına bağlı olarak **Light** ve **Dark** modları desteklenir.
- **Arka Plan:** (Dark) Koyu lacivert `#0E1628` / (Light) Açık gri `#F7F9FC`
- **Kart Yüzeyleri:** (Dark) Koyu gri-mavi `#1E293B` / (Light) Beyaz `#FFFFFF`
- **Footer Arka Plan:** (Dark) `#070B14` / (Light) `#F1F5F9`
- **Ana Metin:** (Dark) Açık gri `#E5E7EB` / (Light) Koyu lacivert `#0F172A`
- **İkincil Metin:** (Dark) Gri `#94A3B8` / (Light) Gri-mavi `#475569`
- **Ana Vurgu (CTA):** Canlı turkuaz `#22D3EE` (Light mod için daha koyu `#0284C7`)
- **Başarı / Doğru:** Yeşil `#22C55E`
- **Hata / Yanlış:** Kırmızı `#EF4444`

## 2. Tipografi
- **Font:** Nunito (Google Fonts).
- **Önemli:** Türkçe karakterler (ğ, ş, ı, ö, ü, ç) her zaman tam desteklenmeli.
- **Büyük Harf:** Oyun içi karşılaştırmalarda `toLocaleUpperCase('tr-TR')` kullanılır.

## 3. UI Bileşen Sınırları
- **Shadcn Kullanımı:** Navbar, Footer, Modal, Ayarlar, Formlar.
- **Custom Tailwind Kullanımı:** Oyun Board'u, Harf Hücreleri, Klavye, Joker Butonları.

## 4. Düzen ve Animasyon
- Oyun ekranlarında dikey scroll olmaz (`overflow-hidden`).
- Butonlar mobil erişilebilirlik için minimum **48px** yüksekliğindedir.
- Animasyonlar Framer Motion (Web) veya Reanimated (Mobil) ile yapılır, 180-250ms arasındadır.
- **Premium hover/active efektleri:** `premium-btn` sınıfı ile `translateY(-1px)` hover, `translateY(0)` active.

## 5. Premium Derinlik Kuralları (Glassmorphism & Depth)

### a) CSS Token'lar (`globals.css`)
Tüm premium efekt değerleri CSS değişkenleri ile yönetilir (Dark/Light ayrımı otomatik):
- `--theme-glass-bg` — Header glassmorphism arka plan
- `--theme-glass-border` — Glass sınır rengi
- `--theme-card-glass` — Kart glassmorphism arka plan
- `--theme-hero-glow` — Hero alanı radial gradient
- `--theme-premium-shadow` — Standart derinlik gölgesi
- `--theme-premium-shadow-hover` — Hover derinlik gölgesi
- `--theme-footer-bg` / `--theme-footer-border` — Footer ayrımı

### b) Utility Class'lar
- `.glass-header` — Navbar ve GameHeader için (blur-16px + glass-bg + header-shadow)
- `.glass-surface` — Modaller ve dropdown'lar için (blur-12px + card-glass + border)
- `.premium-card` — Kartlar için (blur-8px + depth + hover translateY)
- `.premium-btn` — Butonlar için (hover translateY-1px, active 0px)
- `.premium-shadow` — Genel derinlik gölgesi
- `.hero-glow` — Sayfa arkaplanı radial gradient
- `.premium-footer` — Footer ayrımı (farklı bg + border-top)

### c) Atmosfer Farklılaştırma
- **Dark mod:** Sinematik → blur ağırlıklı, gradient'ler belirgin, shadow'lar derin
- **Light mod:** Editorial → kağıt hissi, beyaz alan ağırlıklı, shadow'lar hafif
- **Kural:** Aynı layout, farklı atmosfer. Abartısız, kontrollü derinlik.

### d) Yasaklar
- ❌ Glow efekti kartlarda kullanılmaz (sadece CTA butonlarında hafif shadow-primary)
- ❌ Kalın border (`border-2`) yerine `border` (1px) + glass-border used
- ✅ Derinlik sadece shadow + translateY ile sağlanır

## 6. Yetenek (Skill) Koordinasyonu
Bu tasarım sistemi projenin görsel kurallarını belirler. Geliştirme yaparken:
- Oyun arayüzüne özel kullanıcı deneyimi (UX) yerleşimleri ve "Nasıl Oynanır?" görselleri için `oyun-standartlari` yeteneğine bakınız.
- Projede renk kodları veya metinler (özellikle oyun içi açıklamalar) değiştiğinde, oyun talimatlarının ana kaynağı olan `veri-yonetimi` yeteneğindeki **Oyun İçerikleri (Games Data)** kuralına uygun hareket ediniz.
