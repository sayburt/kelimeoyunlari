import type { WordStats } from '@/lib/wordData';
import type { ParsedSlug } from './slugParser';

/**
 * Oyun bazli oyun isimleri
 */
const GAME_NAMES: Record<string, string> = {
    wordle: 'Wordle',
    'adam-asmaca': 'Adam Asmaca',
    boggle: 'Boggle',
    'kelime-arama': 'Kelime Arama',
};

/**
 * Oyun bazli CTA (Call to Action) metinleri
 */
const GAME_CTA: Record<string, string> = {
    wordle: 'Bu kelimeleri Wordle\'da dene ve 5 harfli gizli kelimeyi bul!',
    'adam-asmaca': 'Adam Asmaca\'da bu kelimeleri tahmin etmeye calis!',
    boggle: 'Boggle\'da bu kelimeleri bul ve puan topla!',
    'kelime-arama': 'Kelime Arama bulmacasinda bu kelimeleri ara!',
};

// ---------- Meta aciklama sablonlari ----------

/**
 * Sayfa meta description uretir. Google SERP'te gorunecek metin.
 */
export function generateMetaDescription(parsed: ParsedSlug, stats: WordStats): string {
    const gameName = GAME_NAMES[parsed.gameId] || parsed.gameId;
    const { totalCount } = stats;

    if (parsed.filter.excludeLetters && parsed.filter.length) {
        const letters = parsed.filter.excludeLetters
            .map((letter) => letter.toLocaleUpperCase('tr-TR'))
            .join(' ve ');
        return `${parsed.displayTitle} listesi - Toplam ${totalCount} kelime. Icinde ${letters} harfleri olmayan ${parsed.filter.length} harfli kelimeleri ${gameName} oyununda eleme stratejisi icin kullan.`;
    }

    if (parsed.filter.excludeLetters) {
        const letters = parsed.filter.excludeLetters
            .map((letter) => letter.toLocaleUpperCase('tr-TR'))
            .join(' ve ');
        return `${parsed.displayTitle} - ${totalCount} kelime. Icinde ${letters} harfi olmayan Turkce kelime listesi.`;
    }

    if (parsed.filter.startsWith && parsed.filter.length) {
        return `${parsed.displayTitle} listesi - Toplam ${totalCount} kelime. ${gameName} oyununda ipucu olarak kullan, strateji gelistir. Turkce kelime veritabani.`;
    }

    if (parsed.filter.startsWith) {
        return `${parsed.displayTitle} listesi - ${totalCount} kelime. ${gameName} ve diger kelime oyunlarinda kullanabilecegin kapsamli Turkce kelime listesi.`;
    }

    if (parsed.filter.endsWith && parsed.filter.length) {
        return `${parsed.displayTitle} listesi - ${totalCount} kelime. ${gameName} oyununda son harfleri bildigin kelimeleri bulmak icin kullan.`;
    }

    if (parsed.filter.endsWith) {
        return `${parsed.displayTitle} - Toplam ${totalCount} kelime. Turkce kelime oyunlari icin kapsamli son ek rehberi.`;
    }

    if (parsed.filter.length) {
        return `${parsed.displayTitle} - ${totalCount} kelime listelendi. ${gameName} ve kelime oyunlari icin ${parsed.filter.length} harfli Turkce kelimeler.`;
    }

    return `${parsed.displayTitle} - ${totalCount} Turkce kelime. Kelime oyunlari icin kapsamli veritabani.`;
}

// ---------- Sayfa baslik sablonlari ----------

/**
 * HTML <title> icin baslik uretir.
 */
export function generatePageTitle(parsed: ParsedSlug): string {
    const gameName = GAME_NAMES[parsed.gameId] || parsed.gameId;
    return `${parsed.displayTitle} | ${gameName} Yardimcisi`;
}

// ---------- Sayfa ici icerik sablonlari ----------

/**
 * Sayfanin ust kisminda gorunecek dinamik aciklama paragrafini uretir.
 * "Thin content" onlemi: Her sayfa benzersiz istatistik verisiyle zenginlestirilir.
 */
