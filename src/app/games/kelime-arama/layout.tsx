import type { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildHowToSchema, buildVideoGameSchema } from '@/components/seo/schemaGenerator';

const gameData = GAMES.find(g => g.id === 'kelime-arama')!;

export const metadata: Metadata = {
    title: 'Kelime Arama Oyna | Kelime Oyunları',
    description: 'Ücretsiz Türkçe Kelime Arama oyunu ile gizli kelimeleri bul, joker kullan ve bulmacayı tamamlayarak puan topla.',
    keywords: ['kelime arama', 'sözcük avı', 'türkçe kelime arama', 'ücretsiz kelime arama', 'kelime bul oyunu', 'zeka oyunu', 'ücretsiz bulmaca', 'türkçe bulmacalar', 'kelime oyunları'],
    openGraph: {
        title: 'Kelime Arama Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Kelime Arama oyunu ile gizli kelimeleri bul, joker kullan ve bulmacayı tamamlayarak puan topla.',
        images: [
            {
                url: '/games/kelime-arama/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Kelime Arama Oyun Kartı',
            }
        ],
        type: 'website',
        locale: 'tr_TR',
        url: 'https://www.kelimeoyunlari.tr/games/kelime-arama',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kelime Arama Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Kelime Arama oyunu ile gizli kelimeleri bul, joker kullan ve bulmacayı tamamlayarak puan topla.',
        images: ['/games/kelime-arama/og.jpg'],
    },
    alternates: {
        canonical: '/games/kelime-arama',
    },
};

export default function WordSearchLayout({
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
                url: `https://www.kelimeoyunlari.tr/games/kelime-arama#step${index + 1}`,
                text: rule,
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
