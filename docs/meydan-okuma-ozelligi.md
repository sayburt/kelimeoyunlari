# Meydan Okuma (Challenge) Özelliği – Teknik Tasarım Dökümanı

Bu döküman, Kelime Oyunları projesine Faz-2 aşamasında eklenecek olan "Arkadaşına Meydan Oku" özelliğinin teknik detaylarını ve uygulama adımlarını içerir.

## 1. Genel Bakış
Meydan okuma özelliği, bir kullanıcının (Meydan Okuyan) belirli bir kelime seçerek bir davet bağlantısı oluşturmasını ve bu bağlantıyı bir arkadaşına (Oyuncu) göndererek onun bu kelimeyi tahmin etmesini sağlayan sosyal bir oyun modudur.

## 2. Kullanıcı Akışı (User Journey)
1. **Oluşturma:** Üye kullanıcı oyun ekranındaki "Meydan Oku" butonuna tıklar.
2. **Hibrit Kelime Seçimi:** Kullanıcıya iki seçenek sunulur:
    - **A) Sözlükten Seç:** Sistemdeki kayıtlı, anlamlı Türkçe kelimelerden biri.
    - **B) Özel Kelime:** Kendi belirlediği bir kelime (Örn: özel isim, İngilizce, argo vb.).
3. **Oyun Bazlı Kurallar ve Mantıksal Sınırlar (Zorunlu):** Her oyunun kendi teknik limitlerine göre bir doğrulama mekanizması çalışır:
    - **Sabit Uzunluklu Oyunlar (Örn: Wordle):** Seçilen kelime tam olarak oyunun gerektirdiği harf sayısında (Örn: 5) olmalıdır. Farklı bir uzunluk girilirse sistem hata verir.
    - **Esnek Uzunluklu Oyunlar (Örn: Adam Asmaca):** Belirlenmiş bir aralık veya maksimum sınır (Örn: 3-10 harf arası) dahilinde herhangi bir uzunluk seçilebilir. Ancak mantıksal sınırın (Örn: max 10 harf) dışına çıkıldığında sistem kullanıcıyı uyarır.
    - **Uyarı Mekanizması:** Kullanıcı geçersiz bir kelime girdiğinde, sistemsel bir pop-up veya inline uyarı ile "Bu oyun için kelime 3 ile 10 harf arasında olmalıdır" gibi net bir geri bildirim verilir.
4. **Mod Kaydı:** Meydan okuma verisinde kelimenin "Sözlük" mü yoksa "Özel" mi olduğu bilgisi tutulur. Eğer "Özel" seçilmişse, oyun sırasında sözlük kontrolü (isValidWord) pasif hale getirilir.
5. **Kaydetme:** Kelime ve mod bilgisi Supabase `challenges` tablosuna kaydedilir.
4. **Paylaşım:** Sistem bir URL üretir: `https://www.kelimeoyunlari.tr/games/wordle?challengeId={UUID}`. Kullanıcı bu linki kopyalar.
5. **Oynama:** Alıcı linke tıkladığında, oyun motoru URL'deki `challengeId`'yi algılar, veritabanından kelimeyi çeker ve oyunu başlatır.
6. **Sonuç:** Oyuncu oyunu bitirdiğinde, skor veritabanına işlenir ve meydan okuyana bildirim/statü güncellemesi gider.

## 3. Teknik Gereksinimler

### 3.1. Veritabanı Şeması (Supabase)
`challenges` tablosu şu kolonları içermelidir:
- `id`: UUID (Primary Key)
- `created_by`: UUID (Profiles tablosuna referans)
- `game_name`: String (Örn: 'wordle')
- `target_word_type`: Enum ('dictionary', 'custom') -> Kelimenin sözlükte olup olmadığı bilgisi.
- `target_word`: String (Şifrelenmiş)
- `word_length`: Integer -> Oyunun stabilitesini korumak için gerekli.
- `result_score`: Integer (Alıcının kaç tahminde bildiği)

### 3.2. Frontend Mantığı
- **URL Parametre Kontrolü:** `app/games/[name]/page.tsx` içinde `searchParams` kontrol edilmelidir.
- **Hook Güncellemesi:** `useGame` hook'u, eğer bir `challengeId` varsa:
    - `wordService.getRandomWord` yerine `challengeService.getChallengeWord` fonksiyonunu çağırmalıdır.
    - **Sözlük Kontrolü Devre Dışı:** Normal oyunlarda olan `isValidWord` kontrolü, meydan okuma oyunlarında kullanıcıyı kısıtlamamak için kapatılmalıdır. Böylece oyuncu da serbestçe kelime girebilir.
- **Paylaşma API'sı:** Web Share API kullanılarak mobil cihazlarda doğrudan WhatsApp/Instagram paylaşım penceresi açılabilir.

## 4. Karşılaşılan Zorluklar ve Çözümler

### 4.1. Güvenlik ve Spoyler (Spoiler) Önleme
- **Zorluk:** Teknik bilgisi olan bir kullanıcı, tarayıcı konsolundan veya ağ isteklerinden hedef kelimeyi görebilir.
- **Çözüm:** 
    - Kelime veritabanında düz metin olarak değil, bir hash veya basit bir şifreleme ile tutulmalıdır.
    - Alternatif olarak; kelime hiçbir zaman istemciye (client) tam olarak gönderilmez. Kullanıcı her tahmin yaptığında bir Edge Function (Supabase) üzerinden kontrol sağlanır.

### 4.2. Misafir vs Üye Durumu
- **Zorluk:** Meydan okumayı alan kişi üye olmayabilir.
- **Çözüm:** Meydan okuma linkleri herkes tarafından oynanabilir olmalıdır. Ancak skorun "Meydan Okuyan" kişiye geri dönebilmesi için alıcının oyun sonunda bir "Rumuz" girmesi veya giriş yapması teşvik edilmelidir.

### 4.3. Link Geçerliliği
- **Zorluk:** Veritabanında biriken binlerce eski meydan okuma linki.
- **Çözüm:** `expires_at` kolonu ile 7 gün veya 30 gün sonra otomatik silinen (Supabase Cron veya TTL) kayıtlar oluşturulmalıdır.

## 5. Faz-2 Uygulama Adımları
1. [ ] Supabase'de `challenges` tablosunun oluşturulması.
2. [ ] `challengeService.ts` dosyasının oluşturulması (Create/Get işlemleri için).
3. [ ] Wordle oyun ekranına "Meydan Oku" modal bileşeninin eklenmesi.
4. [ ] Dinamik route yapısının parametreleri okuyacak şekilde güncellenmesi.
5. [ ] Sosyal medya paylaşım butonlarının entegrasyonu.

---
*Bu döküman Kelime Oyunları Mimari Standartlarına uygun olarak hazırlanmıştır.*
