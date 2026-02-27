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
        description: 'Ücretsiz Türkçe Wordle oyunu ile 5 harfli gizli kelimeyi 6 denemede bul!',
        href: '/games/wordle',
        thumbnail: '/games/wordle/card.webp',
        playCount: 15420,
        likeCount: 4200,
        comingSoon: false,
        instructions: {
            basic: 'Amacınız ücretsiz Türkçe Wordle oyununda 5 harfli gizli kelimeyi 6 denemede bulmaktır. Her tahmin geçerli 5 harfli bir kelime olmalıdır. Tahmininizi yazdıktan sonra göndermek için Enter tuşuna basın.',
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
        description: 'Ücretsiz Türkçe Adam Asmaca oyunu. Gizli kelimeyi 6 hatalı tahmin yapmadan önce bul! Klasik eğlence.',
        href: '/games/adam-asmaca',
        thumbnail: '/games/adam-asmaca/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        instructions: {
            basic: 'Ücretsiz Türkçe Adam Asmaca, gizli kelimeyi harflerini tahmin ederek bulmaya çalıştığınız klasik bir kelime oyunudur. Toplamda 6 hakkınız var.',
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
    },
    {
        id: 'boggle',
        title: 'Boggle',
        description: 'Harfleri birbirine bağlayarak kelimeler oluştur! Ücretsiz Türkçe Boggle oyunu ile sınırsız oyna ve en yüksek puanı topla.',
        href: '/games/boggle',
        thumbnail: '/games/boggle/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        instructions: {
            basic: '4×4 ızgaradaki harfleri birbirine bağlayarak anlamlı Türkçe kelimeler oluşturun. Ücretsiz Türkçe Boggle deneyimi ile yatay, dikey ve çapraz olmak üzere 8 yönde hareket edebilirsiniz. Aynı hücreyi bir kelimede birden fazla kullanamazsınız.',
            rules: [
                'Oyun 4×4 (16 harf) bir ızgara üzerinde oynanır. Harfler her oyunda rastgele yerleştirilir.',
                'Kelime oluşturmak için bitişik (yatay, dikey veya çapraz) karelerdeki harflere sırayla tıklayın veya sürükleyin.',
                'Bir kelimede aynı kareyi iki kez kullanamazsınız.',
                'Geçerli bir kelime en az 3 harf uzunluğunda olmalıdır.',
                'Bulduğunuz her geçerli ve benzersiz kelime puan kazandırır. Daha uzun kelimeler daha fazla puan verir.',
                'Süreniz 3 dakikadır. Süre dolduğunda oyun sona erer ve toplam puanınız hesaplanır.'
            ],
            scoring: {
                description: 'Boggle puanlama sistemi kelime uzunluğuna bağlıdır. Daha uzun kelimeler çok daha yüksek puan verir:',
                points: [
                    { condition: '3 Harfli Kelime', value: '1 Puan' },
                    { condition: '4 Harfli Kelime', value: '1 Puan' },
                    { condition: '5 Harfli Kelime', value: '2 Puan' },
                    { condition: '6 Harfli Kelime', value: '3 Puan' },
                    { condition: '7 Harfli Kelime', value: '5 Puan' },
                    { condition: '8+ Harfli Kelime', value: '11 Puan' }
                ]
            },
            footer: 'Harfleri birbirine bağla, kelimeleri keşfet ve en yüksek puanı topla!'
        },
        blogContent: {
            history: 'Boggle, 1972 yılında Allan Turoff tarafından icat edilen ve Parker Brothers tarafından yayımlanan klasik bir kelime oyunudur. Orijinalinde fiziksel harf zarlarının bir tepside çalkalanmasıyla oluşan rastgele ızgara üzerinde oynanır. Dünya genelinde milyonlarca kişi tarafından sevilen Boggle, hem eğlenceli hem de kelime dağarcığını geliştiren bir oyun olarak bilinir.',
            proTips: [
                'Önce uzun kelimeleri bulmaya çalışın — 7+ harfli kelimeler çok daha yüksek puan verir.',
                'Ek ve son ekleri düşünün: -LAR, -LER, -MAK, -MEK gibi ekler yeni kelimeler oluşturabilir.',
                'Izgaranın tamamını tarayın, sadece bir köşeye odaklanmayın.',
                'Sık kullanılan harf gruplarını arayın: bir sesli harfin etrafındaki sessiz harfler genellikle kelime oluşturur.'
            ]
        }
    }
];
