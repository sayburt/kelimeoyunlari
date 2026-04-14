---
name: tasarim-sistemi
description: Kelime Oyunları projesi renk, tipografi ve UI bileşen kuralları.
---

# Kelime Oyunları — Tasarım Sistemi

## 1. Tema, Renkler ve Atmosfer
Kullanıcı tercihine veya sistem ayarına bağlı olarak **Light** ve **Dark** modları desteklenir.
- **Arka Plan (Dark):** Koyu lacivert `#0E1628` üzerine hafif `.hero-glow` radial gradient uygulanarak sinematik bir his verilir.
- **Arka Plan (Light):** Açık gri `#F7F9FC` üzerine editorial boşluklar ve net hiyerarşi uygulanır.
- **Kart Yüzeyleri:** (Dark) Koyu gri-mavi `#1E293B` / (Light) Beyaz `#FFFFFF`
- **Footer Arka Plan:** (Dark) `#070B14` / (Light) `#F1F5F9`
- **Ana Metin:** (Dark) Açık gri `#E5E7EB` / (Light) Koyu lacivert `#0F172A`
- **İkincil Metin:** (Dark) Gri `#94A3B8` / (Light) Gri-mavi `#475569`
- **Ana Vurgu (CTA):** Canlı turkuaz `#22D3EE` (Light mod için daha koyu `#0284C7`), kritik ikonlarda ve CTA butonlarında kullanılır.
- **Başarı / Doğru:** Yeşil `#22C55E`
- **Hata / Yanlış:** Kırmızı `#EF4444`

## 2. Tipografi
- **Font:** Nunito (Google Fonts).
- **Önemli:** Türkçe karakterler (ğ, ş, ı, ö, ü, ç) her zaman tam desteklenmeli.
- **Büyük Harf:** Oyun içi karşılaştırmalarda `toLocaleUpperCase('tr-TR')` kullanılır.

## 3. UI Bileşen Sınırları
- **Shadcn Kullanımı:** Navbar, Footer, Modal, Ayarlar, Formlar.
- **Custom Tailwind Kullanımı:** Oyun Board'u, Harf Hücreleri, Klavye, Joker Butonları.
- **Klavye Düzenleri (Layouts):**
    - *Q-Klavye (Standart):* Wordle gibi tahmin tabanlı oyunlar için hızlı yazım sağlar.
    - *Alfabetik Ayrışmış (Premium):* Adam Asmaca gibi harf seçme tabanlı oyunlar için sesli ve sessiz harfleri gruplandırır. Sol tarafta genişleyen sesli harfler, sağ tarafta sabit genişlikli sessiz harfler ve aralarında dikey ayraç bulunur.
- **Profil Bileşenleri:** `ProfileInfo`, `StatsCards`, `GameStatsTab`, `ChallengeStatsTab`, `BadgesSection`, `EditProfileModal` gibi modüler alt bileşenler kullanılır.

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

## 6. Avatar ve İkon Standartları

### a) Avatar (Emoji) Sistemi
- Kullanıcı avatarları resim dosyası yerine **Emoji** olarak yönetilir.
- `AvatarMenu` ve `ProfileInfo` içinde `gradient-to-tr from-primary to-primary/60` arka planlı daireler içinde gösterilir.
- Supabase `profiles` tablosundaki `avatar` kolonu (string) üzerinden çekilir.
- **Varsayılan:** `😎` (veya sunucudan dönen ilk avatar).

### b) Kritik İkonlar
- **Liderlik (Leaderboard):** `Trophy` (Lucide) ikonu kullanılır.
- **Paylaş (Share):** `Share2` ikonu kullanılır.
- **Profil/Giriş:** `User` veya mevcut `avatar` emojisi kullanılır.

## 7. Yetenek (Skill) Koordinasyonu
Bu tasarım sistemi projenin görsel kurallarını belirler. Geliştirme yaparken:
- Oyun arayüzüne özel kullanıcı deneyimi (UX) yerleşimleri ve "Nasıl Oynanır?" görselleri için `oyun-standartlari` yeteneğine bakınız.
- Projede renk kodları veya metinler (özellikle oyun içi açıklamalar) değiştiğinde, oyun talimatlarının ana kaynağı olan `veri-yonetimi` yeteneğindeki **Oyun İçerikleri (Games Data)** kuralına uygun hareket ediniz.

## 8. Premium Tasarım Standartları (Detay)

Bu bölüm, görsel hiyerarşi, derinlik ve premium deneyim kurallarının detaylarını içerir.

### a) Genel Stil Prensipleri
Ana konsept: **Soft Depth + Subtle Glow + Controlled Contrast**

- **Işık ve Derinlik:** Uygulama genelinde "katmanlı" bir yapı kullanılır. Arka plan en alt, kartlar orta, modaller ve header en üst katmandadır.
- **Görsel Hiyerarşi:** Önemli alanlar (header, aktif butonlar) glassmorphism ve gölge ile ayrıştırılır.
- **Kontrast:** Dark modda sinematik (blur + gradient), Light modda ise editorial (beyaz alan + soft shadow) atmosfer hakimdir.

### b) Bileşen Standartları

**Floating Premium Header (.glass-header)**
- **Kapsam:** Navbar ve GameHeader.
- **Özellikler:** 
    - `rgba(15, 23, 42, 0.75)` (dark) / `rgba(255, 255, 255, 0.8)` (light) arka plan.
    - `backdrop-blur(16px)` efekti.
    - `0 8px 24px rgba(0,0,0,0.25)` shadow (border yerine).

**İkincil Menü (Game Toolbar & Action Icons)**
- **Kapsam:** Headder içindeki aksiyon ikonları menüsü (Joker, Taktik, Puan vs).
- **Özellikler:** 
    - Oyun içi aksiyon menülerinde **Hamburger menü** kullanılmaz. Özellikler yatay olarak ekranda listelenmelidir.
    - İkon butonları sıkıcı bir tek renk yerine, kullanıcıya ayrışabilir hissettirmek amacıyla soft pastel tonlar (Örn: `text-cyan-500` icon, `bg-cyan-500/10` hover background) ile canlandırılmalıdır.
    - Araç çubuğu geniş ekranlarda ortalanır (`justify-center`), daha dar ekranlarda ise yana kaydırma (horizontal scroll) sorunu yaratmaması için ikonlar `flex-wrap` ile alta geçecek şekilde (`gap-1.5` veya `gap-2` ile) güvenli biçimde dizilmelidir.

**Premium Kartlar (.premium-card)**
- **Kapsam:** Ana sayfa oyun kartları.
- **Özellikler:** 
    - `backdrop-blur(8px)` + glass arka plan.
    - Hover durumunda `translateY(-4px)` kalkma ve gölge derinleşmesi.
    - Thumbnail'de hover sırasında `%105` doygunluk (saturation) artışı.

**Modaller ve Yüzeyler (.glass-surface)**
- **Kapsam:** Ayarlar, Meydan Okuma, Oyun Sonu ve Resume modalları.
- **Özellikler:**
    - `backdrop-blur(12px)` + `var(--theme-card-glass)` arka plan.
    - `border border-[var(--theme-glass-border)]` (ince, 1px sınır).

**Premium Butonlar (.premium-btn)**
- **Özellikler:**
    - Hover: `translateY(-1px)`
    - Active: `translateY(0)` + `scale(0.98)`
    - Gölge: `shadow-lg shadow-primary/20` (vurgu butonları için).

### c) Mobil Erişilebilirlik
Tüm interaktif alanlar minimum `48px` yüksekliğinde olmalı ve `active:scale` geri bildirimi vermelidir.
