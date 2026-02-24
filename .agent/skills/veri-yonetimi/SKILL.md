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

## 3. Supabase Kurulum ve Yönetim Kuralı (⚠️ KESİN KURAL)
- **Tüm Supabase işlemleri (yeni tablo oluşturma, RLS politikaları yazma, Auth ayarları, kolon ekleme vb.) YALNIZCA AI (Asistan) tarafından Supabase MCP aracı kullanılarak yapılmalıdır.**
- **ASLA** kullanıcıya manuel SQL çalıştırma veya dashboard üzerinde işlem yapma talimatı verilemez. AI, gerekli tüm SQL migration'larını kendi `apply_migration` aracı ile doğrudan projeye uygular.
- Eğer çalışma yetki hatası (privilege error) veriyorsa, önce Proje ID'sinin doğruluğu kontrol edilmeli, ardından MCP üzerinden tekrar denenmelidir.

## 4. RLS Kuralları
Supabase tarafında her tabloda RLS aktif olmalı; kullanıcılar sadece kendi verilerine (`auth.uid() = user_id`) erişebilmelidir. AI bu politikaları tablo oluştururken otomatik uygular.

## 5. Oyun İçerikleri (Games Data)
- **Kapsam:** Oyunların başlıkları, açıklamaları, oynanış istatistikleri ve en önemlisi **"Nasıl Oynanır?" (instructions)** nesneleri tek bir merkezden yönetilir.
- **Konum:** `src/data/games.ts`
- **İlişki:** Oyun sayfalarında (SEO metinleri) ve ana sayfadaki bilgi ikonlarında bu veri tüketilir. Bir oyunun metinleri güncellenecekse UI üzerinden değil `games.ts` üzerinden güncellenmelidir.

## 6. Yetenek (Skill) Koordinasyonu
- **"Nasıl Oynanır?" Bileşen Bağlantısı:** Verinin UI tarafında nasıl render edileceği ve SEO yapısı için `oyun-standartlari` yeteneğinin "Nasıl Oynanır?" bölümüne bakınız.
- **Tasarım Standartları:** Supabase'den veya lokalden dönen hata mesajları, uyarılar ve renkler için `tasarim-sistemi` referans alınmalıdır.
