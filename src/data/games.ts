export interface GameInstructionExample {
    word: string;
    colors: ('correct' | 'present' | 'absent' | 'default')[];
    description: string;
    highlightLetter: string;
}

export interface GameInstructions {
    basic: string;
    rules: string[];
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
        id: 'anagram',
        title: 'Anagram',
        description: 'Karışık harflerden anlamlı kelime oluştur.',
        href: '/games/anagram',
        thumbnail: '/games/anagram/card.webp',
        playCount: 12050,
        likeCount: 3100,
        comingSoon: false,
        instructions: {
            basic: 'Karışık olarak verilen harfleri doğru sıraya dizerek anlamlı bir kelime oluşturun.',
            rules: [
                'Size verilen tüm harfleri kullanmalısınız.',
                'Belirli bir süre içinde ne kadar çok kelime bulursanız o kadar çok puan kazanırsınız.'
            ]
        },
        blogContent: {
            history: 'Anagramlar, antik çağlardan beri var olan bir kelime oyunudur. Antik Yunanistan\'da şairlerin ve bilgelerin zekalarını sergilemek için kullandıkları bu sanat, günümüzde dijital platformlarda hız ve dikkat odaklı bir oyun haline gelmiştir.',
            proTips: [
                'Harfleri zihninizde gruplayın (ekler ve kökler).',
                'Sesli harfleri merkez alarak sessiz harfleri etrafına dizmeye çalışın.',
                'Kelimeyi yüksek sesle söylemek harf dizilimini fark etmenize yardımcı olabilir.'
            ]
        }
    },
    {
        id: 'hangman',
        title: 'Adam Asmaca',
        description: 'Harfleri tahmin ederek kelimeyi kurtarabilir misin?',
        href: '/games/hangman',
        thumbnail: '/games/hangman/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: true,
        instructions: {
            basic: 'Gizli kelimeyi bulmak için harf tahminleri yapın.',
            rules: [
                'Her yanlış tahminde bir can kaybedersiniz.',
                'Adam asılmadan önce kelimeyi bulmalısınız.'
            ]
        }
    },
    {
        id: 'quiz',
        title: 'Kelime Bilgi',
        description: 'Anlamından kelimeyi tahmin et.',
        href: '/games/quiz',
        thumbnail: '/games/quiz/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: true,
        instructions: {
            basic: 'Verilen tanıma uygun kelimeyi doğru tahmin etmeye çalışın.',
            rules: [
                'Sözlük tanımları ve ipuçları verilir.',
                'Kelimeyi ne kadar hızlı bulursanız o kadar yüksek puan alırsınız.'
            ]
        }
    }
];
