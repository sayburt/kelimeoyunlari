
Projeye yeni bir kelime oyunu eklemek istiyorum. [prd.md](cci:7://file:///c:/Users/sayburt/projeler/kelime-oyunlari/prd.md:0:0-0:0), `proje-kurallari`, `oyun-standartlari`, `tasarim-sistemi`, `veri-yonetimi` ve `seo-uzmani` skill dökümanlarını baz alarak bu oyunu uçtan uca implemente et. Oyun görselleri public/games/boggle klasörüne 

1. Oyun Kimliği:
- Oyun Adı: [Boggle]
- Klasör Adı (Slug): [boggle]
- Kısa Açıklama: 

Mekanik Uyumu
Evet, Boggle kelime oyunları projesine çok iyi oturur. Hem oynanış hem de teknik açıdan kelime tabanlı oyunlarla doğal bir uyum içindedir. Scrabble, Word Search gibi oyunların yanında güzel bir çeşitlilik sağlar çünkü diğerlerinden farklı olarak yön ve bağlantı odaklıdır — harfleri seçmekten çok harfler arasında yol bulmak üzerine kuruludur.

Boggle Kuralları
Oyun Alanı
Boggle standart olarak 4×4'lük bir ızgaradan oluşur (16 harf kalıbı). Harfler rastgele yerleştirilir ve her karede bir harf bulunur.
Temel Amaç
Izgaradaki harfleri birbirine bağlayarak anlamlı kelimeler oluşturmak. Daha uzun kelime = daha yüksek puan.
Hareket Kuralları
Bir kelime oluştururken bitişik karelerdeki harfleri takip edersin — yatay, dikey ve çapraz olmak üzere 8 yönde hareket edebilirsin. Ancak aynı kareyi aynı kelimede iki kez kullanamazsın.

Süre
Klasik Boggle'da 3 dakikalık bir süre sınırı vardır. Süre dolunca tüm oyuncular kalemlerini bırakır.
Tekrar Eden Kelimeler
Eğer birden fazla oyuncu aynı kelimeyi bulduysa, o kelime tüm oyuncular için iptal edilir ve kimse puan almaz. Sadece benzersiz bulunan kelimeler sayılır — bu kural oyuna stratejik bir derinlik katar.


2. Oyun Mekaniği ve Kuralları:
- Mantık: Klasik [Oyun Adı] kuralları geçerlidir. Mekaniği sen kurgula.
- İstisnalar: [Varsa projemize özel bir kural ekle, yoksa "Klasik kurallar dışında özel bir kural yok" yaz]
- Açıklama ve SEO Metinleri: "Nasıl Oynanır?" kısmını, Adım Adım kuralları ve SEO (Metadata, Schema) ayarlarını sen tamamen hazırla ve `games.ts` ile `layout.tsx` dosyalarına uyumlu hale getir.

3. SKOR:
Kelime Uzunluğu
Geçerli sayılabilmesi için bir kelimenin en az 3 harf içermesi gerekir. 2 harfli kelimeler geçersizdir.
Puanlama (klasik kurallara göre)

3 harf → 1 puan
4 harf → 1 puan
5 harf → 2 puan
6 harf → 3 puan
7 harf → 5 puan
8+ harf → 11 puan

4. PROJE GÖRSELLERİ:
- KESİNLİKLE görsel üretme! 
- Oyun görselleri public/games/[slug]` klasörün eklendi. Bu görselleri kullan

5. PROJENİN NETLEŞTİRİLMESİ:
- Anlaşılmayan detaylar varsa kullanıcıya sor. 
- Önerilerin varsa kullanıcıya sun, gelen cevaba göre dökümanı güncelle.