import type { Metadata } from 'next';
import { GAMES } from '@/data/games';

const gameData = GAMES.find(g => g.id === 'adam-asmaca');

export const metadata: Metadata = {
    title: gameData?.title || 'Adam Asmaca',
    description: gameData?.description || 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi adam çizilmeden bul!',
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
    return (
        <>
            {/* JSON-LD Schema For Game */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify([
                        {
                            '@context': 'https://schema.org',
                            '@type': 'VideoGame',
                            name: 'Adam Asmaca',
                            description: gameData?.description || 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi 6 hatalı tahmin yapmadan önce bul!',
                            genre: ['Kelime Oyunu', 'Bulmaca'],
                            url: 'https://www.kelimeoyunlari.tr/games/adam-asmaca',
                            image: 'https://www.kelimeoyunlari.tr/games/adam-asmaca/og.jpg',
                            inLanguage: 'tr',
                            playMode: 'SinglePlayer',
                            applicationCategory: 'Game',
                            platform: 'WebBrowser',
                        },
                        {
                            '@context': 'https://schema.org',
                            '@type': 'HowTo',
                            name: 'Adam Asmaca Nasıl Oynanır?',
                            description: 'Gizli kelimeyi 6 hatalı tahmin yapmadan bulma rehberi.',
                            step: (gameData?.instructions.rules || []).map((rule, index) => ({
                                '@type': 'HowToStep',
                                url: `https://www.kelimeoyunlari.tr/games/adam-asmaca#step${index + 1}`,
                                text: rule
                            }))
                        }
                    ]),
                }}
            />
            {children}
        </>
    );
}
