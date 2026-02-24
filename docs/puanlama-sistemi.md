# Puanlama Sistemi ve Algoritmaları

Bu doküman, Kelime Oyunları platformundaki oyunların puanlama mantığını ve adil bir rekabet ortamı sağlamak için kullanılan algoritmaları açıklar. Her oyunun zorluk derecesi, gereken zaman ve stratejik derinliği farklı olduğundan, her oyun için özel bir puanlama mekanizması uygulanmaktadır.

## Evrensel Puanlama Çerçevesi (Standardizasyon)

Farklı oyunların (hızlı Anagram vs. uzun Wordle) yarışabilmesi için her oyun sonunda üretilen puanlar şu standart formülle normalize edilir:

`Sonuç Puan = (Taban + Performans + Hız) x Oyun Ağırlığı (GW) x Zorluk Çarpanı`

### Oyun Ağırlıkları (Game Weights)
Her oyunun global puan tablosundaki etkisi "Oyun Ağırlığı" ile dengelenir:
*   **Wordle:** 1.0 (Referans)
*   **Anagram:** 0.6 (Hızlı döngü olduğu için puan dengelenir)
*   **Adam Asmaca:** 0.8
*   **Kelime Bilgi (Quiz):** 1.2 (Yüksek bilgi gereksinimi ödüllendirilir)

Bu sayede, 10 tane hızlı Anagram oynayan biriyle, 3 tane zor seviye Wordle bitiren birinin puanları adaleti sarsmayacak şekilde birbirine yakın olur.

---

## 1. Wordle Puanlama Mantığı

Wordle oyununda amaç kelimeyi en az denemede ve en kısa sürede bulmaktır.

### Puan Hesaplama Formülü
`Toplam Puan = (Taban Puan + Deneme Bonusu + Zaman Bonusu) x Zorluk Çarpanı`

#### A. Taban Puan
Oyunu her kazandığınızda (kelimeyi bulduğunuzda) sabit bir puan alırsınız.
*   **Win:** 1000 Puan

#### B. Deneme Bonusu (Trial Bonus)
Kelimeyi ne kadar erken bulursanız o kadar yüksek bonus kazanırsınız.
*   1. Deneme: +1000 Puan
*   2. Deneme: +800 Puan
*   3. Deneme: +600 Puan
*   4. Deneme: +400 Puan
*   5. Deneme: +200 Puan
*   6. Deneme: +0 Puan

#### C. Zaman Bonusu (Time Bonus)
Hızlı düşünen oyuncuları ödüllendirmek için kullanılır. 5 dakika (300 saniye) baz alınır.
*   **Bonus:** `max(0, (300 - harcanan_saniye) x 2)`
*   *Örnek:* 30 saniyede bilen bir oyuncu: `(300 - 30) x 2 = 540` ek puan kazanır.

#### D. Zorluk Çarpanı (Difficulty Multiplier)
Oyun ayarlarında seçilen zorluk seviyesine göre toplam puan çarpılır.
*   **Kolay (Easy):** 1.0x (İpucu kullanımı serbest, yaygın kelimeler)
*   **Orta (Medium):** 1.5x (Standart mod)
*   **Zor (Hard):** 2.0x (Bulunan yeşil harflerin kullanımı zorunlu, nadir kelimeler)

### Örnek Senaryo
Oyuncu **Orta** zorlukta, **3. denemede** ve **45 saniyede** kelimeyi bildi:
- Taban: 1000
- Deneme: 600
- Zaman: (300 - 45) * 2 = 510
- Çarpan: 1.5x
- **Toplam:** (1000 + 600 + 510) x 1.5 = **3165 Puan**

---

## 2. Diğer Oyunlar (Planlanan)

### Anagram
- Her doğru kelime için uzunluk çarpanı.
- Kombo sistemi (ardışık hızlı bildirimler).

### Adam Asmaca (Hangman)
- Kalan can sayısı üzerinden yüksek bonus.
- Kelime uzunluğu çarpanı.

### Kelime Bilgi (Quiz)
- Soru başı sabit puan + kalan süre bonusu.
- Yanlış cevaplarda puan eksiltme (Cezalandırma sistemi).

---

## 3. Rozet Sistem ve Puan Eşikleri

Oyuncuların başarılarını onurlandırmak için puan tabanlı bir rozet sistemi uygulanmaktadır. Toplam puanınız belirli eşikleri aştığında bu rozetler otomatik olarak profilinize eklenir.

| Rozet Adı | Puan Eşiği | Tahmini Oyun | Kullanıcı Profili | Açıklama |
| :--- | :--- | :--- | :--- | :--- |
| **Binlik Kulübü** | 5.000 | ~2-3 | Yeni Oyuncu | İlk adımı attınız, artık bir oyuncusunuz! |
| **Acemi Dilci** | 25.000 | ~8-10 | Meraklı | Kelimeler dünyasında kendinizi kanıtlamaya başladınız. |
| **Kelime Avcısı** | 100.000 | ~35 | Düzenli | Keskin bir zeka ve hızın birleşimi. |
| **Puan Ustası** | 250.000 | ~80 | Deneyimli | Platformun elit oyuncuları arasına girdiniz. |
| **Kelime Efsanesi** | 1.000.000 | ~330 | Bağlı | İsminiz kelime oyunları tarihine yazılmaya aday. |
| **Ölümsüz Dilbilimci** | 2.500.000 | ~800+ | Üstat / Efsane | Kelimelerin efendisi, aşılması güç bir rekor! |

---

## Teknik Uygulama Notları
- Puanlar her oyun sonunda `scoreService` aracılığıyla veritabanına işlenir.
- Hile koruması için sunucu tarafında zaman doğrulaması yapılır.
- Skorlar "En İyi Skor" olarak profilde tutulur ve global sıralamada (Leaderboard) kullanılır.
