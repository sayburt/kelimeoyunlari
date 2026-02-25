# Kelime Projesi - Geliştirme Görevleri (TASKS)

Bu dosya projenin adım adım nasıl geliştirileceğini tanımlar. Geliştirme süreci fazlara ayrılmıştır. **Tüm adımlar `prd.md` ve `.agent/skills/` altındaki kurallara uygun olarak gerçekleştirilmelidir.**

---

## 🛡️ Altyapı ve Güvenlik Standartları

- [x] **Supabase Migration Takibi:** Tüm DB değişiklikleri `supabase/migrations` altında dosyalanır ve rollback (geri dönme) imkanı sağlanır.

---

## 🎮 FAZ 5: Gelişmiş Oyun Mekanikleri ve Puanlama

Oyun deneyimini daha profesyonel, rekabetçi ve eğlenceli hale getirecek temel özelliklerin entegrasyonu.

- [x] **5.1. Saat ve Zaman Yönetimi**
  - [x] Oyun sırasında geçen süreyi milisaniye hassasiyetinde takip eden bir timer sisteminin `useGame` hook'una eklenmesi.
  - [x] Zamanın duraklatılması (modal açıkken) ve oyun sonunda sürenin dondurulması.
  - [x] UI Refinement: Formatı saniye düzeyine çekme ve mobil uyumlu tasarımı iyileştirme.
- [x] **5.2. Joker (İpucu) Sistemi**
  - [x] Her oyun için belirli sayıda "Joker" hakkı tanımlanması.
  - [x] Wordle için: "Rastgele bir doğru harfi aç" fonksiyonunun yazılması ve UI entegrasyonu.
  - [x] Joker butonunun hamburger menü dışına, erişilebilir alana konumlandırılması.
  - [x] Joker kullanımının puanlama üzerindeki negatif etkisinin belirlenmesi.
- [x] **5.3. Gerçek Puanlama Sistemi Entegrasyonu**
  - [puanlama-sistemi.md](docs/puanlama-sistemi.md) dökümanındaki formüllerin (`Taban + Deneme + Zaman x GW`) kodlanması.
  - `scoreService.ts` dosyasının sadece galibiyet değil, hesaplanan bu kompleks puanı da kaydedecek şekilde güncellenmesi.
- [x] **5.4. Rozet (Achievement) ve Eşik Sistemi**
  - [puanlama-sistemi.md](docs/puanlama-sistemi.md) dökümanındaki prestijli puan eşiklerinin (`1M`, `2.5M` vb.) kontrol mekanizmasının yazılması.
  - Eşik aşıldığında kullanıcıya anlık bildirim (toast/celebration) gösterilmesi ve rozetin `badges` tablosuna işlenmesi.
- [x] **5.5. Oyun State Persistence (Kalıcılık)**
  - Mevcut tahminlerin, aktif sürenin ve kullanılan jokerlerin `localStorage` / `Supabase` üzerinden anlık takibi.

---

---

## 🏆 FAZ 6: Sosyal ve Rekabetçi Özellikler (Meydan Okuma)

Kullanıcılar arası etkileşimi ve rekabeti artıracak paylaşım mekanizmaları.

- [x] **6.1. Challenge (Meydan Okuma) Mantığı**
  - Belirli bir kelimeyi veya oyun sonucunu "meydan okuma" olarak işaretleme sistemi.
- [x] **6.2. Paylaşım ve URL Yapısı**
  - `oyun-standartlari` skill'ine uygun dinamik link ve metadata (OG tags) üretimi.
- [x] **6.3. Meydan Okuma İstatistiklerinin Ayrı Tutulması**
  - `challenge_stats` tablosu oluşturulması: kullanıcı başına gönderilen / katılan / kazanılan / en iyi skor alanları.
  - `challengeService.updateChallengeResult()` içinde `challenge_stats` tablosunun `upsert` ile güncellenmesi.
  - `profileService` üzerinden `challenge_stats` verisinin `ProfileData`'ya eklenmesi.
- [x] **6.4. Liderlik Tablosu Geliştirmeleri**
  - Belirli meydan okumalara özel skor tablolarının oluşturulması (`challenge_stats` tablosu baz alınır).

---

## 👤 FAZ 7: Gelişmiş Üye Paneli ve İstatistikler

Kullanıcının gelişimini detaylı analiz edebileceği ve profilini kişiselleştirebileceği alan.

- [x] **7.1. Detaylı İstatistik Analitiği ve Profil Sayfası Yeniden Tasarımı**
  - Profil sayfasının sekme (tab) mimarisine geçirilmesi: **"Normal Oyunlar"** ve **"Meydan Okumalar"** sekmeleri.
  - **Normal Oyunlar sekmesi:** Mevcut `game_stats` tabanlı oyun istatistikleri (tahmin dağılımları, kazanma oranı, seri).
  - **Meydan Okumalar sekmesi:** `challenge_stats` tabanlı — Gönderilen / Katılan / Kazanılan / En İyi Skor özet kartları ve başarı çubuğu.
  - Misafir kullanıcılar için her iki sekmede de kilitli/CTA durumu gösterilmesi.
- [x] **7.2. Profil Özelleştirme**
  - Avatar seçimi, kullanıcı adı güncelleme ve hesap yönetimi ekranları.
