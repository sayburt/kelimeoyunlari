import type { Metadata } from 'next';
import { GAMES } from '@/data/games';

const gameData = GAMES.find(g => g.id === 'boggle');

export const metadata: Metadata = {
    title: 'Boggle Oyna | Kelime Oyunları',
    description: 'Klasik Boggle oyununu Türkçe oynayın! 4×4 ızgaradaki harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
    keywords: ['boggle', 'boggle nasıl oynanır', 'kelime oyunu', 'türkçe boggle', 'kelime bulmaca', 'zeka oyunu', 'harf oyunu'],
    openGraph: {
        title: 'Boggle Oyna | Kelime Oyunları',
        description: 'Klasik Boggle oyununu Türkçe oynayın! 4×4 ızgaradaki harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
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
        description: 'Klasik Boggle oyununu Türkçe oynayın! 4×4 ızgaradaki harfleri birbirine bağlayarak 3 dakikada mümkün olduğunca çok kelime bulun.',
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
        {
            '@context': 'https://schema.org',
            '@type': 'VideoGame',
            name: 'Boggle',
            description: gameData?.description || 'Harfleri birbirine bağlayarak kelimeler oluştur! 3 dakikada en yüksek puanı topla.',
            genre: ['Kelime Oyunu', 'Bulmaca'],
            url: 'https://www.kelimeoyunlari.tr/games/boggle',
            image: 'https://www.kelimeoyunlari.tr/games/boggle/og.jpg',
            inLanguage: 'tr',
            playMode: 'SinglePlayer',
            applicationCategory: 'Game',
            platform: 'WebBrowser',
        },
        {
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'Boggle Nasıl Oynanır?',
            description: '4×4 ızgaradaki harfleri birbirine bağlayarak kelime bulma rehberi.',
            step: (gameData?.instructions.rules || []).map((rule, index) => ({
                '@type': 'HowToStep',
                url: `https://www.kelimeoyunlari.tr/games/boggle#step${index + 1}`,
                text: rule,
            })),
        },
    ];

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            {children}
        </>
    );
}
