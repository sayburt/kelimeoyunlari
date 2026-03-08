import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/components/seo/schemaGenerator';
import { getSynonymPairs, getSynonymSummary } from '@/lib/sozluk/synonyms';

const PAGE_PATH = '/kelimeler/es-anlamli-kelimeler';
const DISPLAY_LIMIT = 250;

export const metadata: Metadata = {
    title: 'Es Anlamli Kelimeler',
    description:
        'Sozluk kaynakli es anlamli kelimeleri tek sayfada inceleyin. Kelime oyunlarinda kullanabileceginiz ornek es anlamli listesi.',
    alternates: {
        canonical: PAGE_PATH,
    },
    openGraph: {
        title: 'Es Anlamli Kelimeler',
        description:
            'Sozluk kaynakli es anlamli kelimeleri tek sayfada inceleyin. Kelime oyunlarinda kullanabileceginiz ornek es anlamli listesi.',
        url: PAGE_PATH,
        type: 'website',
        locale: 'tr_TR',
        siteName: 'Kelime Oyunlari',
    },
};

export default function EsAnlamliKelimelerPage() {
    const summary = getSynonymSummary();
    const synonymPairs = getSynonymPairs().slice(0, DISPLAY_LIMIT);

    return (
        <div className="min-h-screen bg-bg hero-glow py-12 px-4 md:px-8">
            <JsonLd
                data={buildBreadcrumbSchema([
                    { name: 'Anasayfa', item: '/' },
                    { name: 'Kelimeler', item: '/kelimeler' },
                    { name: 'Es Anlamli Kelimeler', item: PAGE_PATH },
                ])}
            />

            <div className="max-w-6xl mx-auto space-y-8">
                <header className="premium-card bg-surface border border-surface-mid rounded-3xl p-6 md:p-10">
                    <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tight">
                        Es Anlamli <span className="text-primary">Kelimeler</span>
                    </h1>
                    <p className="mt-4 text-text-secondary max-w-3xl leading-relaxed">
                        Bu sayfa, sozluk verisindeki &quot;►&quot; yonlendirmelerinden uretilen es anlamli kelime iliskilerini sunar.
                        Asagidaki listeyi hem genel dil calismasinda hem de kelime oyunu stratejisinde kullanabilirsiniz.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="premium-card bg-surface border border-surface-mid rounded-2xl p-5">
                        <p className="text-sm text-text-muted">Toplam iliski</p>
                        <p className="text-3xl font-black text-text-main mt-2">{summary.totalPairs.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="premium-card bg-surface border border-surface-mid rounded-2xl p-5">
                        <p className="text-sm text-text-muted">Kaynak kelime</p>
                        <p className="text-3xl font-black text-text-main mt-2">{summary.totalSourceWords.toLocaleString('tr-TR')}</p>
                    </div>
                    <div className="premium-card bg-surface border border-surface-mid rounded-2xl p-5">
                        <p className="text-sm text-text-muted">Hedef kelime</p>
                        <p className="text-3xl font-black text-text-main mt-2">{summary.totalTargetWords.toLocaleString('tr-TR')}</p>
                    </div>
                </section>

                <section className="premium-card bg-surface border border-surface-mid rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-black text-text-main">Es Anlamli Ornek Listesi</h2>
                    <p className="text-text-secondary mt-2">
                        Ilk {DISPLAY_LIMIT} cift alfabetik olarak listelenmektedir.
                    </p>

                    <div className="mt-6 overflow-x-auto rounded-2xl border border-surface-mid">
                        <table className="w-full text-left min-w-[520px]">
                            <thead className="bg-surface-mid/40">
                                <tr>
                                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-text-muted">Kelime</th>
                                    <th className="px-4 py-3 text-xs font-black uppercase tracking-wide text-text-muted">Es anlamlisi</th>
                                </tr>
                            </thead>
                            <tbody>
                                {synonymPairs.map((pair) => (
                                    <tr
                                        key={`${pair.word}-${pair.synonym}`}
                                        className="border-t border-surface-mid/70 odd:bg-surface/10"
                                    >
                                        <td className="px-4 py-3 text-text-main font-bold">{pair.word}</td>
                                        <td className="px-4 py-3 text-text-secondary">{pair.synonym}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                <section className="premium-card bg-surface border border-surface-mid rounded-3xl p-6 md:p-8">
                    <h2 className="text-2xl font-black text-text-main">Kelime oyunlarinda kullan</h2>
                    <p className="text-text-secondary mt-2">
                        Es anlamli dusunme, hem tahmin odakli hem de hiz odakli oyunlarda dogru kelimeyi bulma sansini artirir.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-3">
                        <Link href="/games/wordle" className="premium-btn px-4 py-2 rounded-xl bg-primary text-black font-bold">
                            Wordle Oyna
                        </Link>
                        <Link href="/games/boggle" className="premium-btn px-4 py-2 rounded-xl bg-surface-mid text-text-main font-bold">
                            Boggle Oyna
                        </Link>
                        <Link href="/games/kelime-arama" className="premium-btn px-4 py-2 rounded-xl bg-surface-mid text-text-main font-bold">
                            Kelime Arama Oyna
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
}
