---
name: veri-yonetimi
description: Kelime verisi ve kullanıcı verisi (Supabase/LocalStorage) yönetim kuralları.
---

# Kelime — Veri Yönetimi

## 1. Kelime Verisi (kelime-data.json)
- Köken: Proje kökündeki `kelime-data.json`.
- Erişim: Sadece `services/wordService.ts` üzerinden.
- Mantık: Kelimeler harf sayılarına göre filtrelenir. Karşılaştırmalar Türkçe büyük harf (`toLocaleUpperCase('tr-TR')`) ile yapılır.

## 2. Kullanıcı Verisi ve Auth
- **Misafir Mod:** Veriler `localStorage` (Web) veya `AsyncStorage` (Mobil) üzerinde tutulur.
- **Aktarım:** Kullanıcı giriş yaptığında yerel veriler `services/migrationService.ts` üzerinden Supabase'e taşınır.
- **Supabase Tabloları:** `profiles`, `game_stats`, `badges`, `game_likes`.

## 3. Supabase Kurulum ve Yönetim Kuralı (ÖNEMLİ)
- **Tüm Supabase işlemleri (yeni tablo oluşturma, RLS politikaları yazma, Auth ayarları, kolon ekleme vb.) YALNIZCA AI (Asistan) tarafından Supabase MCP aracı kullanılarak yapılmalıdır.**
- Kullanıcı manuel olarak Supabase arayüzünden işlem yapmaz. AI, gerekli tüm SQL migration'larını kendi `apply_migration` aracı ile doğrudan projeye uygular.

## 4. RLS Kuralları
Supabase tarafında her tabloda RLS aktif olmalı; kullanıcılar sadece kendi verilerine (`auth.uid() = user_id`) erişebilmelidir. AI bu politikaları tablo oluştururken otomatik uygular.

