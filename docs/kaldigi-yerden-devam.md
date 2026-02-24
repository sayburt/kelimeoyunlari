Bu döküman, Kelime Oyunları projesine eklenecek olan "Sonra Devam Et" özelliğinin senaryolarını, mantığını ve uygulama kurallarını içerir.

## 1. Genel Bakış

Kayıtlı oyun özelliği, giriş yapmış üye kullanıcıların oyunu yarıda bırakıp daha sonra kaldıkları yerden, aynı süreyle devam edebilmesini sağlayan bir mekanizmadır. Kayıt işlemi yalnızca kullanıcının bilinçli olarak **"Sonra Devam Et"** butonuna basmasıyla gerçekleşir; otomatik kayıt yoktur. Bu kural, kullanıcının sayfayı kapatarak sayacı durdurmasının önüne geçer ve hile girişimlerini engeller.

## 2. Kullanıcı Akışı (User Journey)

1. **Oyun Sırasında:** Kullanıcı oynarken ekranda **"Sonra Devam Et"** butonu görünür.
2. **Kayıt:** Kullanıcı butona bastığı an sayaç durur, oyunun anlık durumu ve geçen süre veritabanına kaydedilir, oyun ekranı kapanır ve kullanıcı ana menüye yönlendirilir.
3. **Geri Dönüş:** Kullanıcı daha sonra aynı oyun türüne girdiğinde sistem veritabanında kayıtlı bir oyun olup olmadığını kontrol eder.
4. **Uyarı Ekranı:** Kayıtlı oyun bulunursa oyun direkt başlamaz; kullanıcıya bir uyarı penceresi gösterilir: *"Kayıtlı bir oyunun var. Devam edersen kaldığın yerden başlayacaksın ve süre o noktadan işlemeye devam edecek. Ne yapmak istersin?"*
5. **Kullanıcı Seçimi:** Kullanıcı iki seçenekten birini seçer: **Kaldığım Yerden Devam Et** veya **Yeni Oyun Başlat.**

## 3. Senaryo A — Kaldığı Yerden Devam Etmek

Kullanıcı **"Devam Et"** seçeneğini seçtiğinde veritabanındaki kayıt yüklenir, tahta ve harfler kayıtlı haliyle geri gelir ve sayaç tam kaldığı süreden itibaren işlemeye devam eder. Oyun normal şekilde tamamlandığında istatistikler kaydedilir ve veritabanındaki geçici oyun kaydı silinir.

## 4. Senaryo B — Yeni Oyun Başlatmak

Kullanıcı **"Yeni Oyun"** seçeneğini seçtiğinde veritabanındaki eski kayıt kalıcı olarak silinir. Yarım kalan oyuna ait hiçbir istatistik kaydedilmez. Yeni oyun sıfırdan, boş bir tahtayla başlar.

## 5. Veri Kuralları

- **Tekil kayıt:** Her kullanıcı için her oyun türünde yalnızca bir kayıt tutulur. Kullanıcı ikinci kez "Sonra Devam Et" derse önceki kaydın üzerine yazılır.
- **Saklanan bilgiler:** Oyunun anlık durumu (tahta, harfler, skor), o ana kadar geçen süre ve kayıt zamanı.
- **Kayıt silinme koşulları:** Oyun başarıyla tamamlandığında veya kullanıcı "Yeni Oyun" seçtiğinde kayıt silinir.
- **Çok cihaz desteği:** Veriler kullanıcıya ait olduğundan kullanıcı telefonda bıraktığı oyuna bilgisayardan devam edebilir. Aynı anda iki cihazda oynama engellenmez; bu durumda son kaydeden geçerli sayılır.

## 6. Kapsam Dışı

- Kullanıcı **"Sonra Devam Et"** butonuna basmadan sayfayı kapatırsa oyun kurtarılmaz; bu bilinçli bir tasarım kararıdır.
- Aynı anda iki cihazda oynama senaryosu şu aşamada ele alınmamaktadır.