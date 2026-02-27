import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";
import ClientLayout from "./ClientLayout";

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.kelimeoyunlari.tr"),
  title: {
    template: "%s | Kelime Oyunları",
    default: "Kelime Oyunları",
  },
  description: "Ücretsiz Türkçe kelime oyunlarını bir arada sunan platform.",
  applicationName: "Kelime Oyunları",
  authors: [{ name: "Kelime Oyunları Takımı" }],
  generator: "Next.js",
  keywords: ["ücretsiz kelime oyunu", "türkçe kelime oyunları", "bulmaca", "wordle türkçe", "adam asmaca", "boggle türkçe", "zeka oyunları", "online kelime oyunu"],
  referrer: "origin-when-cross-origin",
  creator: "Kelime Oyunları",
  publisher: "Kelime Oyunları",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Kelime Oyunları",
    description: "Ücretsiz Türkçe kelime oyunlarını bir arada sunan platform.",
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
    title: "Kelime Oyunları",
    description: "Ücretsiz Türkçe kelime oyunlarını bir arada sunan platform.",
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
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}
