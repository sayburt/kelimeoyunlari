import React from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Gizlilik Politikası',
    description: 'Kelime Oyunları Gizlilik Politikası. Verilerinizin nasıl toplandığı, kullanıldığı ve korunduğu hakkında bilgi edinin.',
    alternates: {
        canonical: 'https://www.kelimeoyunlari.tr/privacy',
    },
};

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-bg py-12 px-4 md:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="premium-card bg-surface border border-surface-mid rounded-3xl p-8 md:p-12">
                    <h1 className="text-3xl md:text-4xl font-black text-text-main mb-8 border-b border-surface-mid pb-4">
                        Gizlilik Politikası
                    </h1>

                    <div className="space-y-8 text-text-secondary leading-relaxed">
                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">Giriş</h2>
                            <p>
                                <strong>Kelime Oyunları</strong> olarak, ziyaretçilerimizin ve kullanıcılarımızın gizliliğini korumak temel ilkemizdir. Bu politika, hangi verileri topladığımızı ve bunları nasıl kullandığımızı açıklar.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">Toplanan Bilgiler</h2>
                            <div className="space-y-4">
                                <div>
                                    <h3 className="font-bold text-text-main">1. Üye Verileri</h3>
                                    <p>
                                        Hesap oluşturduğunuzda e-posta adresiniz ve kullanıcı adınız Supabase Auth servisleri aracılığıyla güvenli bir şekilde saklanır. Bu veriler yalnızca platforma giriş yapabilmeniz ve istatistiklerinizin size özel tutulması için kullanılır.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main">2. Misafir Verileri</h3>
                                    <p>
                                        Üye olmadan oyun oynadığınızda, istatistikleriniz ve tercihleriniz (ses, tema vb.) yalnızca tarayıcınızın <strong>LocalStorage</strong> alanında saklanır. Bu veriler sunucularımıza gönderilmez.
                                    </p>
                                </div>
                                <div>
                                    <h3 className="font-bold text-text-main">3. Çerezler ve Reklamlar</h3>
                                    <p>
                                        Platformumuzda Google Ads reklamları yayınlanmaktadır. Google, web sitemizi ziyaret eden kullanıcılara ilgi alanlarına göre reklam sunmak için çerezleri (&quot;cookies&quot;) kullanabilir.
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-xl font-bold text-text-main mb-3">Veri Silme Politikası</h2>
                            <div className="p-4 bg-primary/5 rounded-xl border border-primary/10">
                                <p>
                                    Kullanıcı deneyimine verdiğimiz önem gereği, tüm kullanıcılarımıza <strong>hesaplarını diledikleri zaman silme hakkı</strong> tanıyoruz. Hesabınızı sildiğinizde; e-posta adresiniz, profil bilgileriniz ve tüm oyun geçmişiniz veritabanımızdan kalıcı olarak kaldırılır.
                                </p>
                            </div>
                        </section>

                        <section className="pt-6 border-t border-surface-mid">
                            <h2 className="text-xl font-bold text-text-main mb-3">İletişim</h2>
                            <p>
                                Gizlilik politikamızla ilgili her türlü soru, görüş veya veri silme talebiniz için bizimle iletişime geçebilirsiniz:
                            </p>
                            <p className="mt-2">
                                <strong>E-posta:</strong> <a href="mailto:ixirmedya@gmail.com" className="text-primary hover:underline">ixirmedya@gmail.com</a>
                            </p>
                        </section>

                        <p className="text-sm italic pt-4">Son Güncelleme: Şubat 2026</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
