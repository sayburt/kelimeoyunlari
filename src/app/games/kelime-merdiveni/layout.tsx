import type { Metadata } from 'next';
import { GAMES } from '@/data/games';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema, buildHowToSchema, buildVideoGameSchema } from '@/components/seo/schemaGenerator';

const gameData = GAMES.find(g => g.id === 'kelime-merdiveni')!;

export const metadata: Metadata = {
    title: 'Kelime Merdiveni Oyna | Kelime Oyunları',
    description: 'Ücretsiz Türkçe Kelime Merdiveni oyunu! Başlangıç kelimesinden hedef kelimeye her adımda tek harf değiştirerek ulaş. En az adımda hedefe var ve yüksek puan kazan.',
    keywords: [
        'kelime merdiveni', 'word ladder', 'türkçe kelime oyunu', 'kelime değiştirme oyunu',
        'ücretsiz kelime oyunu', 'zeka oyunu', 'harf değiştirme', 'kelime bulmaca'
    ],
    openGraph: {
        title: 'Kelime Merdiveni Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Kelime Merdiveni oyunu! Her adımda tek harf değiştirerek hedef kelimeye ulaş.',
        images: [
            {
                url: '/games/kelime-merdiveni/og.jpg',
                width: 1200,
                height: 630,
                alt: 'Kelime Merdiveni Oyun Kartı',
            }
        ],
        type: 'website',
        locale: 'tr_TR',
        url: 'https://www.kelimeoyunlari.tr/games/kelime-merdiveni',
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Kelime Merdiveni Oyna | Kelime Oyunları',
        description: 'Ücretsiz Türkçe Kelime Merdiveni oyunu! Her adımda tek harf değiştirerek hedef kelimeye ulaş.',
        images: ['/games/kelime-merdiveni/og.jpg'],
    },
    alternates: {
        canonical: '/games/kelime-merdiveni',
    },
};

export default function WordLadderLayout({
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
                url: `https://www.kelimeoyunlari.tr/games/kelime-merdiveni#step${index + 1}`,
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
