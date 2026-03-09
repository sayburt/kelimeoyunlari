---
name: veri-yonetimi
description: Kelime verisi ve kullanıcı verisi (Supabase/LocalStorage) yönetim kuralları.
---

# Kelime — Veri Yönetimi

## 1. Kelime Verisi (kelime-data.json)
- Köken: `public/kelime-data.json`.
- Erişim: Sadece `services/wordService.ts` üzerinden.
- Mantık: Kelimeler harf sayılarına göre filtrelenir. Karşılaştırmalar Türkçe büyük harf (`toLocaleUpperCase('tr-TR')`) ile yapılır.

## 2. Kullanıcı Verisi ve Auth
- **Misafir Mod:** Veriler `localStorage` (Web) veya `AsyncStorage` (Mobil) üzerinde tutulur.
- **Aktarım:** Kullanıcı giriş yaptığında yerel veriler `services/migrationService.ts` üzerinden Supabase'e taşınır.
- **Supabase Tabloları:** `profiles`, `game_stats`, `game_score_events`, `badges`, `game_likes`.
- **Haftalık Puan:** `game_score_events` tablosundaki o hafta içindeki tüm skorların toplamıdır.
- **En Yüksek Puan (High Score):** `game_stats.high_score` kolonu her oyun için en yüksek tekil skoru tutar.

## 3. Supabase Kurulum ve Yönetim Kuralı (⚠️ KESİN KURAL)
- **Tüm Supabase işlemleri (yeni tablo oluşturma, RLS politikaları yazma, Auth ayarları, kolon ekleme vb.) YALNIZCA AI (Asistan) tarafından Supabase MCP aracı kullanılarak yapılmalıdır.**
- **Migration Takibi:** Yapılan her veritabanı değişikliği (DDL) için `supabase/migrations` klasörü altında anlamlı bir isimlendirme ile (örn: `0001_create_new_feature_table.sql`) bir dosya oluşturulmalıdır.
- **Uygulama:** AI, önce SQL dosyasını oluşturur, ardından bu SQL içeriğini `apply_migration` aracı ile doğrudan projeye uygular.
- **Branch Yönetimi:** Eğer bir branch silinecekse, o branch ile gelen migrasyon dosyalarındaki işlemlerin tersi (DROP) SQL ile uygulanmalı ve veritabanı eski haline getirilmelidir.
- **ASLA** kullanıcıya manuel SQL çalıştırma veya dashboard üzerinde işlem yapma talimatı verilemez.

## 4. RLS Kuralları
Supabase tarafında her tabloda RLS aktif olmalı; kullanıcılar sadece kendi verilerine (`auth.uid() = user_id`) erişebilmelidir. AI bu politikaları tablo oluştururken otomatik uygular.

## 5. Oyun İçerikleri (Games Data)
- **Kapsam:** Oyunların başlıkları, açıklamaları, oynanış istatistikleri ve en önemlisi **"Nasıl Oynanır?" (instructions)** nesneleri tek bir merkezden yönetilir.
- **Konum:** `src/data/games.ts`
- **İlişki:** Oyun sayfalarında (SEO metinleri) ve ana sayfadaki bilgi ikonlarında bu veri tüketilir. Bir oyunun metinleri güncellenecekse UI üzerinden değil `games.ts` üzerinden güncellenmelidir.

## 6. Yetenek (Skill) Koordinasyonu
- **"Nasıl Oynanır?" Bileşen Bağlantısı:** Verinin UI tarafında nasıl render edileceği ve SEO yapısı için `oyun-standartlari` yeteneğinin "Nasıl Oynanır?" bölümüne bakınız.
- **Tasarım Standartları:** Supabase'den veya lokalden dönen hata mesajları, uyarılar ve renkler için `tasarim-sistemi` referans alınmalıdır.

## 7. Puanlama ve Liderlik Mantığı
- **Puan Kaydı:** Her oyun bittiğinde `scoreService.saveGameResult` çağrılmalıdır. Bu servis hem `game_stats` tablosunu (en yüksek puan ve istatistikler) hem de `game_score_events` tablosunu (haftalık toplam için) otomatik günceller.
- **Liderlik Sorguları:**
    - **Haftalık (Weekly):** O hafta başına (`getCurrentWeekStartISO`) göre `game_score_events` tablosunda `sum(score)` yapılarak hesaplanır.
    - **Tüm Zamanlar (All-Time):** `game_stats` tablosunda `high_score` kolonuna göre azalan sırada (`order by high_score desc`) listelenir.
- **Eş Zamanlı Güncelleme:** Liderlik tablosu `supabase.channel('game_score_events')` üzerinden `INSERT` olaylarını dinleyerek real-time güncellenmelidir.
