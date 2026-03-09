import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import ClientLayout from "./ClientLayout";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildWebSiteSchema, buildOrganizationSchema } from "@/components/seo/schemaGenerator";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kelimeoyunlari.tr"),
  title: {
    template: "%s | Kelime Oyunları",
    default: "Türkçe Kelime Oyunları Platformu",
  },
  description: "En popüler Türkçe kelime oyunlarını ücretsiz ve sınırsız oynayın. Meydan okuyarak arkadaşlarınızla eğlenceli vakit geçirin.",
  applicationName: "Kelime Oyunları",
  authors: [{ name: "Kelime Oyunları Takımı" }],
  generator: "Next.js",
  keywords: [
    "kelime oyunları",
    "türkçe kelime oyunları",
    "ücretsiz kelime oyunları",
    "bulmaca oyunları",
    "türkçe bulmacalar",
    "ücretsiz bulmaca",
    "online kelime oyunu",
    "kelime bulma oyunu",
    "zeka oyunları",
    "sözcük avı",
    "kelime gezmece",
    "harf oyunları",
    "günlük kelime oyunu",
    "wordle",
    "türkçe wordle"
  ],
  referrer: "origin-when-cross-origin",
  creator: "Kelime Oyunları",
  publisher: "Kelime Oyunları",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Türkçe Kelime Oyunları Platformu",
    description: "En popüler Türkçe kelime oyunlarını ücretsiz ve sınırsız oynayın. Meydan okuyarak arkadaşlarınızla eğlenceli vakit geçirin.",
    url: "https://www.kelimeoyunlari.tr",
    siteName: "Kelime Oyunları",
    images: [
      {
        url: "/og.jpg",
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
    title: "Türkçe Kelime Oyunları Platformu",
    description: "En sevdiğiniz Türkçe kelime oyunlarını ücretsiz ve konforlu şekilde oynayın. Arkadaşlarınızla eğlenceli vakit geçirin.",
    creator: "@kelimeoyunlari",
    images: ["/og.jpg"],
  },
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/icon.svg",
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className={`${nunito.variable} font-sans`} suppressHydrationWarning>
        <JsonLd data={[buildWebSiteSchema(), buildOrganizationSchema()]} />
        <ClientLayout>
          {children}
        </ClientLayout>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
