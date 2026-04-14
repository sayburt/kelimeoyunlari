---
description: Kelime Oyunları projesi için SEO (Arama Motoru Optimizasyonu) kuralları ve standartları. Bir sayfa eklenirken veya güncellenirken uygulanması zorunlu olan Meta ve OpenGraph etiket standartlarını içerir.
---

# SEO Uzmanı Skill

Bu yetenek, **Kelime Oyunları** projesi için hazırlanan web sayfalarının arama motoru optimizasyonunun (SEO) doğru, eksiksiz ve Next.js (App Router) standartlarına uygun olmasını sağlar.

Bir sayfada geliştirme yaparken veya yeni bir sayfa (özellikle yeni bir oyun) eklerken aşağıdaki kurallara **kesinlikle** uyulmalıdır.

## 1. Next.js Metadata API Kullanımı

Sayfaların arama motorlarında doğru indekslenmesi için Next.js'in statik veya dinamik `Metadata` API'si kullanılmalıdır.

- Eğer sayfa bir **Server Component** ise, meta etiketler doğrudan sayfa içinde (`page.tsx`) `export const metadata: Metadata` şeklinde tanımlanabilir.
- Eğer sayfa bir **Client Component** (`'use client'`) ise, meta etiketleri `page.tsx` içinde dışa aktarmak uyarı/hata verir. Bu durumda, o sayfanın bulunduğu dizine özel bir `layout.tsx` eklenmeli ve meta verileri orada tanımlanmalıdır.

### Örnek Global (Kök) Metadata (`layout.tsx`)

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kelimeoyunlari.tr"),
  title: {
    template: "%s | Kelime Oyunları",
    default: "Kelime Oyunları",
  },
  description: "Türkçe kelime oyunlarını bir arada sunan platform.",
  openGraph: {
    title: "Kelime Oyunları",
    description: "Türkçe kelime oyunlarını bir arada sunan platform.",
    url: "https://www.kelimeoyunlari.tr",
    siteName: "Kelime Oyunları",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Kelime Oyunları OG Resmi",
      }
    ],
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kelime Oyunları",
    description: "Türkçe kelime oyunlarını bir arada sunan platform.",
    images: ["/og-image.png"],
  },
  alternates: {
    canonical: "https://www.kelimeoyunlari.tr",
  }
};
```

### Örnek Oyun Sayfası Metadata (`games/[oyun-adi]/layout.tsx`)

Oyun sayfaları genellikle client component olduğu için, dizinlerinde bir `layout.tsx` oluşturup aşağıdaki formatı kullanın:

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordle",
  description: "5 harfli gizli kelimeyi 6 denemede bul! Eğlenceli Türkçe Wordle oyunu.",
  openGraph: {
    title: "Wordle - Kelime Oyunları",
    description: "5 harfli gizli kelimeyi 6 denemede bul! Eğlenceli Türkçe Wordle oyunu.",
    url: "https://www.kelimeoyunlari.tr/games/wordle",
    images: [
      {
        url: "/games/wordle/card.webp", 
        width: 800,
        height: 600,
        alt: "Wordle Oyunu",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Wordle - Kelime Oyunları",
    description: "5 harfli gizli kelimeyi 6 denemede bul! Eğlenceli Türkçe Wordle oyunu.",
    images: ["/games/wordle/card.webp"],
  },
  alternates: {
    canonical: "https://www.kelimeoyunlari.tr/games/wordle",
  },
};

export default function WordleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
```

### 1.1. Rehber Sayfaları Metadata (`nasil-oynanir/[id]/layout.tsx`)

Oyun rehber sayfaları hem bilgilendirici hem de SEO odaklı olmalıdır:

- **Title Yapısı:** `[Oyun Adı] Nasıl Oynanır? Kurallar ve Taktikler | Kelime Oyunları`
- **Description:** Oyunun temel mantığını ve oyuncuya sağlayacağı faydayı/eğlenceyi özetleyen, anahtar kelime odaklı bir metin.
- **Canonical:** `https://www.kelimeoyunlari.tr/nasil-oynanir/[id]`

```typescript
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Wordle Nasıl Oynanır? Kurallar ve Taktikler",
  description: "Wordle oyununun kuralları, ipuçları ve kazanma stratejileri. Türkçe Wordle rehberi.",
  alternates: {
    canonical: "https://www.kelimeoyunlari.tr/nasil-oynanir/wordle",
  },
};
```

