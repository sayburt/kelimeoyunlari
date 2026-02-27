# Kelime Oyunları — Teknik Referans Belgesi
> v1.1 — Şubat 2026

---

## 1. Proje

Kelime Oyunları, Türkçe kelime oyunlarını bir arada sunan web ve mobil platformdur. Kullanıcılar giriş yapmadan misafir olarak veya hesap oluşturarak oyun oynayabilir. Platform yalnızca Türkçe içerik sunar. Gelir modeli Google Ads üzerine kuruludur. Proje https://www.kelimeoyunlari.tr web sitesinde canlıya alınacaktır.

### Temel Kurallar

- Kelime verisi `public/kelime-data.json` dosyasında tutulur, veritabanına taşınmaz.
- Misafir modda veriler localStorage / AsyncStorage'da saklanır.
- Kullanıcı giriş yaptığında misafir verisi Supabase'e aktarılır.
- Tüm veri okuma/yazma işlemleri `services/` katmanı üzerinden yapılır, doğrudan component'e yazılmaz.
- Kelime karşılaştırmalarında `toLocaleUpperCase('tr-TR')` kullanılır.
- Oyun içi UI custom Tailwind ile yazılır. Shadcn yalnızca genel UI bileşenlerinde kullanılır.

---

## 2. Teknoloji Stack

### Web
| | |
|---|---|
| Framework | Next.js + TypeScript |
| Stil | TailwindCSS |
| UI Bileşenleri | Shadcn/UI — navbar, modal, auth formları, ayarlar |
| Animasyon | Framer Motion |
| Hosting | Vercel |

### Mobil
| | |
|---|---|
| Framework | React Native + Expo + TypeScript |
| Stil | NativeWind |
| Animasyon | Reanimated |
| Platform | iOS + Android |
| Build & Deploy | Expo EAS |

### Backend & Veritabanı
| | |
|---|---|
| Platform | Supabase |
| Veritabanı | PostgreSQL |
| Auth | Supabase Auth — email ve Google ile giriş |
| API | Supabase REST API + Realtime |

---

## 3. Klasör Yapısı

### Web (Next.js)

```
src/
  app/
    page.tsx              → Landing
    games/
      page.tsx            → Oyun listesi
      [name]/
        page.tsx          → Oyun ekranı
    profile/
      page.tsx
    privacy/
      page.tsx
  components/
    ui/                   → Shadcn bileşenleri
    game/                 → Oyuna özel bileşenler
    layout/               → Navbar, Footer
  games/
    wordle/
    adam-asmaca/
    [oyunAdi]/
  services/               → Supabase çağrıları
  hooks/                  → useGame, useScore, useAuth
  lib/
    supabase.ts           → Supabase client
    storage.ts            → localStorage yardımcıları
  public/
    kelime-data.json      → Tek JSON dosyası
```

### Mobil (Expo)

```
app/
  (tabs)/
    index.tsx             → Oyun listesi
    profile.tsx           → Kullanıcı profili
  game/
    [name].tsx            → Dinamik oyun ekranı
components/
  game/
  ui/
services/
hooks/
lib/
  supabase.ts
  storage.ts              → AsyncStorage yardımcıları
```

---

## 4. Supabase Veri Şeması

### users
Supabase Auth tarafından yönetilir — id, email, created_at

### profiles
- id (auth.users referansı)
- username
- total_games_played
- total_wins
- created_at, updated_at

### game_stats
- id, user_id, game_name
- played, won, best_score
- current_streak, max_streak
- updated_at

### badges
- id, user_id, badge_key, earned_at

### game_likes
- id, game_name
- user_id (giriş yapılmışsa) veya session_id (misafir)
- created_at

---

## 5. Oyun Kartı

Oyun listesinde her oyun için kart bileşeni render edilir. Kartta şu bilgiler yer alır:

- Oyun adı ve kısa açıklama
- Oynanma sayısı
- Beğeni sayısı
- Zorluk seviyesi — Kolay / Orta / Zor
- Tahmini oyun süresi

---

## 6. Oyun Board

Her oyun ekranında sabit olarak bulunması gereken UI öğeleri:

- Ses açma / kapama
- Yardım (oyun kuralları)
- İstatistikler
- Joker butonları — oyuna özel, yalnızca joker hakkı varsa görünür
- Yeniden başlatma
- Ana sayfaya dön

---

## 7. Veri Yönetimi

### Kelime Verisi
Tek bir JSON dosyasıdır. Her kayıtta harf sayısı bilgisi mevcuttur. Oyun başladığında ilgili kayıtlar filtrelenerek bellekte tutulur. Supabase'e taşınmaz.

### Misafir Mod
Giriş yapılmadan oynandığında skor, istatistik ve joker bilgileri localStorage (web) veya AsyncStorage (mobil) üzerinde tutulur. Kullanıcı hesap oluşturup giriş yaptığında bu veriler Supabase'e aktarılır.

### Servis Katmanı
Tüm veri işlemleri `services/` klasörü altındaki fonksiyonlar üzerinden yapılır. Misafir modda localStorage'a yazar, giriş yapılmışsa Supabase'e yazar. Component bu ayrımı bilmez.

---

## 8. Tasarım Sistemi

Projenin görsel kimliği, premium tasarım standartları ve UI bileşen kuralları için aşağıdaki güncel dökümanlar referans alınmalıdır:

- **Ana Tasarım Sistemi:** [.agent/skills/tasarim-sistemi/SKILL.md](file:///.agent/skills/tasarim-sistemi/SKILL.md)
- **Premium Tasarım Standartları:** [docs/tasarim-revizyon.md](file:///docs/tasarim-revizyon.md)

Bu dökümanlar; renk paleti, tipografi, glassmorphism efektleri ve premium derinlik kurallarını (Soft Depth, Subtle Glow) detaylandırmaktadır.


---

## 9. Sayfalar

| Sayfa | Açıklama |
|---|---|
| Landing | Projeyi tanıtan giriş sayfası |
| Oyun Listesi | Tüm oyunların kart görünümü |
| Oyun Ekranı | Seçilen oyunun board'u |
| Profil | Kullanıcı istatistikleri, rozetler ve üye paneli |
| Ayarlar | Tema seçimi (Dark/Light), Ses tercihi, Hesap bilgileri |
| Gizlilik / KVKK | Google Ads ve Supabase veri kullanım politikası |
