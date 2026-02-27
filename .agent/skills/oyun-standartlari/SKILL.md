---
name: oyun-standartlari
description: Tüm oyun sayfalarının (Wordle vb.) sahip olması gereken yapısal, SEO ve UI standartlarını içerir. Bir oyun geliştirilirken zorunlu olarak uygulanmalıdır.
---

# Oyun Geliştirme Standartları (Game Page Standards)

Bu belge, projeye eklenecek her yeni kelime/zeka oyunu için uyulması zorunlu olan UI (Kullanıcı Arayüzü), UX (Kullanıcı Deneyimi) ve SEO (Arama Motoru Optimizasyonu) standartlarını tanımlar.

## 1. Sayfa ve Layout Yapısı (UI/UX)
Yeni bir oyun eklerken, oyun deneyiminin kesintisiz olması en önemli kuraldır.

*   **Ekranı Kaplayan Oyun Alanı:** Oyun tahtası ve klavye her zaman kullanıcının görüş alanında, yukarı kaydırma gerektirmeyen (above the fold) bir yapıda olmalıdır. Oyun oynamak için aşağı kaydırmak *gerekmemelidir*.
    *   Bunun için kod içerisinde genellikle oyunun ana bölümünü saran div üzerinde `min-h-[100dvh] flex flex-col` yapıları kullanılmalıdır. Klavye esnek alanın (flex-1) altında ve görünür olmalıdır.
*   **Aşağı Kaydırılabilir İçerik:** Oyun kontrol alanının (klavye vs.) bittiği çerçevenin hemen altında (kullanıcı bilinçli olarak aşağı kaydırdığında görünen) "Nasıl Oynanır?" vb. SEO destekli açıklamalar yer almalıdır.
    *   Sayfaya genel bir scroll (kaydırma) yeteneği verebilmek için en üst sarmalayıcı (wrapper) eleman `overflow-y-auto` kullanmalıdır. İçerisinde oyun modülü bağımsız bir blok (`min-h-[100dvh] shrink-0` gibi), SEO metinleri alt blok olarak yer alabilir.

## 2. SEO ve Meta Veriler (Teknik)
Oyun sayfalarının SEO yapılandırması (Metadata API, JSON-LD Schema Markup, OG Görselleri) için `seo-uzmani` skill'indeki kurallara **kesinlikle** uyulmalıdır. Hangi meta verilerin nasıl ekleneceği ve görsel standartları orada detaylandırılmıştır. (Özetle: Her oyuna bir layout.tsx ve metadata, ayrıca JSON-LD `VideoGame` schemaları eklenmelidir).

## 3. Oyun Bilgi Kartları (GameCard)
Ana sayfadaki grid sisteminde sergilenmek üzere her oyunun standart görselleri ve verileri bulunmalıdır.

*   **Kart Görseli (Thumbnail):** Her oyunun `public/games/oyun-adi/` klasörü altında `card.webp` adında, 16:9 formatına uygun, performans için `.webp` formatında optimize edilmiş bir Thumbnail'ı olmalıdır.
*   **Grid Verisi:** `page.tsx` içerisindeki oyunlar dizisinde (GAMES), oyun objesine resim olarak `thumbnail: '/games/oyun-adi/card.webp'` yolu verilmelidir.

## 3. "Nasıl Oynanır?" Bölümü ve Merkezi Veri
Oyun talimatları tek bir merkezden (`src/data/games.ts`) yönetilmeli ve görsel destekli olmalıdır.

*   **Merkezi Veri Yapısı:** Her oyun `GAMES` dizisinde `instructions` objesine sahip olmalıdır. Bu obje; `basic` açıklama, `rules` (liste) ve görsel örnekler için `examples` içermelidir.
*   **Görsel Örnekler:** `examples` dizisi; kelimeyi, harf renklerini (`correct`, `present`, `absent`) ve hangi harfin neyi temsil ettiğini açıklayan metni barındırmalıdır.
*   **Ortak Bileşen:** Sayfa altındaki "Nasıl Oynanır" bölümü için `<GameInstructions />` bileşeni kullanılmalıdır. Bu bileşen hem oyun sayfasında hem de ana sayfadaki bilgi modalında aynı veriyi görselleştirir.
*   **SEO Uyumu:** Oyun sayfasının altında kullanılan bu bileşen, oyunla ilgili anahtar kelimeleri içermeli ve `H2` başlığı ile desteklenmelidir.

## 4. Ortak Bileşenler (Components)
Temel altyapıyı baştan kodlamamak ve proje geneli tutarlılığı korumak amaçlı "Ortak Oyun Bileşenleri" benimsenmelidir. Özel bir ihtiyaç varsa bu bileşenler modüler olacak (prop alacak) şekilde zenginleştirilir.

