import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Nasıl Oynanır? | Kelime Oyunları",
    description: "Tüm kelime oyunlarının kurallarını, tarihçesini ve kazanma taktiklerini öğrenin.",
};

export default function HowToPlayLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
