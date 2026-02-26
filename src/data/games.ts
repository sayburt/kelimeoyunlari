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
    {
        id: 'adam-asmaca',
        title: 'Adam Asmaca',
        description: 'Gizli kelimeyi 6 hatalı tahmin yapmadan önce bul! Klasik adam asmaca oyunu.',
        href: '/games/adam-asmaca',
        thumbnail: '/games/hangman/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        instructions: {
            basic: 'Adam Asmaca, gizli kelimeyi harflerini tahmin ederek bulmaya çalıştığınız klasik bir kelime oyunudur. Toplamda 6 hakkınız var.',
            rules: [
                'Oyun başladığında ekranda kelimenin harf sayısı kadar boşluk görürsünüz.',
                'Klavyeden bir harfe tıklayın: harf kelimede varsa ilgili boşluklara yerleşir, yoksa idam sehpasındaki adam bir adım daha çizilir.',
                '6 canınız bitmeden kelimeyi bulursanız kazanırsınız.',
                'Hızlı tahminler ve daha uzun kelimeler daha yüksek puan verir. Her oyun 1 joker hakkınız bulunur.'
            ],
            scoring: {
                description: 'Adam Asmaca oyununda puanlama, tahmin sayısına, süreye ve kelime uzunluğuna bağlıdır:',
                points: [
                    { condition: 'Hiç Hata Yapmadan', value: 'Maksimum Puan' },
                    { condition: 'Kalan Can Sayısı', value: 'Her can için ekstra puan' },
                    { condition: 'Sürekli Doğru Seri', value: 'Kombo Çarpanı' }
                ]
            },
            examples: [
                {
                    word: 'E L M A',
                    colors: ['correct', 'default', 'default', 'correct'],
                    highlightLetter: 'E',
                    description: 'E harfi kelimede var ve açıldı.'
                },
                {
                    word: '_ _ _ _',
                    colors: ['default', 'default', 'default', 'default'],
                    highlightLetter: 'Z',
                    description: 'Z harfi yanlış, adam figürü 1 parça daha tamamlandı.'
                }
            ],
            footer: '6 can içinde bul ve darağacından kurtar!'
        },
        blogContent: {
            history: 'Adam Asmaca, kökeni 19. yüzyılın sonlarına, Viktorya dönemine kadar uzanan çok eski bir tahmin oyunudur. Kâğıt ve kalemle oynanan en popüler oyunların başında gelen bu klasik, dijital dünyada da zihni çalıştıran yapısıyla yerini korumaktadır.',
            proTips: [
                'Her zaman en sık kullanılan sesli harflerle (A, E, İ) başlayın.',
                'Sessiz harflerde çok kullanılan R, N, L harflerini tercih edin.',
                'Kelimedeki bilinen harflere bakarak Türkçe kelime yapısına göre takı tahmininde bulunun (ör. -LAR, -MEK).'
            ]
        }
    }
];
