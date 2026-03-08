import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFilteredWords, calculateWordStats, getWordlePseoFilters, TURKISH_ALPHABET } from '@/lib/wordData';
import { parseSlug, isValidGameId } from '@/lib/pseo/slugParser';
import { generateSlug } from '@/lib/pseo/slugGenerator';
import {
    generateMetaDescription,
    generatePageTitle,
    generatePageDescription,
    generateStrategyTips,
    generateFAQItems,
    getGameName,
    getGameCTA,
} from '@/lib/pseo/contentTemplates';
import { SITE_URL } from '@/components/seo/schemaGenerator';
import { JsonLd } from '@/components/seo/JsonLd';
import { WordListTable } from '@/components/pseo/WordListTable';
import { WordStatsCards } from '@/components/pseo/WordStatsCards';
import { StrategyCard } from '@/components/pseo/StrategyCard';
import { RelatedLinks } from '@/components/pseo/RelatedLinks';
import { PageDescription } from '@/components/pseo/PageDescription';
import { PseoHero } from '@/components/pseo/PseoHero';
import { FaqSection } from '@/components/pseo/FaqSection';
import Navbar from '@/components/layout/Navbar';
import { buildPseoSchemas } from '@/lib/pseo/pageSchemas';
import { isIndexableWordCount, PSEO_GAME_IDS } from '@/lib/pseo/config';

// ---------- Types ----------

interface PageProps {
    params: Promise<{ gameId: string; slug: string }>;
}

// ---------- Oyun bilgileri ----------

const GAME_HREFS: Record<string, string> = {
    wordle: '/games/wordle',
    'adam-asmaca': '/games/adam-asmaca',
    boggle: '/games/boggle',
    'kelime-arama': '/games/kelime-arama',
};

// ---------- Static Params (SSG - Build Time) ----------

/**
 * Build time'da uretilecek tum sayfa kombinasyonlari.
 * Faz-2 kapsam:
 * - Harf + 5 harfli (pilot)
 * - 5 harfli hub
 * - Sonu XX ile biten 5 harfli (top 20)
 * - Icinde J ve Z olmayan 5 harfli
 */
export function generateStaticParams() {
    const params: { gameId: string; slug: string }[] = [];
    const pseoFilters = getWordlePseoFilters();
    const gameIds = PSEO_GAME_IDS;

    for (const gameId of gameIds) {
        for (const filter of pseoFilters) {
            params.push({
                gameId,
                slug: generateSlug(filter),
            });
        }
    }

    return params;
}

// ---------- Metadata ----------

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { gameId, slug } = await params;
    const parsed = parseSlug(slug, gameId);

    if (!parsed.isValid) {
        return { title: 'Sayfa Bulunamadi' };
    }

    const words = getFilteredWords(parsed.filter);
    const stats = calculateWordStats(words);

    const title = generatePageTitle(parsed);
    const description = generateMetaDescription(parsed, stats);
    const canonicalPath = `/games/${gameId}/p/${slug}`;

    // Thin content korumasi: 3'ten az kelime varsa noindex
    const shouldIndex = isIndexableWordCount(words.length);

    return {
        title,
        description,
        alternates: {
            canonical: canonicalPath,
        },
        openGraph: {
            title,
            description,
            url: `${SITE_URL}${canonicalPath}`,
            type: 'website',
            locale: 'tr_TR',
            siteName: 'Kelime Oyunlari',
        },
        twitter: {
            card: 'summary',
            title,
            description,
        },
        robots: shouldIndex
            ? { index: true, follow: true }
            : { index: false, follow: true },
    };
}

// ---------- Page Component ----------

export default async function PseoPage({ params }: PageProps) {
    const { gameId, slug } = await params;

    // Gecerlilik kontrolleri
    if (!isValidGameId(gameId)) {
        notFound();
    }

    const parsed = parseSlug(slug, gameId);
    if (!parsed.isValid) {
        notFound();
    }

    // Veri cek
    const words = getFilteredWords(parsed.filter);
    const stats = calculateWordStats(words);

    // Thin content korumasi: Hicbir kelime yoksa 404
    if (words.length === 0) {
        notFound();
    }

    // Icerik uret
    const gameName = getGameName(gameId);
    const gameHref = GAME_HREFS[gameId] || '/';
    const description = generatePageDescription(parsed, stats);
    const strategyTips = generateStrategyTips(parsed, stats);
    const faqItems = generateFAQItems(parsed, stats);
    const gameCTA = getGameCTA(gameId);
    const categoryCount = Object.keys(stats.categoryDistribution).length;
    const availableLetters = parsed.filter.length
        ? TURKISH_ALPHABET.filter((letter) =>
            isIndexableWordCount(
                getFilteredWords({ startsWith: letter, length: parsed.filter.length }).length
            )
        )
        : undefined;
    const heroFilterLabel = parsed.filter.startsWith
        ? `${parsed.filter.startsWith.toLocaleUpperCase('tr-TR')} ile baslayan`
        : parsed.filter.endsWith
            ? `${parsed.filter.endsWith.toLocaleUpperCase('tr-TR')} ile biten`
            : parsed.filter.excludeLetters
                ? `${parsed.filter.excludeLetters.map((letter) => letter.toLocaleUpperCase('tr-TR')).join(' ve ')} harflerini icermeyen`
                : `${parsed.filter.length || ''} harfli`;

    const schemas = buildPseoSchemas({
        gameName,
        gameHref,
        displayTitle: parsed.displayTitle,
        gameId,
        slug,
        words,
        description: generateMetaDescription(parsed, stats),
        faqItems,
    });

    return (
        <main className="min-h-screen bg-bg hero-glow">
            <JsonLd data={schemas} />
            <Navbar />
            <PseoHero
                gameName={gameName}
                gameHref={gameHref}
                displayTitle={parsed.displayTitle}
                gameCTA={gameCTA}
                totalCount={stats.totalCount}
                heroFilterLabel={heroFilterLabel}
                categoryCount={categoryCount}
            />

            {/* Content */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Ana icerik (sol - 2/3) */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Dinamik aciklama */}
                        <PageDescription description={description} />

                        {/* Istatistikler */}
                        <section>
                            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                Istatistikler
                            </h2>
                            <WordStatsCards stats={stats} />
                        </section>

                        {/* Kelime listesi */}
                        <section id="kelime-listesi">
                            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                Kelime Listesi ({stats.totalCount} kelime)
                            </h2>
                            <WordListTable words={words} />
                        </section>

                        <FaqSection items={faqItems} />
                    </div>

                    {/* Sidebar (sag - 1/3) */}
                    <aside className="space-y-6">
                        {/* Oyuna yonlendirme ve ilgili linkler */}
                        <RelatedLinks
                            currentLetter={parsed.filter.startsWith}
                            currentLength={parsed.filter.length}
                            gameId={gameId as 'wordle' | 'adam-asmaca' | 'boggle' | 'kelime-arama'}
                            gameHref={gameHref}
                            gameName={gameName}
                            availableLetters={availableLetters}
                        />

                        {/* Strateji ipuclari */}
                        <StrategyCard tips={strategyTips} gameName={gameName} />
                    </aside>
                </div>
            </div>
        </main>
    );
}
