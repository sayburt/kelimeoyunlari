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

## 3. Supabase Yönetimi ve Migration Standardı (⚠️ KESİN KURAL)
- **Araç:** Tüm veritabanı ve Edge Function işlemleri için **Supabase CLI** kullanılır.
- **Migration Takibi:** Yapılan her veritabanı değişikliği (DDL) için `supabase migration new <isim>` komutu ile yeni bir dosya oluşturulmalıdır.
- **Sync (Eşitleme):** Uzak veritabanındaki değişiklikleri yerele çekmek için `supabase db pull` kullanılır.
- **Uygulama:** Lokaldeki değişiklikler `supabase db push` veya `supabase migration up` ile uzak projeye uygulanır.
- **Edge Functions:** Yeni fonksiyonlar `supabase functions new <ad>` ile oluşturulur ve `supabase functions deploy <ad>` ile canlıya alınır.
- **AI Rolü:** AI, gerekli SQL kodlarını hazırlar ve hangi CLI komutlarının çalıştırılması gerektiği konusunda kullanıcıyı yönlendirir. Gereksiz token harcayan MCP araçları kullanılmaz.
- **ASLA** dashboard üzerinden manuel, kontrolsüz DDL işlemi yapılmaz; her şey migration dosyalarında iz bırakmalıdır.

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

## 8. Oyun Kaydetme Standardı (⚠️ ZORUNLU)

Her oyun hook'u (örn: `useGame`, `useBoggle`, `useHangman`, `useWordSearch`, `useWordLadder`) **mutlaka** aşağıdaki persistence pattern'ını uygulamalıdır:

### localStorage Katmanı (Misafir + Üye)
- `useGamePersistence<T>(gameName, status, state, onRestore)` hook'u kullanılmalıdır.
- `status === 'playing'` iken oyun durumu **otomatik** kaydedilir.
- Sayfa yenilendiğinde **otomatik** geri yüklenir.
- Oyun bittiğinde (won/lost) veya yeni oyun başlatıldığında `clearLocal()` çağrılmalıdır.

### Supabase Katmanı (Sadece Giriş Yapmış Üyeler)
- `useGamePersistence` hook'u `saveToCloud`, `loadFromCloud`, `deleteFromCloud` döner.
- Her oyun hook'u bu fonksiyonları sarmalayan 3 standart callback'i **zorunlu olarak** return etmelidir:
  - `saveGameToCloud(): Promise<boolean>` — Mevcut oyunu buluta kaydeder
  - `loadGameFromCloud(): Promise<boolean>` — Buluttan yükler ve `handleRestore` ile uygular
  - `deleteCloudSave(): Promise<void>` — Buluttaki kaydı siler
- Misafir kullanıcılar için bu fonksiyonlar sessizce `false`/`null` döner (localStorage yeterli).

### Genel Kural
- Yeni bir oyun hook'u oluştururken `PersistedXxxState` arayüzü tanımlanmalı ve `useGamePersistence` entegre edilmelidir.
- Örnek implementasyon: `useGame.ts`, `useHangman.ts`.
