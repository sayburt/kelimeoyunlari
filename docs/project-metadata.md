# Kelime Oyunları - Proje Meta Bilgileri Dökümanı

Bu döküman, **Kelime Oyunları** projesindeki tüm sayfaların SEO, sosyal medya (OpenGraph/Twitter) ve genel meta bilgilerini listeler.

## 1. Genel Yapı (Root Layout)
- **Dosya Yolu:** `src/app/layout.tsx`

Tüm sayfalar aksi belirtilmedikçe bu temel meta bilgilerini miras alır veya bu şablonu kullanır.

- **URL:** `https://www.kelimeoyunlari.tr`
- **Başlık Şablonu:** `%s | Kelime Oyunları`
- **Varsayılan Başlık:** `Kelime Oyunları`
- **Açıklama:** Ücretsiz Türkçe kelime oyunlarını bir arada sunan platform.
- **Uygulama Adı:** Kelime Oyunları
- **Yazar:** Kelime Oyunları Takımı
- **Anahtar Kelimeler:** ücretsiz kelime oyunu, türkçe kelime oyunları, bulmaca, wordle türkçe, adam asmaca, boggle türkçe, zeka oyunları, online kelime oyunu
- **Robots:** `index, follow`
- **Favicon:** `/icon.svg`
- **Apple Icon:** `/apple-icon.png`
- **Genel OG Resmi:** `/og.jpg` (1200x630)

---

## 2. Oyun Sayfaları Meta Bilgileri

### 2.1 Wordle
- **Dosya Yolu:** `src/app/games/wordle/layout.tsx`
- **URL:** `/games/wordle`
- **Başlık:** `Wordle Oyna | Kelime Oyunları`
- **Açıklama:** Ücretsiz Türkçe Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.
- **Anahtar Kelimeler:** ücretsiz wordle, türkçe wordle, wordle oyna, kelime oyunu, günlük kelime bulmaca, zeka oyunu, kelime tahmin oyunu
- **OG Resmi:** `/games/wordle/og.jpg`
- **Schema:** `VideoGame`, `HowTo` (Zengin sonuçlar için yapılandırılmış veri)

### 2.2 Adam Asmaca
- **Dosya Yolu:** `src/app/games/adam-asmaca/layout.tsx`
- **URL:** `/games/adam-asmaca`
- **Başlık:** `Adam Asmaca | Kelime Oyunları`
- **Açıklama:** Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi 6 hatalı tahmin yapmadan önce bul! Klasik eğlence.
- **OG Resmi:** `/games/adam-asmaca/og.jpg`
- **Schema:** `VideoGame`, `HowTo`

### 2.3 Boggle
- **Dosya Yolu:** `src/app/games/boggle/layout.tsx`
- **URL:** `/games/boggle`
- **Başlık:** `Boggle Oyna | Kelime Oyunları`
- **Açıklama:** Ücretsiz Türkçe Boggle oyununu sınırsız oynayın! harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.
- **Anahtar Kelimeler:** ücretsiz boggle, türkçe boggle, boggle oyna, kelime oyunu, harf bağlama oyunu, zeka oyunu, kelime bulmaca
- **OG Resmi:** `/games/boggle/og.jpg`
- **Schema:** `VideoGame`, `HowTo`

---

## 3. Bilgi ve Politika Sayfaları

### 3.1 Nasıl Oynanır? (Liste)
- **Dosya Yolu:** `src/app/nasil-oynanir/layout.tsx`
- **URL:** `/nasil-oynanir`
- **Başlık:** `Nasıl Oynanır? | Kelime Oyunları`
- **Açıklama:** Tüm kelime oyunlarının kurallarını, tarihçesini ve kazanma taktiklerini öğrenin.

### 3.2 Nasıl Oynanır? (Oyun Detay - Dinamik)
- **Dosya Yolu:** `src/app/nasil-oynanir/[id]/page.tsx` ( `generateMetadata` fonksiyonu)
- **URL:** `/nasil-oynanir/[oyun-id]`
- **Başlık:** `{Oyun Adı} Nasıl Oynanır? Kurallar ve Taktikler | Kelime Oyunları`
- **Açıklama:** Ücretsiz Türkçe {Oyun Adı} oyunu hakkında her şey: Tarihçesi, kuralları ve kazanma taktikleri. Öğrenin ve oynamaya başlayın.
- **OG Resmi:** Oyunun kendi thumbnail resmi.

### 3.3 KVKK Aydınlatma Metni
- **Dosya Yolu:** `src/app/kvkk/page.tsx`
- **URL:** `/kvkk`
- **Başlık:** `KVKK Aydınlatma Metni | Kelime Oyunları`
- **Açıklama:** Kelime Oyunları KVKK Aydınlatma Metni. Kişisel verilerinizin korunması ve işlenmesi hakkında detaylı bilgi.

### 3.4 Gizlilik Politikası
- **Dosya Yolu:** `src/app/privacy/page.tsx`
- **URL:** `/privacy`
- **Başlık:** `Gizlilik Politikası | Kelime Oyunları`
- **Açıklama:** Kelime Oyunları Gizlilik Politikası. Verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin.

---

## 4. Diğer Sayfalar
Aşağıdaki sayfalar genellikle root metadata bilgilerini kullanır veya özel başlıkları bulunur:

- **Liderlik Tablosu (`/leaderboard`):** `src/app/leaderboard/page.tsx` (Not: Şu an root metadata'yı miras alıyor, özel metadata tanımlı değil.)
- **Giriş/Kayıt (`/login`, `/register`):** `src/app/(auth)/layout.tsx`
- **Profil (`/profile`):** `src/app/profile/page.tsx`
- **Hesap Silme Onayı:** `src/app/confirm-delete/page.tsx`

---
*Son Güncelleme: 27 Şubat 2026*
