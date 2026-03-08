import type { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildHowToSchema, buildVideoGameSchema } from '@/components/seo/schemaGenerator';

const gameData = GAMES.find(g => g.id === 'adam-asmaca')!;

export const metadata: Metadata = {
    title: gameData?.title || 'Adam Asmaca',
    description: gameData?.description || 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi adam çizilmeden bul!',
    keywords: ['adam asmaca', 'türkçe adam asmaca', 'ücretsiz adam asmaca', 'kelime oyunu', 'harf tahmin oyunu', 'bulmaca oyunu', 'zeka oyunları'],
    openGraph: {
        title: `${gameData?.title || 'Adam Asmaca'} | Kelime Oyunları`,
        description: gameData?.description || 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi adam çizilmeden bul!',
        url: 'https://www.kelimeoyunlari.tr/games/adam-asmaca',
        images: [
            {
                url: '/games/adam-asmaca/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Adam Asmaca Oyunu',
            },
        ],
    },
    twitter: {
        card: 'summary_large_image',
        title: `${gameData?.title || 'Adam Asmaca'} | Kelime Oyunları`,
        description: gameData?.description || 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi adam çizilmeden bul!',
        images: ['/games/adam-asmaca/og.jpg'],
    },
    alternates: {
        canonical: 'https://www.kelimeoyunlari.tr/games/adam-asmaca',
    },
};

export default function AdamAsmacaLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const jsonLd = [
        buildVideoGameSchema(gameData),
        buildHowToSchema(
            `${gameData.title} Nasıl Oynanır?`,
            gameData.instructions.basic,
            gameData.instructions.rules.map((rule, index) => ({
                url: `https://www.kelimeoyunlari.tr/games/adam-asmaca#step${index + 1}`,
                text: rule
            }))
        ),
        buildBreadcrumbSchema([
            { name: 'Anasayfa', item: '/' },
            { name: 'Oyunlar' },
            { name: gameData.title, item: gameData.href }
        ])
    ];

    return (
        <>
            <JsonLd data={jsonLd} />
            {children}
        </>
    );
}
