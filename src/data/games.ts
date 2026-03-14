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
    challenge?: {
        description: string;
        features: string[];
    };
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
    hasChallenge?: boolean;
}

export const GAMES: Game[] = [
    {
        id: 'wordle',
        title: 'Wordle',
        description: 'Ücretsiz Türkçe Wordle oyunu ile 5 harfli gizli kelimeyi 6 denemede bul!',
        href: '/games/wordle',
        thumbnail: '/games/wordle/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        hasChallenge: true,
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
            challenge: {
                description: 'Wordle oyununda arkadaşlarına kendi belirlediğin 5 harfli bir kelimeyle Meydan Okuyabilirsin! Kelimeni belirle, özel bağlantıyı kopyala ve arkadaşlarına gönder. Özel kelimeni 6 denemede bulabilecekler mi gör.',
                features: [
                    'Sözlükten 5 harfli geçerli bir kelime seçebilirsin.',
                    'İstersen kurallara uymayan "Özel Kelime" oluşturabilirsin (özel isimler, yabancı kelimeler vb.).',
                    'Oluşturulan özel bağlantıyı WhatsApp, Telegram veya diğer platformlarda kolayca paylaşabilirsin.',
                    'Arkadaşların linke tıkladığında tıpkı normal Wordle oynar gibi senin kelimeni bulmaya çalışır.'
                ]
            },
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
        hasChallenge: true,
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
            challenge: {
                description: 'Adam Asmaca oyununda bir kelime belirleyerek arkadaşlarına Meydan Okuyabilirsin! İster sözlükten, ister kendi uydurduğun bir kelimeyi seç, bağlantıyı kopyala ve arkadaşlarına gönder.',
                features: [
                    'Sözlükten herhangi bir kelime seçebilirsin (ipucu: zor kelimeler rakibini zorlar!).',
                    'Kendi özel kelimeni oluşturabilirsin (argo, özel isim veya dilediğin herhangi bir kelime).',
                    'Link üzerinden oyuna giren arkadaşların 6 canı bitmeden senin belirlediğin kelimeyi tahmin etmeye çalışır.',
                    'Meydan Okuma sonuçlarını arkadaşlarınla rekabet etmek için kullanabilirsin.'
                ]
            },
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
    },
    {
        id: 'kelime-arama',
        title: 'Kelime Arama',
        description: 'Ücretsiz Türkçe Kelime Arama oyununda gizlenen kelimeleri tabloda bul, joker kullan ve tüm listeyi tamamla.',
        href: '/games/kelime-arama',
        thumbnail: '/games/kelime-arama/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        instructions: {
            basic: 'Kelime Arama oyununda amaç, harf tablosunda saklanan tüm kelimeleri bulmaktır. Kelimeler yatay, dikey ve çapraz yönlerde; düz veya ters şekilde yerleştirilebilir.',
            rules: [
                'Izgara tüm seviyelerde 10x10 kalır; zorluk seviyesi bulunacak kelime sayısını artırır.',
                'Bir kelimeyi seçmek için harfler üzerinde sürükleyebilir veya ilk harf ile son harfi ardışık olarak seçebilirsiniz.',
                'Seçim mutlaka düz bir hatta olmalıdır (yatay, dikey veya çapraz).',
                'Doğru kelime bulunduğunda tabloda işaretlenir ve listede tamamlandı olarak görünür.',
                'Her oyunda bir joker hakkı vardır. Joker, bulunmamış bir kelimenin yerini kısa süreli vurgular.',
                'Tüm kelimeleri bulduğunuzda oyun tamamlanır ve bitiş bonusu ile birlikte toplam puan hesaplanır.'
            ],
            scoring: {
                description: 'Kelime Arama puanlaması kelime uzunluğu, zorluk seviyesi, joker kullanımı ve bitiş bonusuna göre hesaplanır:',
                points: [
                    { condition: 'Kısa Kelimeler (4-5 Harf)', value: '10-14 Puan' },
                    { condition: 'Uzun Kelimeler (6-7+ Harf)', value: '18-30 Puan' },
                    { condition: 'Zorluk Çarpanı', value: 'Kolay (x1), Orta (x1.5), Zor (x2)' },
                    { condition: 'Bulmacayı Tamamlama', value: '+120 Bonus Puan' },
                    { condition: 'Joker Kullanımı', value: '-30 Puan Cezası' }
                ]
            },
            footer: 'Doğru doğrultuyu yakala, tüm kelimeleri bul ve bulmacayı temizle!'
        },
        blogContent: {
            history: 'Kelime Arama (Word Search), 1968 yılında Norman E. Gibat tarafından popülerleştirilen klasik bir harf bulmaca türüdür. Basılı gazetelerden dijital oyunlara uzanan bu format, hızlı tarama ve dikkat becerilerini geliştirmesiyle öne çıkar.',
            proTips: [
                'Önce uzun kelimeleri ara; uzun kelime bulunduğunda tablo daha hızlı sadeleşir.',
                'Köşelerden merkeze doğru sistematik tarama yaparak göz kaçırmayı azalt.',
                'Bir kelimeyi bulamadığında çapraz yönleri özellikle kontrol et.'
            ]
        }
    },
    {
        id: 'kelime-merdiveni',
        title: 'Kelime Merdiveni',
        description: 'Ücretsiz Türkçe Kelime Merdiveni oyununda başlangıç kelimesinden hedef kelimeye tek harf değiştirerek ulaş! En az adımda hedefe var.',
        href: '/games/kelime-merdiveni',
        thumbnail: '/games/kelime-merdiveni/card.webp',
        playCount: 0,
        likeCount: 0,
        comingSoon: false,
        instructions: {
            basic: 'Kelime Merdiveni\'nde amaç, başlangıç kelimesinden hedef kelimeye her adımda sadece bir harf değiştirerek ulaşmaktır. Her adımda girdiğiniz kelime, Türkçe sözlükte mevcut ve anlamlı olmalıdır. En az adımla hedefe ulaşan en yüksek puanı alır.',
            rules: [
                'Her adımda yalnızca bir harf değiştirilebilir; harf eklenemez veya çıkarılamaz.',
                'Girdiğiniz her kelime Türkçe sözlükte mevcut ve anlamlı olmalıdır.',
                'Mevcut kelimenizden yalnızca bir harf farklı olan kelimeler geçerlidir.',
                'En az hamlede hedefe ulaşırsanız en yüksek puan çarpanını kazanırsınız.',
                'Maksimum adım sayısı aşılırsa oyun sona erer ve kaybedersiniz.'
            ],
            scoring: {
                description: 'Kelime Merdiveni puanlaması, optimal adım sayısı ve süreye göre hesaplanır:',
                points: [
                    { condition: 'Temel Puan', value: '1000 Puan' },
                    { condition: 'Optimal Adımda Bitiş', value: '+500 Bonus' },
                    { condition: 'Her Fazla Adım', value: '-100 Puan' },
                    { condition: 'Zaman Bonusu', value: 'Her saniye için puan' }
                ]
            },
            examples: [
                {
                    word: 'KASA',
                    colors: ['default', 'default', 'default', 'default'],
                    highlightLetter: 'K',
                    description: 'Başlangıç: KASA — Hedef: MASA'
                },
                {
                    word: 'MASA',
                    colors: ['correct', 'default', 'default', 'default'],
                    highlightLetter: 'M',
                    description: 'K → M değiştirildi. MASA geçerli bir kelime, tek adımda hedefe ulaşıldı!'
                }
            ],
            footer: 'Her adımda bir harf, en az adımda zafer!'
        },
        blogContent: {
            history: 'Kelime Merdiveni (Word Ladder), 1878 yılında «Alice Harikalar Dünyasında» kitabının yazarı Lewis Carroll tarafından icat edilmiştir. Carroll bu oyuna başlangıçta «Doublets» adını vermiştir. Oyun, iki kelime arasındaki farkı birer harf değişimi ile kapatmaya dayanmakta ve hem dil hem de mantık becerilerini geliştirmektedir. Bilgisayar biliminde BFS (Genişlik Öncelikli Arama) algoritmasının klasik uygulama örneklerinden biri olmasıyla da akademik dünyada ünlenmektedir.',
            proTips: [
                'Sesli harfleri değiştirmek genellikle daha fazla kelime seçeneği sunar.',
                'Hedef kelimedeki harfleri tek tek yerine oturtmaya çalışın.',
                'İki kelime arasındaki farklı harfleri belirleyip sırayla değiştirin.',
                'Ara hedef kelimeler belirleyin: büyük değişiklikler için küçük adımlar daha güvenlidir.'
            ]
        }
    }
];
