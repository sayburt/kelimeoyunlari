import { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildHowToSchema, buildVideoGameSchema } from '@/components/seo/schemaGenerator';

const gameData = GAMES.find(g => g.id === 'wordle')!;

export const metadata: Metadata = {
    title: 'Wordle Oyna | Kelime Oyunları',
    description: 'Ücretsiz Türkçe Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
    keywords: ['wordle', 'türkçe wordle', 'ücretsiz wordle', 'wordle oyna', 'günlük kelime oyunu', 'kelime tahmin oyunu', 'zeka oyunu', 'ücretsiz kelime oyunları', 'türkçe bulmacalar'],
    openGraph: {
        title: 'Wordle Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
        images: [
            {
                url: '/games/wordle/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Wordle Oyun Kartı',
            }
        ],
        type: 'website',
        locale: 'tr_TR',
        url: 'https://www.kelimeoyunlari.tr/games/wordle',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Wordle Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
        images: ['/games/wordle/og.jpg'],
    },
    alternates: {
        canonical: '/games/wordle',
    },
};


export default function WordleLayout({
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
                url: `https://www.kelimeoyunlari.tr/games/wordle#step${index + 1}`,
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
