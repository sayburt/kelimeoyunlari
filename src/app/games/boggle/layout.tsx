import type { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildHowToSchema, buildVideoGameSchema } from '@/components/seo/schemaGenerator';

const gameData = GAMES.find(g => g.id === 'boggle')!;

export const metadata: Metadata = {
    title: 'Boggle Oyna | Kelime Oyunları',
    description: 'Ücretsiz Türkçe Boggle oyununu sınırsız oynayın! harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
    keywords: ['ücretsiz boggle', 'türkçe boggle', 'boggle oyna', 'kelime oyunu', 'harf bağlama oyunu', 'zeka oyunu', 'kelime bulmaca'],
    openGraph: {
        title: 'Boggle Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Boggle oyununu sınırsız oynayın! harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
        images: [
            {
                url: '/games/boggle/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Boggle Oyun Kartı',
            }
        ],
        type: 'website',
        locale: 'tr_TR',
        url: 'https://www.kelimeoyunlari.tr/games/boggle',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Boggle Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Boggle oyununu sınırsız oynayın! harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
        images: ['/games/boggle/og.jpg'],
    },
    alternates: {
        canonical: '/games/boggle',
    },
};

export default function BoggleLayout({
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
                url: `https://www.kelimeoyunlari.tr/games/boggle#step${index + 1}`,
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
