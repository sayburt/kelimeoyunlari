# Premium Tasarım Standartları

Bu doküman, "Kelime Oyunları" projesinin görsel hiyerarşi, derinlik ve premium deneyim kurallarını tanımlar.

## 1. Genel Stil Prensipleri
Ana konsept: **Soft Depth + Subtle Glow + Controlled Contrast**

- **Işık ve Derinlik:** Uygulama genelinde "katmanlı" bir yapı kullanılır. Arka plan en alt, kartlar orta, modaller ve header en üst katmandadır.
- **Görsel Hiyerarşi:** Önemli alanlar (header, aktif butonlar) glassmorphism ve gölge ile ayrıştırılır.
- **Kontrast:** Dark modda sinematik (blur + gradient), Light modda ise editorial (beyaz alan + soft shadow) atmosfer hakimdir.

## 2. Renk ve Atmosfer
- **Dark Mode:** Ana arka plan (Dark Lacivert `#0E1628`) üzerine hafif `.hero-glow` radial gradient uygulanır.
- **Light Mode:** Temiz arka plan (`#F7F9FC`) üzerine editorial boşluklar ve net hiyerarşi uygulanır.
- **Vurgu Rengi:** Turkuaz (`#22D3EE`) CTA butonlarında ve kritik ikonlarda (Trophy, Share) kullanılır.

## 3. Bileşen Standartları

### a) Floating Premium Header (.glass-header)
- **Kapsam:** Navbar ve GameHeader.
- **Özellikler:** 
    - `rgba(15, 23, 42, 0.75)` (dark) / `rgba(255, 255, 255, 0.8)` (light) arka plan.
    - `backdrop-blur(16px)` efekti.
    - `0 8px 24px rgba(0,0,0,0.25)` shadow (border yerine).

### b) Premium Kartlar (.premium-card)
- **Kapsam:** Ana sayfa oyun kartları.
- **Özellikler:** 
    - `backdrop-blur(8px)` + glass arka plan.
    - Hover durumunda `translateY(-4px)` kalkma ve gölge derinleşmesi.
    - Thumbnail'de hover sırasında `%105` doygunluk (saturation) artışı.

### c) Modaller ve Yüzeyler (.glass-surface)
- **Kapsam:** Ayarlar, Meydan Okuma, Oyun Sonu ve Resume modalları.
- **Özellikler:**
    - `backdrop-blur(12px)` + `var(--theme-card-glass)` arka plan.
    - `border border-[var(--theme-glass-border)]` (ince, 1px sınır).

### d) Premium Butonlar (.premium-btn)
- **Özellikler:**
    - Hover: `translateY(-1px)`
    - Active: `translateY(0)` + `scale(0.98)`
    - Gölge: `shadow-lg shadow-primary/20` (vurgu butonları için).

### e) Avatar ve İkonlar
- **Avatar:** Emoji tabanlı sistem. `gradient-to-tr from-primary to-primary/60` dairesel zemin.
- **İkonlar:** 
    - Liderlik: `Trophy` ikonu.
    - Paylaşım: `Share2` ikonu.

## 4. Yasaklar ve Kurallar
- ❌ **Glow Yasas:** Kartların üzerine doğrudan parlama (glow) efekti verilmez, sadece CTA shadow kullanılır.
- ❌ **Kalın Border:** `border-2` (2px) kullanımı özel durumlar (Harf hücresi) dışında tercih edilmez, bunun yerine `border` (1px) + glass border kullanılır.
- ✅ **Derinlik Önceliği:** Katman ayrımı her zaman `shadow` + `backdrop-blur` kombinasyonu ile sağlanmalıdır.
- ✅ **Mobil Erişilebilirlik:** Tüm interaktif alanlar minimum `48px` yüksekliğinde olmalı ve `active:scale` geri bildirimi vermelidir.
