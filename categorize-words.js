/* eslint-disable */
const fs = require('fs');
const path = require('path');

const dataPath = path.join(__dirname, 'public', 'kelime-data.json');
const outputPath = path.join(__dirname, 'public', 'kelime-data.json'); // Override existing or create v2?

// Kategori anahtar kelimeleri
const categories = {
    'araçlar': ['araç', 'taşıt', 'araba', 'kamyon', 'otobüs', 'tren', 'uçak', 'gemi', 'motor', 'bisiklet', 'alet'],
    'bilim': ['bilim', 'fizik', 'kimya', 'biyoloji', 'astronomi', 'tıp', 'matematik', 'teori', 'hipotez', 'element'],
    'bitki': ['bitki', 'ağaç', 'çiçek', 'yaprak', 'meyve', 'sebze', 'tarım', 'orman', 'ot'],
    'coğrafya': ['coğrafya', 'dağ', 'nehir', 'göl', 'deniz', 'okyanus', 'kıta', 'ülke', 'iklim', 'harita', 'bölge', 'ilçe', 'il'],
    'eşya': ['eşya', 'alet', 'mobilya', 'cihaz', 'makine', 'kutu', 'kap', 'giysi', 'kıyafet', 'kumaş'],
    'hayvan': ['hayvan', 'kuş', 'balık', 'böcek', 'sürüngen', 'memeli', 'köpek', 'kedi', 'at', 'koyun', 'inek', 'yılan', 'aslan', 'kaplan'],
    'meslek': ['meslek', 'iş', 'zanaat', 'doktor', 'öğretmen', 'mühendis', 'işçi', 'memur', 'usta', 'esnaf', 'sanatkar', 'avukat', 'yazar', 'şair'],
    'sanat': ['sanat', 'müzik', 'resim', 'heykel', 'tiyatro', 'sinema', 'edebiyat', 'şiir', 'roman', 'hikaye', 'dans', 'şarkı', 'mimari'],
    'spor': ['spor', 'oyun', 'futbol', 'basketbol', 'voleybol', 'yüzme', 'atletizm', 'güreş', 'boks', 'jimnastik', 'yarış'],
    'şehir': ['şehir', 'kent', 'kasaba', 'köy', 'başkent', 'metropol'],
    'yemek': ['gıda', 'besin', 'tatlı', 'içecek', 'çorba', 'sebze yemeği', 'hamur işi', 'meyve', 'aş', 'aşçı', 'mutfak', 'peynir', 'ekmek', 'süt', 'et yemeği', 'sebze', 'meyvesi', 'yenir']
};

console.log('Veriler okunuyor...');
const rawData = fs.readFileSync(dataPath, 'utf-8');
const kelimeData = JSON.parse(rawData);

let categorizedCount = 0;
let updatedWords = 0;
const categoryStats = {};
Object.keys(categories).forEach(c => categoryStats[c] = 0);

kelimeData.words.forEach(wordObj => {
    let oldCategories = [...wordObj.kategoriler];

    // Eski kategorileri tamamen temizleyerek taze bir kategorizasyon yapacağız
    // Çünkü kelime-data.json içinde daha önceden kalmış yanlış kategoriler var.
    wordObj.kategoriler = [];

    if (wordObj.anlam) {
        let lowerAnlam = wordObj.anlam.toLowerCase('tr-TR');
        // 'yemek vb.' gibi ibareleri temizleyerek 'hart' kelimesinin yemek sayılmaması için
        // kelimenin tam anlamındaki "yemek," fiil hallerinin bazılarından kaçınalım.
        // Ama en iyisi ' yemek ' kelimesini keyword olarak yemek kategorisi yerine
        // sadece yemeği kasteden kelimeler bırakmak (yukarıda 'yemek' keywordünü kaldırdım ki 'hart' fiil olduğu için eşleşmesin).

        Object.keys(categories).forEach(cat => {
            const keywords = categories[cat];
            const hasMatch = keywords.some(kw => {
                const regex = new RegExp(`(^|\\s|[.,;()'"!?-])${kw}($|\\s|[.,;()'"!?-])`, 'i');
                return regex.test(lowerAnlam);
            });

            if (hasMatch && !wordObj.kategoriler.includes(cat)) {
                wordObj.kategoriler.push(cat);
                categoryStats[cat]++;
            }
        });
    }

    if (JSON.stringify(wordObj.kategoriler) !== JSON.stringify(oldCategories)) {
        updatedWords++;
    }
});

console.log(`\nToplam ${kelimeData.words.length} kelime incelendi.`);
console.log(`${updatedWords} kelimenin kategorisi güncellendi.`);

console.log('\nKategori İstatistikleri (Yeni Eklenenler):');
Object.keys(categoryStats).forEach(cat => {
    console.log(`- ${cat}: ${categoryStats[cat]}`);
});

// Calculate missing categories where length is 0?
// Actually we need to count total words per category now
const finalCategoryStats = {};
kelimeData.words.forEach(w => {
    w.kategoriler.forEach(c => {
        finalCategoryStats[c] = (finalCategoryStats[c] || 0) + 1;
    });
});
console.log('\nNihai Kategori Durumu:');
Object.entries(finalCategoryStats).sort((a, b) => b[1] - a[1]).forEach(([cat, count]) => {
    console.log(`- ${cat}: ${count}`);
});

// Update metadata statistics
kelimeData.metadata.statistics.categories = finalCategoryStats;
kelimeData.metadata.last_categorized_date = new Date().toISOString();

fs.writeFileSync(outputPath, JSON.stringify(kelimeData, null, 2), 'utf-8');
console.log(`\nVeriler ${outputPath} dosyasına kaydedildi.`);
