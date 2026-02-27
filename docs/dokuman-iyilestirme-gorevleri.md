# Dokümantasyon İyileştirme ve Tutarlılık Görevleri

Bu liste, projedeki dökümanlar arasındaki tutarsızlıkları gidermek ve gereksiz tekrarları temizlemek için hazırlanan aksiyon planıdır.

---

## 🔴 Kritik ve Acil Düzeltmeler (Tutarsızlıklar)

- [ ] **Kelime Verisi Yolu Güncellemesi:**
  - `prd.md`, `proje-kurallari/SKILL.md` ve `veri-yonetimi/SKILL.md` içindeki konum bilgilerini `public/kelime-data.json` olarak düzelt.
- [ ] **Workflow Dosyası Temizliği:**
  - `.agent/workflows/safe-refactoring.md` içindeki projede bulunmayan skill referanslarını (`premium-ui-enforcer`, `supabase-security-guardian`, `auto-doc-sync`) kaldır veya mevcut olanlarla değiştir.
  - Aynı dosyadaki `design-system.md` referansını `tasarim-sistemi/SKILL.md` olarak güncelle.
- [ ] **İsimlendirme Birliği:**
  - `public/games/hangman` klasör ismini `public/games/adam-asmaca` olarak değiştir (veya tersi) ve dökümanları buna göre senkronize et.
- [ ] **Kaldığı Yerden Devam Senaryosu:**
  - `docs/kaldigi-yerden-devam.md` içindeki "Çok cihaz desteği" maddesini, `TASKS.md` (Faz 5.5) ile uyumlu hale getir (Supabase kullanıldığı için desteklendiğini onayla).

## 🟡 İyileştirme ve Sadeleştirme (Redundancy)

- [ ] **README.md Revizyonu:**
  - Varsayılan Next.js içeriğini sil.
  - Proje amacını, temel komutları ve `prd.md` / `TASKS.md` dosyalarına yönlendiren bir rehber ekle.
- [ ] **Tasarım Dökümanı Konsolidasyonu:**
  - `docs/tasarim-revizyon.md` içeriğini `.agent/skills/tasarim-sistemi/SKILL.md` içine aktar ve eski dosyayı arşive kaldır.
- [ ] **Supabase Kuralları Sadeleştirmesi:**
  - `proje-kurallari/SKILL.md` ve `veri-yonetimi/SKILL.md` içindeki mükerrer Supabase/MCP kurallarından birini daha genel hale getirip diğerini referans vererek kısalt.
- [ ] **SEO Kuralları Senkronu:**
  - `oyun-standartlari/SKILL.md` ve `seo-uzmani/SKILL.md` arasındaki örtüşen metadata kurallarını tek bir ana kaynağa bağla.

## 🟢 Takip ve Temizlik

- [ ] **Eski Task Arşivi:**
  - `TASKS.md` içindeki arşive alınmış ama halen dökümanlarda yaşayan eski referansları kontrol et.

---
*Not: Bu liste, "Single Source of Truth" (Tek Doğru Kaynak) prensibi hedeflenerek oluşturulmuştur.*