*   **Oyun Başlığı (Header):** `<GameHeader />` - Geri dön butonu, oyun başlığı ve mevcutsa ses aç/kapat gibi özellikleri barındırır.
*   **Klavye (Girdi):** `<GameKeyboard />` - Özellikle kelime tabanlı oyunlarda fiziksel klavye desteği, ekrandan tıklama desteği sağlar.
*   **Hatalar/Uyarılar:** `<ErrorToast message="..." />` - "Geçersiz kelime", "Kelime bulunamadı" gibi anlık hataların ekranda uyumlu (Toast formunda) belirmesi için kullanılır.
*   **Sonuç Ekranı:** `<GameEndModal />` - Oyun tamamlandığında puanı, durumu ve istatistiksel sonuçları göstermek, "Yeni Oyun" düğmesini sağlamak için kullanılır.

## 5. Veri ve Durum Yönetimi (State & Data)
*   **Custom Hook:** Durum yönetimi (State Management) temiz ve test edilebilir tutulması prensibi doğrultusunda, sayfa bileşeninden (page.tsx) bağımsız olarak `useGame.ts` (ya da örneğin `useWordHunt.ts` vb.) formunda bir React Hook içinde yürütülmelidir.
*   **Veritabanı / Kütüphane:** Kelime bankasının yönetimi, her zaman projenin root veya data dizinlerinde yer alan veriler üzerinden (örneğin `kelime-data.json`), aracı yardımcı fonksiyonlarla (Services) gerçekleştirilmelidir.
*   **Yerel Depolama (Storage):** Oyuna dair yerel kayıt geçmişleri ve ilerlemeler (Guest Stats vs.), modüler `storage.ts` servisi ile kaydedilmeli/çağrılmalıdır.

## 7. Rehber Sayfaları (Nasıl Oynanır? Sayfaları)
Oyun rehber sayfaları (`src/app/nasil-oynanir/[id]/page.tsx`), hem eğitici hem de SEO odaklı olmalı ve şu standart yapıyı takip etmelidir:

*   **Dinamik Grid Yapısı:** Sayfa ana içeriği `2/3` (Sol - Bilgi) ve `1/3` (Sağ - Sidebar) oranında bölünmüş bir grid kullanmalıdır:
    *   **Sol Sütun (İçerik):** 
        *   **Tarihçe (Opsiyonel):** Oyunun kökenlerini anlatan metin bloğu. Eğer oyunun bilinen gerçek bir geçmişi/tarihçesi varsa eklenmelidir; her oyun için zorunlu değildir.
        *   **Adım Adım Kurallar:** `rules` dizisinden beslenen, numaralandırılmış liste yapısı.
        *   **Görsel Örnekler:** CSS ile çizilmiş, oyunun mantığını (ör: Wordle renkleri) anlatan interaktif kutucuklar ve açıklamaları.
    *   **Sağ Sütun (Sidebar):**
        *   **CTA Kartı:** Oyuncuyu hemen oyuna yönlendiren "HEMEN OYNA" butonu içeren vurgulu kart.
        *   **Pro İpuçları:** `proTips` dizisinden beslenen, yıldız/ikon destekli taktik metinleri.
*   **Hero Alanı Tasarımı:**
    *   Oyunun `thumbnail` görseli arka planda blur (`blur-sm`) ve opaklığı azaltılmış (`opacity-20`) şekilde kullanılmalıdır.
    *   Başlık (`H1`) büyük ve kalın (`font-black`) olmalı, oyun ismi tamamen büyük harf ile yazılmalıdır.
*   **SEO Standartları:**
    *   Metadata `title` yapısı: "[Oyun Adı] Nasıl Oynanır? Kurallar ve Taktikler | Kelime Oyunları" formatında olmalıdır.
    *   Sayfa içindeki başlıklar (`H2`) merkezi vurgu çizgisi (vurgu renginde yuvarlak/çizgi) ile desteklenmelidir.

## 8. Yetenek (Skill) Koordinasyonu
Bu belge oyunların UI/UX standartlarını belirler. Oyun bazlı diğer teknik detaylar için:
- **Kapsamlı SEO ve Sitemap Süreçleri:** `seo-uzmani` yeteneği.
- **Renk ve Animasyon Detayları:** `tasarim-sistemi` yeteneği.
- **Kelime Bankası Altyapısı:** `veri-yonetimi` yeteneğine bakınız.

---
*Not: Bu standartlar belgesi Kelime Oyunları projesi geliştirildikçe, yeni en iyi pratikler (best practices) keşfedildikçe güncellenmelidir ve herhangi bir LLM AI asistanına rehberlik etmesi amacıyla .agent/skills içerisinde tutulmaktadır.*
