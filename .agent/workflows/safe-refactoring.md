---
description: Proje genelinde güvenli refactoring ve kod iyileştirme adımlarını belirler.
---

# Safe Refactoring & Code Quality Workflow

Bu iş akışı, projedeki mevcut çalışan yapıyı bozmadan kod kalitesini artırmak için izlenmesi gereken adımları tanımlar.

## 1. Hazırlık ve Analiz
Refactoring işlemine başlamadan önce:
- [ ] **Etki Analizi:** Değiştirilecek fonksiyon veya bileşenin nerelerde kullanıldığını `grep_search` veya `view_file` ile tara.
- [ ] **Referans Kontrolü:** İlgili kodun `PRD.md` içindeki iş kuralıyla (business logic) çelişip çelişmediğini kontrol et.
- [ ] **Mevcut Durum:** Kodun şu anki çıktısını/davranışını not et (Gerekirse terminal ile mevcut build durumunu kontrol et).

## 2. Refactoring Kuralları
// turbo
1. **Küçük Adımlar (Atomic Changes):** Tek bir devasa değişiklik yerine, her aşaması test edilebilir küçük parçalar halinde ilerle.
2. **Arayüzü (API) Koru:** Eğer zorunlu değilse, fonksiyonların aldığı parametreleri ve dönüş tiplerini değiştirme. Değiştirmen gerekiyorsa, tüm çağrı noktalarını (call-sites) aynı anda güncelle.
3. **BOM Freeze Uyumu:** Refactoring yaparken yeni bir kütüphane ekleme veya tasarım sisteminin (`tasarim-sistemi/SKILL.md`) dışına çıkma. Sadece mevcut yapıları daha temiz hale getir.
4. **DRY vs WET:** Tekrar eden kodları (`DRY`) temizlerken, aşırı soyutlamadan (over-engineering) kaçın. Okunabilirlik, kısalıktan daha önemlidir.

## 3. Doğrulama (Post-Refactor)
// turbo
1. **Statik Analiz:** Değişiklik sonrası `npm run build` veya `tsc` (TypeScript) kontrolü yaparak tip hatalarını kontrol et.
2. **Görsel Kontrol:** Eğer UI refactoring yapıldıysa, bileşenin farklı ekran boyutlarında ve Light/Dark modda bozulmadığını doğrula.
3. **Güvenlik Kontrolü:** Eğer veri katmanında refactoring yapıldıysa, RLS politikalarının hala geçerli olduğunu doğrula.

## 4. Kayıt ve Temizlik
- [ ] Gereksiz yorum satırlarını ve "dead code" (kullanılmayan kod) parçalarını temizle.
- [ ] `TASKS.md` üzerindeki refactor görevini güncelle.
- [ ] Eğer dökümantasyonda bir değişiklik gerekiyorsa dökümanları güncelle.

---
**ÖNEMLİ:** Eğer refactoring sırasında bir "breaking change" (kırıcı değişiklik) yapılması gerekiyorsa, kullanıcıdan onay almadan ilerleme!
