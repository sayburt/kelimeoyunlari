---
name: proje-kurallari
description: Kelime Oyunları projesi temel mimari ve akış kuralları. Her türlü backend, frontend veya mobil geliştirme öncesi mutlaka oku.
---

# Kelime Oyunları — Proje Kuralları

## 1. Mimari Prensipler
- **Yalnızca Türkçe:** Platformda her şey Türkçe karakter desteğiyle inşa edilir.
- **Servis Katmanı:** Veri okuma/yazma işlemleri (Supabase veya LocalStorage) asla doğrudan bileşen içinde yapılmaz. Mutlaka `services/` altındaki servis fonksiyonları kullanılır.
- **Oyun Bazlı Puanlama:** Projede evrensel bir toplam puanlama sistemi yoktur. Her oyunun (Wordle, Boggle vb.) kendi puanlama formülü ve liderlik tablosu bulunur. Başarı oyun bazında takip edilir.
- **Veri Kaynağı:** Kelime verisi `public/kelime-data.json` dosyasından okunur. Veritabanına (Supabase) taşınmaz.

## 2. Teknoloji Stack
- **Web:** Next.js (App Router) + TypeScript + TailwindCSS + Framer Motion.
- **Mobil:** React Native + Expo + NativeWind + Reanimated.

## 3. Supabase Yönetimi (⚠️ KESİN KURAL)
- Supabase işlemleri (migration, schema changes, functions) için **Supabase CLI** kullanılmalıdır.
- AI (Asistan) doğrudan veritabanı manipülasyonu yerine, yerelde migration dosyaları oluşturup CLI üzerinden işlem yapılmasına rehberlik eder.
- Detaylar için `veri-yonetimi` skill'ine başvurunuz.

## 4. Dosya Yapısı (Web)
```
src/
  app/               → Sayfalar
  components/
    ui/              → Shadcn (Genel UI)
    game/            → Ortak Oyun Bileşenleri
  services/          → Veri ve Mantık (Supabase, LocalStorage, WordService)
  hooks/             → useAuth, useGame, useSound
  lib/               → supabase.ts, storage.ts
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
