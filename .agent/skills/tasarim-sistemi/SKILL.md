---
name: tasarim-sistemi
description: Kelime Oyunları projesi renk, tipografi ve UI bileşen kuralları.
---

# Kelime Oyunları — Tasarım Sistemi

## 1. Tema ve Renkler
Tek statik tema kullanılır. Dark/Light seçici yoktur.
- **Arka Plan:** Koyu lacivert (`#0F172A`)
- **Kart Yüzeyleri:** Koyu gri-mavi (`#1E293B`)
- **Ana Metin:** Açık gri (`#E5E7EB`)
- **İkincil Metin:** Gri (`#94A3B8`)
- **Ana Vurgu (CTA):** Canlı turkuaz (`#22D3EE`)
- **Başarı / Doğru:** Yeşil (`#22C55E`)
- **Hata / Yanlış:** Kırmızı (`#EF4444`)

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
