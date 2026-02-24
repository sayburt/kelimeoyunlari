# Kelime Projesi - Geliştirme Görevleri (TASKS)

Bu dosya projenin adım adım nasıl geliştirileceğini tanımlar. Geliştirme süreci fazlara ayrılmıştır. Tüm adımlar `prd.md` ve `.agent/skills/` altındaki kurallara uygun olarak gerçekleştirilmelidir.

---

## FAZ 1: Altyapı ve Temel Kurulum (Web)

Bu fazda Next.js projesi kurulacak, tasarım sistemi (Tailwind), veri okuma servisi ve genel UI bileşenleri hazırlanacaktır.

- [x] **1.1. Next.js Proje Kurulumu**
  - Next.js projesinin (App Router, TypeScript, TailwindCSS) oluşturulması.
  - Gereksiz dosyaların temizlenmesi ve `src/` mimarisinin kurulması.
- [x] **1.2. Tasarım Sistemi Entegrasyonu**
  - `tailwind.config.ts` dosyasının `tasarim-sistemi` skill'ine uygun şekilde güncellenmesi (renkler, fontlar, vb.).
  - `layout.tsx` dosyasında Nunito fontunun ve global background yapısının tanımlanması.
- [x] **1.3. Kelime Verisi ve WordService**
  - `kelime-data.json` dosyasının projenin kök dizininde kalması.
  - `services/wordService.ts` dosyasının oluşturulması (kelime okuma, filtreleme ve doğrulama mantığı).
- [x] **1.4. Supabase Entegrasyonu (Yapay Zeka Tarafından Yönetilir)**
  - Tıpkı proje kurallarında belirtildiği gibi; tablo oluşturma, RLS politikaları yazma ve Auth yapılandırması **yalnızca AI (Asistan) tarafından MCP kullanılarak** yapılacaktır.
  - Supabase tablolarının (`profiles`, `game_stats`, `badges`, `game_likes`) ve RLS politikalarının `apply_migration` ile projeye uygulanması.
  - `@supabase/supabase-js` kütüphanesinin projeye eklenmesi ve `lib/supabase.ts` bağlantısının yapılması.
- [x] **1.5. Kullanıcı ve Auth İşlemleri**
  - Giriş/Kayıt sayfalarının (Supabase Auth ile) oluşturulması.
  - LocalStorage (misafir mod) ve Supabase aktarımını (`migrationService.ts`) sağlayacak altyapının kurulması.
  - `hooks/useAuth.ts` hook'unun yazılması.
- [x] **1.6. Temel UI Bileşenleri (Shadcn ve Custom)**
  - Gerekli Shadcn bileşenlerinin (örneğin butonlar, form elemanları) kurulması.
  - Navbar ve Footer gibi genel Layout bileşenlerinin oluşturulması.

---

## FAZ 2: Oyun Altyapısı ve İlk Kelime Oyunları

Bu fazda oyunların ortak altyapısı yazılacak ve planlanan ilk kelime oyunları devreye alınacaktır.

- [x] **2.1. Ortak Oyun Bileşenlerinin Hazırlanması**
  - `GameCard` (Oyun liste sayfasında gösterilecek kart tasarımı).
  - Oyun Board'u (Harf hücreleri `LetterCell`, Klavye `GameKeyboard`).
  - Ortak oyun Header'ı (Ses açma/kapama, yardım vb.)
- [x] **2.2. Oyun Mantığı (Global State)**
  - `hooks/useGame.ts` hook'unun oluşturulması (Oyun durum yönetimi, tahmin mantığı vb.).
- [x] **2.3. Oyun 1: Wordle (Kelime Tahmin)**
  - Normal "Wordle" klonunun geliştirilmesi (Mevcut `kelime-data.json` üzerinden).
  - Oyun bitiş, kazanma/kaybetme animasyonları.
- [x] **2.4. Oyun İstatistiklerinin Kaydedilmesi**
  - Oyun bittikten sonra sonuçların `services/scoreService.ts` üzerinden LocalStorage veya Supabase'e kaydedilmesi.

---

## FAZ 3: Profil, İstatistik ve Son Dokunuşlar (Web)

Kullanıcının gelişimini görebileceği sayfalar ve genel iyileştirmeler.

- [x] **3.1. Profil ve İstatistik Sayfası**
  - Kullanıcının toplam oynadığı oyunlar, kazandığı oyunlar, streak durumları ve kazandığı rozetlerin gösterilmesi.
- [x] **3.2. Ses Sistemi (Sound Effect)**
  - `hooks/useSound.ts` hook'u ile oyundaki başarı/hata seslerinin uygulanması.
- [x] **3.3. Animasyon İyileştirmeleri**
  - Framer Motion kullanılarak geçişlerin, başarı veya yanlış harf girdiği (shake) animasyonların eklenmesi.
- [x] **3.4. Üretim (Production) Hazırlığı**
  - Performans kontrolleri, kullanılmayan dosyaların temizlenmesi ve son hata kontrolleri.

---

## FAZ 4: Mobil Uygulama (Expo)

Web projesi başarılı olduktan sonra aynı mantık ile mobil mimarinin kurulması.

- [ ] **4.1. Expo Proje Kurulumu**
  - React Native (Expo) projesinin kurulması. NativeWind ve gerekli paketlerin eklenmesi.
- [ ] **4.2. Mobil Mimari Uyarlaması**
  - Web'deki `services/` mantığının (özellikle wordService ve Supabase) mobile uyarlanması. `LocalStorage` yerine `AsyncStorage` kullanımı.
- [ ] **4.3. Mobil UI / UX Uyarlaması**
  - Oyun Board'u ve klavyenin mobil cihaza göre boyutlandırılması ve optimize edilmesi.