export function generatePageDescription(parsed: ParsedSlug, stats: WordStats): string {
    const gameName = GAME_NAMES[parsed.gameId] || parsed.gameId;
    const { totalCount } = stats;

    if (parsed.filter.excludeLetters && parsed.filter.length) {
        const letters = parsed.filter.excludeLetters
            .map((letter) => letter.toLocaleUpperCase('tr-TR'))
            .join(' ve ');
        return `Bu listede icinde ${letters} harfleri gecmeyen toplam ${totalCount} adet ${parsed.filter.length} harfli Turkce kelime yer almaktadir. Bu kelimeler, ${gameName} oyununda harf eleme teknigi uygularken dogru adayi daha hizli bulmaniza yardimci olur.`;
    }

    if (parsed.filter.excludeLetters) {
        const letters = parsed.filter.excludeLetters
            .map((letter) => letter.toLocaleUpperCase('tr-TR'))
            .join(' ve ');
        return `Icinde ${letters} harfleri olmayan toplam ${totalCount} Turkce kelime listelenmistir. Bu listeyi ${gameName} ve diger kelime oyunlarinda alternatif tahminler uretmek icin kullanabilirsiniz.`;
    }

    if (parsed.filter.startsWith && parsed.filter.length) {
        const letter = parsed.filter.startsWith.toLocaleUpperCase('tr-TR');
        return `Turkce sozlukte ${letter} harfi ile baslayan toplam ${totalCount} adet ${parsed.filter.length} harfli kelime bulunmaktadir. ${gameName} oyununda ${letter} harfi ile baslayan bir kelime ariyorsaniz, asagidaki liste size yardimci olacaktir.`;
    }

    if (parsed.filter.startsWith) {
        const letter = parsed.filter.startsWith.toLocaleUpperCase('tr-TR');
        return `${letter} harfi ile baslayan toplam ${totalCount} Turkce kelime listelenmistir. Bu kapsamli liste ${gameName} ve diger kelime oyunlarinda strateji gelistirmenize yardimci olacaktir.`;
    }

    if (parsed.filter.endsWith) {
        const suffix = parsed.filter.endsWith.toLocaleUpperCase('tr-TR');
        return `Sonu ${suffix} ile biten toplam ${totalCount} Turkce kelime bulunmaktadir. ${gameName} oyununda son harfleri bildiginiz kelimeleri bulmak icin bu listeyi kullanabilirsiniz.`;
    }

    return `Toplam ${totalCount} adet Turkce kelime listelenmistir. ${gameName} oyununda kelime darcaginizi gelistirmek icin bu listeyi inceleyin.`;
}

// ---------- Strateji kartlari ----------

export interface StrategyTip {
    title: string;
    description: string;
}

/**
 * Oyun bazli strateji ipuclari uretir.
 */
