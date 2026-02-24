---
name: proje-kurallari
description: Kelime Oyunları projesi temel mimari ve akış kuralları. Her türlü backend, frontend veya mobil geliştirme öncesi mutlaka oku.
---

# Kelime Oyunları — Proje Kuralları

## 1. Mimari Prensipler
- **Yalnızca Türkçe:** Platformda her şey Türkçe karakter desteğiyle inşa edilir.
- **Servis Katmanı:** Veri okuma/yazma işlemleri (Supabase veya LocalStorage) asla doğrudan bileşen içinde yapılmaz. Mutlaka `services/` altındaki servis fonksiyonları kullanılır.
- **Veri Kaynağı:** Kelime verisi kök dizindeki `kelime-data.json` dosyasından okunur. Veritabanına (Supabase) taşınmaz.

## 2. Teknoloji Stack
- **Web:** Next.js (App Router) + TypeScript + TailwindCSS + Framer Motion.
- **Mobil:** React Native + Expo + NativeWind + Reanimated.
- **Backend:** Supabase (Auth & Veritabanı - Profil ve İstatistikler için).

## 3. Dosya Yapısı (Web)
```
src/
  app/               → Sayfalar
  components/
    ui/              → Shadcn (Genel UI)
    game/            → Ortak Oyun Bileşenleri
  services/          → Veri ve Mantık (Supabase, LocalStorage, WordService)
  hooks/             → useAuth, useGame, useSound
  lib/               → supabase.ts, storage.ts
  data/
    kelimeler.json   → (kelime-data.json buraya taşınacak)
```

## 4. Geliştirme Kontrol Listesi
1. İş mantığı veya veri işlemi var mı? → `services/`
2. UI genel bir bileşen mi? (Navbar, Modal vb.) → Shadcn + `components/ui/`
3. UI oyuna özel mi? (Board, Hücre vb.) → Custom Tailwind + `components/game/`
4. Yeni bir özellik ekleniyor mu? → Mutlaka PRD ile uyumu kontrol et.

## 5. İlgili Dokümanlar ve Yetenek (Skill) Koordinasyonu
Bu doküman ana mimariyi belirler. Geliştirmenin alt uzmanlık alanları için aşağıdaki `skill` dokümanlarına **mutlaka** başvurulmalıdır:
- **SEO Standartları ve Sitemap:** `seo-uzmani`
- **Oyun Arayüzü, Deneyimi ve Kartları:** `oyun-standartlari`
- **Renk, Tipografi ve Şablonlar:** `tasarim-sistemi`
- **Veritabanı (Supabase) ve Yerel Kayıtlar:** `veri-yonetimi`
