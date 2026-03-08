import type { Metadata } from 'next';
import Link from 'next/link';
import { JsonLd } from '@/components/seo/JsonLd';
import { buildBreadcrumbSchema } from '@/components/seo/schemaGenerator';
import { generateSlug } from '@/lib/pseo/slugGenerator';
import { WORDLE_PSEO_TARGET_LENGTH } from '@/lib/pseo/config';

const PAGE_PATH = '/kelimeler';
const WORD_LIST_PATH = `/kelimeler/${generateSlug({ length: WORDLE_PSEO_TARGET_LENGTH })}`;

export const metadata: Metadata = {
    title: 'Kelimeler Merkezi',
    description:
        'Kelime listeleri ve sozluk tabanli pSEO iceriklerini tek merkezden inceleyin. Harf, uzunluk ve es anlam odakli sayfalar bu alanda toplanir.',
    alternates: {
        canonical: PAGE_PATH,
    },
};

export default function KelimelerPage() {
    return (
        <div className="min-h-screen bg-bg hero-glow py-12 px-4 md:px-8">
            <JsonLd
                data={buildBreadcrumbSchema([
                    { name: 'Anasayfa', item: '/' },
                    { name: 'Kelimeler', item: PAGE_PATH },
                ])}
            />

            <div className="max-w-5xl mx-auto space-y-8">
                <header className="premium-card bg-surface border border-surface-mid rounded-3xl p-6 md:p-10">
                    <h1 className="text-3xl md:text-5xl font-black text-text-main tracking-tight">
                        Kelimeler <span className="text-primary">Merkezi</span>
                    </h1>
                    <p className="mt-4 text-text-secondary max-w-3xl leading-relaxed">
                        Tum pSEO kelime sayfalarini tek yerden yonetiyoruz. Asagidan kelime listesi ve sozluk odakli sayfalara gecebilirsin.
                    </p>
                </header>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Link
                        href={WORD_LIST_PATH}
                        className="premium-card bg-surface border border-surface-mid rounded-2xl p-6 transition-colors hover:border-primary/40"
                    >
                        <h2 className="text-2xl font-black text-text-main">Kelime Listeleri</h2>
                        <p className="text-text-secondary mt-2">
                            Harf, uzunluk ve filtre bazli otomatik uretilen kelime listelerini kesfet.
                        </p>
                    </Link>

                    <Link
                        href="/kelimeler/es-anlamli-kelimeler"
                        className="premium-card bg-surface border border-surface-mid rounded-2xl p-6 transition-colors hover:border-primary/40"
                    >
                        <h2 className="text-2xl font-black text-text-main">Es Anlamli Kelimeler</h2>
                        <p className="text-text-secondary mt-2">
                            Sozluk verisinden uretilen es anlamli kelime iliskilerini toplu olarak incele.
                        </p>
                    </Link>
                </section>
            </div>
        </div>
    );
}