export function generateStrategyTips(parsed: ParsedSlug, stats: WordStats): StrategyTip[] {
    const tips: StrategyTip[] = [];

    // En yogun kategori
    const topCategories = Object.entries(stats.categoryDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 3);

    if (parsed.gameId === 'wordle') {
        if (parsed.filter.startsWith) {
            const letter = parsed.filter.startsWith.toLocaleUpperCase('tr-TR');
            tips.push({
                title: `${letter} Harfi ile Wordle Stratejisi`,
                description: `${letter} harfi ile baslayan ${stats.totalCount} kelime arasindan Wordle'da ilk tahmininizde ${letter} harfini kullanarak guclu bir baslangic yapabilirsiniz.`,
            });
        }

        tips.push({
            title: 'Sesli Harf Stratejisi',
            description: 'Wordle\'da ilk tahmininizde mumkun oldugunca farkli sesli harf kullanin. A, E, I harfleri Turkce\'de en sik kullanilan sesli harflerdir.',
        });

        tips.push({
            title: 'Harf Eleme Teknigi',
            description: `Bu listedeki ${stats.totalCount} kelimeden dogru olani bulmak icin once en yaygin harfleri deneyin. R, N, L, K harfleri Turkce'de siklikla kullanilir.`,
        });
    }

    if (parsed.gameId === 'adam-asmaca') {
        tips.push({
            title: 'Harf Frekansi Avantaji',
            description: `Adam Asmaca'da ilk olarak A, E, I gibi sesli harfleri tahmin edin. Turkce'de kelimelerin buyuk cogunlugu bu harfleri icerir ve boylece erken asama da kelimenin yapisini anlayabilirsiniz.`,
        });

        if (topCategories.length > 0) {
            tips.push({
                title: 'Kategori Ipucu',
                description: `Bu listedeki kelimelerin cogunlugu "${topCategories[0][0]}" kategorisinde. Kelime uzunlugunu biliyorsaniz, bu kategori bilgisi tahminlerinizi daraltmaniza yardimci olabilir.`,
            });
        }
    }

    if (parsed.gameId === 'boggle') {
        tips.push({
            title: 'Harf Baglama Stratejisi',
            description: `Boggle'da bu kelime listesindeki yaygin harf kombinasyonlarini tanimak hizinizi arttirir. Izgarada bu kaliplari arayarak daha fazla kelime bulabilirsiniz.`,
        });
    }

    if (parsed.gameId === 'kelime-arama') {
        tips.push({
            title: 'Sistematik Tarama',
            description: `Kelime Arama'da bu listedeki kelimeleri ararken, once uzun kelimeleri bulmaya calisin. Uzun kelimeler tabloda daha kolay fark edilir ve bulundugunda tablo hizla sadelessir.`,
        });
    }

    return tips;
}

// ---------- CTA ----------

/**
 * Oyun yonlendirme metni
 */
export function getGameCTA(gameId: string): string {
    return GAME_CTA[gameId] || 'Bu kelimeleri kelime oyunlarinda dene!';
}

/**
 * Oyun adi
 */
export function getGameName(gameId: string): string {
    return GAME_NAMES[gameId] || gameId;
}

// ---------- FAQ uretici ----------

export interface FAQItem {
    question: string;
    answer: string;
}

/**
 * Sayfaya ozel SSS uretir. Schema.org FAQ icin kullanilir.
 */
export function generateFAQItems(parsed: ParsedSlug, stats: WordStats): FAQItem[] {
    const gameName = GAME_NAMES[parsed.gameId] || parsed.gameId;
    const items: FAQItem[] = [];

    if (parsed.filter.startsWith && parsed.filter.length) {
        const letter = parsed.filter.startsWith.toLocaleUpperCase('tr-TR');
        const n = parsed.filter.length;

        items.push({
            question: `${letter} ile baslayan kac tane ${n} harfli kelime vardir?`,
            answer: `Turkce sozlukte ${letter} harfi ile baslayan toplam ${stats.totalCount} adet ${n} harfli kelime bulunmaktadir.`,
        });

        items.push({
            question: `${letter} ile baslayan ${n} harfli kelimeleri ${gameName}'da nasil kullanirim?`,
            answer: `${gameName} oyununda ${letter} harfi ile basladiginizi bildiginiz bir kelimeyi ararken bu listeyi referans olarak kullanabilirsiniz.`,
        });
    }

    if (parsed.filter.excludeLetters && parsed.filter.length) {
        const letters = parsed.filter.excludeLetters
            .map((letter) => letter.toLocaleUpperCase('tr-TR'))
            .join(' ve ');

        items.push({
            question: `Icinde ${letters} harfleri olmayan kac tane ${parsed.filter.length} harfli kelime vardir?`,
            answer: `Listede toplam ${stats.totalCount} adet ${parsed.filter.length} harfli ve ${letters} harflerini icermeyen Turkce kelime bulunmaktadir.`,
        });

        items.push({
            question: `${letters} harflerini eleyerek Wordle nasil daha hizli cozulur?`,
            answer: `Bazi tahminlerden sonra ${letters} harflerinin kelimede olmadigini biliyorsaniz, bu liste kalan olasiliklari daraltir ve bir sonraki tahmini daha isabetli yapmanizi saglar.`,
        });
    }

    return items;
}
