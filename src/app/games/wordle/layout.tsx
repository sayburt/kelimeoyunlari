import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Wordle Oyna | Kelime Oyunları',
    description: 'Popüler Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
    keywords: ['wordle', 'wordle nasıl oynanır', 'kelime oyunu', 'türkçe wordle', 'kelime bulmaca', 'zeka oyunu', 'kelime tahmin'],
    openGraph: {
        title: 'Wordle Oyna | Kelime Oyunları',
        description: 'Popüler Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
        images: [
            {
                url: '/games/wordle/og.png',
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
        description: 'Popüler Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.',
        images: ['/games/wordle/og.png'],
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
    // Schema Markup (HowTo ve VideoGame birleşimi)
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": ["VideoGame", "HowTo"],
        "name": "Wordle",
        "description": "Popüler Wordle oyununu sınırsız oynayın. 5 harfli gizli kelimeyi 6 denemede bulmaya çalışın.",
        "genre": "Kelime Oyunu",
        "playMode": "SinglePlayer",
        "inLanguage": "tr",
        "step": [
            {
                "@type": "HowToStep",
                "name": "Kelimeyi Tahmin Et",
                "text": "5 harfli geçerli bir kelime yazıp Enter tuşuna basın."
            },
            {
                "@type": "HowToStep",
                "name": "İpuçlarını İncele",
                "text": "Harflerin renklerine bakarak ipuçlarını değerlendirin. Yeşil harf doğru yerde, sarı harf yanlış yerde, koyu gri harf kelimede yok demektir."
            },
            {
                "@type": "HowToStep",
                "name": "Doğru Kelimeyi Bul",
                "text": "İpuçlarını kullanarak doğru kelimeyi bulana kadar (en fazla 6 defa) tahmin etmeye devam edin."
            }
        ]
    };

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