- [x] **7.3. Başarı (Achievement) Sistemi**
  - `proje-kurallari` çerçevesinde rozet ve başarı kriterlerinin görselleştirilmesi.

---

## 📱 FAZ 8: Mobil Uygulama (Expo)

Web platformu tüm özellikleriyle (Tema, Devam Etme, Sosyal) mükemmelleştikten sonra mobile geçiş süreci.

- [ ] **8.1. Expo Proje Kurulumu**
  - React Native (Expo) projesinin kurulması. NativeWind ve gerekli paketlerin eklenmesi.
- [ ] **8.2. Mobil Mimari Uyarlaması**
  - Web'deki `services/` mantığının `proje-kurallari` skill'ine uygun şekilde mobile uyarlanması. `LocalStorage` yerine `AsyncStorage` kullanımı.
- [ ] **8.3. Mobil UI / UX Uyarlaması**
  - Oyun Board'u ve klavyenin mobil cihaza göre boyutlandırılması ve `tasarim-sistemi` standartlarının mobil adaptasyonu.

---

## 🎨 Bekleyen İyileştirmeler (UI/UX)

- [x] **Header (Navigasyon) Mobil Uyumluluk ve UX Revizyonu**
  - [x] Tema değiştirme (dark/light toggle) butonunun sadece ikon (Ay/Güneş) olacak şekilde sadeleştirilmesi.
  - [x] "Giriş" ve "Kayıt Ol" metinli butonlarının kaldırılarak sağ üste sadece tek bir Kullanıcı (User) ikonu eklenmesi.
  - [x] Kullanıcı ikonuna tıklandığında açılacak (dropdown) modern ve projenin tasarım sistemine uygun bir menü yapılması, Giriş/Kayıt seçeneklerinin bu menüye taşınması.
  - [x] Logoların, tema ve kullanıcı ikonlarının aynı hizada, estetik boşluklarla (flex, justify-between, items-center) mobilde şık duracak şekilde optimize edilmesi.

---

## ✅ TAMAMLANAN GÖREVLER (ARŞİV)

<details>
<summary><b>Faz 1: Altyapı ve Temel Kurulum</b></summary>

- [x] **1.1. Next.js Proje Kurulumu**
  - Next.js projesinin (App Router, TypeScript, TailwindCSS) oluşturulması.
- [x] **1.2. Tasarım Sistemi Entegrasyonu**
  - `tailwind.config.ts` dosyasının `tasarim-sistemi` skill'ine uygun şekilde güncellenmesi.
- [x] **1.3. Kelime Verisi ve WordService**
  - `services/wordService.ts` dosyasının `veri-yonetimi` kurallarına göre oluşturulması.
- [x] **1.4. Supabase Entegrasyonu**
  - Supabase tablolarının ve RLS politikalarının `proje-kurallari` kapsamında uygulanması.
- [x] **1.5. Kullanıcı ve Auth İşlemleri**
  - `migrationService.ts` ve `useAuth.ts` hook'unun `proje-kurallari` standartlarında yazılması.
- [x] **1.6. Temel UI Bileşenleri (Shadcn ve Custom)**
</details>

<details>
<summary><b>Faz 2: Oyun Altyapısı ve İlk Kelime Oyunları</b></summary>

- [x] **2.1. Ortak Oyun Bileşenlerinin Hazırlanması**
  - `GameCard`, `LetterCell` ve `GameKeyboard` bileşenlerinin `oyun-standartlari` skill'ine uygun hazırlanması.
- [x] **2.2. Oyun Mantığı (Global State)**
  - `hooks/useGame.ts` hook'unun `proje-kurallari` mimarisinde oluşturulması.
- [x] **2.3. Oyun 1: Wordle (Kelime Tahmin)**
  - `oyun-standartlari` skill'ine uygun Wordle mekaniğinin geliştirilmesi.
- [x] **2.4. Oyun İstatistiklerinin Kaydedilmesi**
  - `services/scoreService.ts` üzerinden `veri-yonetimi` kurallarına göre kayıt.
</details>

<details>
<summary><b>Faz 3: Profil, İstatistik ve Son Dokunuşlar</b></summary>

- [x] **3.1. Profil ve İstatistik Sayfası**
- [x] **3.2. Ses Sistemi (Sound Effect)**
- [x] **3.3. Animasyon İyileştirmeleri**
- [x] **3.4. Üretim (Production) Hazırlığı**
  - `seo-uzmani` skill'ine göre meta etiketlerinin ve OG görsellerinin optimize edilmesi.
</details>

<details>
<summary><b>Faz 4: Tema Sistemi (Karanlık / Aydınlık Mod)</b></summary>

- [x] **4.1. Tema Altyapısı ve Context Kurulumu**
  - `next-themes` veya custom Context ile tema yönetiminin kurulması.
  - `tasarim-sistemi` skill'ine uygun renk paletlerinin (Light/Dark) `globals.css` içinde tanımlanması.
- [x] **4.2. UI Bileşenlerinin Tema Uyumluluğu**
  - Tüm Shadcn ve custom bileşenlerin (Board, Klavye vb.) iki modda da kusursuz görünmesi.
- [x] **4.3. Kullanıcı Tercihi Senkronizasyonu**
  - Tercihlerin `veri-yonetimi` kurallarına göre LocalStorage ve (giriş yapılmışsa) Supabase profiles tablosunda saklanması.
</details>