## 2. Sosyal Medya OG ve Kart Görselleri
- Ana sayfa veya genel paylaşım için `1200x630` px ölçülerinde bir `og-image.png` kullanılmalıdır.
- Oyun sayfaları için (`wordle`, `anagram` vb.) standart oyun kartı görselimiz (`/games/[oyun-adi]/card.webp` vb.) OG görseli olarak kullanılabilir. Aksi belirtilmemişse oyun dizinindeki görseli kullanın.

## 3. Dinamik Route'lar için `generateMetadata`
Kullanıcı profil sayfaları veya skor tabloları gibi dinamik URL'ye sahip sayfalarda `generateMetadata` fonksiyonunu kullanın:

```typescript
import { Metadata } from 'next';

export async function generateMetadata({ params }): Promise<Metadata> {
  // Parametreye göre dinamik SEO oluştur
  return {
    title: `Profil - ${params.username}`,
  };
}
```

## 4. URL ve Domain Yapısı
Projenin canlı URL'i `https://www.kelimeoyunlari.tr` olmakzadır. Meta etiketlerde (ör: `canonical`, `og:url` vb.) daima bu domain baz alınmalıdır. Ortama özgü tanımlamalar için `metadataBase` bir kere kök `layout.tsx` içinde ayarlandığında diğer sayfalarda (eğer linkler `/` ile başlıyorsa) otomatik olarak üzerine eklenecektir.

## 5. Test ve Doğrulama
Yeni bir sayfa ekledikten sonra:
1. Kaynak kodlarına (`<head>`) bakarak `title`, `description`, `application-name`, `og:title`, `twitter:card` vb. etiketlerin eklendiğinden emin olun.
2. Canonical linklerin doğru adresi işaret ettiğini kontrol edin.

## 6. Sitemap ve Robots.txt
Arama motorlarının siteyi doğru tarayabilmesi için `src/app/sitemap.ts` ve `src/app/robots.ts` dosyalarının projede bulunması ve güncel tutulması zorunludur.
- Yeni bir sayfa (Örn: Yeni bir oyun sayfası `/games/yenioyun`) eklendiğinde, statik veya dinamik olarak bu rotanın `sitemap.ts` içerisine eklenmesi (veya otomatik taranması) sağlanmalıdır.
- Test ortamlarında (preview) ya da gizlenmesi gereken API ve admin rotalarında (`robots.ts` üzerinden) `Disallow` tanımı yapılmalıdır.

## 8. İç Bağlantılar (Internal Linking)
Tüm oyun sayfalarında, sayfanın alt kısmında bulunan "Nasıl Oynanır" (GameInstructions) bölümünün altında, ilgili oyunun detaylı anlatım sayfasına (`/nasil-oynanir/[oyun-id]`) giden bir "Detaylı Bilgi İçin Tıkla" butonu/linki bulunmalıdır. Bu, kullanıcı deneyimini iyileştirmek ve SEO açısından sayfalar arası otorite aktarımı sağlamak için zorunludur.

## 9. Sayfa İçi Hiyerarşi ve Görsel SEO
- **H1 Kullanımı:** Her sayfada sadece tek bir `H1` bulunmalı ve sayfanın ana konusunu içermelidir (Örn: "WORDLE NASIL OYNANIR?").
- **H2 Vurgusu:** Sayfa içindeki alt başlıklar (`H2`) merkezi vurgu çizgisi veya yuvarlak gibi görsel öğelerle desteklenerek okunabilirlik artırılmalıdır.
- **Resim Alt Etiketleri:** Tüm görseller (`img` veya `Image`) anlamlı `alt` metinlerine sahip olmalıdır.

## 9. Yetenek (Skill) Koordinasyonu
SEO kuralları uygulanırken aşağıdaki belgeler de dikkate alınmalıdır:
- **Oyun İçi Metadata ve Şemalar:** `oyun-standartlari` yeteneğindeki Layout, game card (og.png/card.webp) yönergelerine bakınız.
- **Proje Mimarisi:** Temel dosya konumları, genel yapı bilgisi için `proje-kurallari` yeteneği ile uyumlu olunmalıdır.
