import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'KVKK Aydınlatma Metni',
    description: 'Kelime Oyunları KVKK Aydınlatma Metni. Kişisel verilerinizin korunması ve işlenmesi hakkında detaylı bilgi.',
    alternates: {
        canonical: 'https://www.kelimeoyunlari.tr/kvkk',
    },
};

export default function KVKKPage() {
    return (
        <div className="min-h-screen bg-bg py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="premium-card bg-surface border border-surface-mid rounded-3xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-black text-text-main mb-8 border-b border-surface-mid pb-4">
                        KVKK Aydınlatma Metni
                    </h1>

                    <div className="space-y-8 text-text-secondary leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">1. Veri Sorumlusu</h2>
                            <p>
                                <strong>Kelime Oyunları</strong> platformu adına &quot;ixirmedya@gmail.com&quot; üzerinden iletişime geçebilirsiniz. Kişisel verilerinizin güvenliği ve korunması bizim için en yüksek önceliktir.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">2. İşlenen Kişisel Verileriniz</h2>
                            <p>Platformumuzu kullandığınızda aşağıdaki verileriniz işlenebilir:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Üyelik Bilgileri:</strong> E-posta adresi, kullanıcı adı ve seçtiğiniz profil emojisi.</li>
                                <li><strong>Oyun Verileri:</strong> Oynanan oyun sayısı, kazanma oranı, en iyi skorlar, seriler ve kazanılan rozetler.</li>
                                <li><strong>Teknik Bilgiler:</strong> IP adresi, cihaz bilgileri, tarayıcı türü ve kullanım alışkanlıkları (çerezler aracılığıyla).</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">3. Veri İşleme Amaçları</h2>
                            <p>Kişisel verileriniz şu amaçlarla işlenmektedir:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li>Kullanıcı hesabı oluşturulması ve yönetilmesi.</li>
                                <li>Oyun istatistiklerinin takibi ve liderlik tablolarının oluşturulması.</li>
                                <li>Misafir verilerinin üyelik durumunda Supabase üzerine aktarılması.</li>
                                <li>Google Ads aracılığıyla ilgi alanınıza yönelik reklamların sunulması.</li>
                                <li>Platform güvenliğinin sağlanması ve yasal yükümlülüklerin yerine getirilmesi.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">4. Verilerin Aktarımı</h2>
                            <p>Kişisel verileriniz, hizmetin sağlanması amacıyla aşağıdaki üçüncü taraflarla paylaşılmaktadır:</p>
                            <ul className="list-disc ml-6 mt-2 space-y-1">
                                <li><strong>Supabase:</strong> Kimlik doğrulama, veritabanı yönetimi ve veri depolama hizmetleri için.</li>
                                <li><strong>Google Ads:</strong> Web sitemizdeki reklamların yönetimi ve optimizasyonu için.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">5. Kullanıcı Hakları ve Hesap Silme</h2>
                            <p>
                                6698 Sayılı KVKK kapsamında verilerinizin işlenip işlenmediğini öğrenme, düzeltilmesini veya silinmesini isteme hakkına sahipsiniz.
                            </p>
                            <div className="mt-4 p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <p className="font-bold text-text-main mb-2">Hesap Silme:</p>
                                <p>
                                    Kullanıcılar, platform üzerindeki ayarlar menüsünü kullanarak hesaplarını ve buna bağlı tüm kişisel verilerini diledikleri zaman kalıcı olarak silebilirler.
                                </p>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-surface-mid">
                            <p>
                                Daha fazla bilgi veya haklarınızın kullanımı için <strong>ixirmedya@gmail.com</strong> adresine e-posta gönderebilirsiniz.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}
