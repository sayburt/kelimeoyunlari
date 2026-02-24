export interface GameInstructionExample {
    word: string;
    colors: ('correct' | 'present' | 'absent' | 'default')[];
    description: string;
    highlightLetter: string;
}

export interface GameInstructions {
    basic: string;
    rules: string[];
    scoring?: {
        description: string;
        points: {
            condition: string;
            value: string;
        }[];
    };
    examples?: GameInstructionExample[];
    footer?: string;
}

export interface Game {
    id: string;
    title: string;
    description: string;
    href: string;
    thumbnail: string;
    playCount: number;
    likeCount: number;
    comingSoon: boolean;
    instructions: GameInstructions;
    blogContent?: {
        history?: string;
        proTips?: string[];
    };
}

export const GAMES: Game[] = [
    {
        id: 'wordle',
        title: 'Wordle',
        description: '5 harfli gizli kelimeyi 6 denemede bul!',
        href: '/games/wordle',
        thumbnail: '/games/wordle/card.webp',
        playCount: 15420,
        likeCount: 4200,
        comingSoon: false,
        instructions: {
            basic: 'Amacınız 5 harfli gizli kelimeyi 6 denemede bulmaktır. Her tahmin geçerli 5 harfli bir kelime olmalıdır. Tahmininizi yazdıktan sonra göndermek için Enter tuşuna basın.',
            rules: [
                'Her tahminden sonra, harflerin rengi tahmininizin gizli kelimeye ne kadar yakın olduğunu göstermek için değişecektir.',
                'Doğru harf doğru yerdeyse yeşil, yanlış yerdeyse sarı, kelimede yoksa gri olur.'
            ],
            scoring: {
                description: 'Wordle oyununda puanlama, kelimeyi kaçıncı denemede bulduğuna ve ne kadar hızlı olduğuna göre hesaplanır:',
                points: [
                    { condition: '1. Denemede Bildiğinde', value: '100 Puan' },
                    { condition: '2. Denemede Bildiğinde', value: '80 Puan' },
                    { condition: '3. Denemede Bildiğinde', value: '60 Puan' },
                    { condition: '4. Denemede Bildiğinde', value: '40 Puan' },
                    { condition: '5. Denemede Bildiğinde', value: '20 Puan' },
                    { condition: '6. Denemede Bildiğinde', value: '10 Puan' },
                    { condition: 'Süre Bonusu', value: 'Her saniye için ek puan' }
                ]
            },
            examples: [
                {
                    word: 'KALEM',
                    colors: ['correct', 'default', 'default', 'default', 'default'],
                    highlightLetter: 'K',
                    description: 'K harfi kelimede var ve doğru yerde.'
                },
                {
                    word: 'SINAV',
                    colors: ['default', 'present', 'default', 'default', 'default'],
                    highlightLetter: 'I',
                    description: 'I harfi kelimede var ama yanlış yerde.'
                },
                {
                    word: 'BAŞAK',
                    colors: ['default', 'default', 'default', 'absent', 'default'],
                    highlightLetter: 'A',
                    description: 'A harfi kelimede hiç yok.'
                }
            ],
            footer: 'Kelime dağarcığınızı test edin ve zihninizi canlı tutun!'
        },
        blogContent: {
            history: 'Wordle, 2021 yılının sonlarında Josh Wardle tarafından geliştirilen ve kısa sürede dünya çapında bir fenomen haline gelen bir kelime oyunudur. Başlangıçta sadece ailesine yönelik bir hediye olarak tasarlanan oyun, basitliği ve paylaşılabilir sonuçları ile her gün milyonlarca kişiyi ekran başına kilitlemektedir.',
            proTips: [
                'Sesli harf ağırlıklı kelimelerle başlayın (Örn: ADİLE, KAİDE).',
                'İkinci tahmininizde ilk kelimede kullanmadığınız harfleri deneyin.',
                'Kelimedeki harf dizilim olasılıklarını düşünün (Örn: -ER, -AN ile biten kelimeler yaygındır).'
            ]
        }
    },
];
