import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Özellikler",
    description: "Kelime Oyunları'nın meydan okuma, detaylı istatistikler, liderlik tablosu ve bulut kayıt gibi gelişmiş özelliklerini keşfedin.",
    openGraph: {
        title: "Özellikler | Kelime Oyunları",
        description: "Kelime Oyunları'nın meydan okuma, detaylı istatistikler, liderlik tablosu ve bulut kayıt gibi gelişmiş özelliklerini keşfedin.",
        url: "https://www.kelimeoyunlari.tr/ozellikler",
    },
    alternates: {
        canonical: "https://www.kelimeoyunlari.tr/ozellikler",
    },
};

export default function OzelliklerLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
