import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getFilteredWords, calculateWordStats, getWordlePseoFilters, TURKISH_ALPHABET } from '@/lib/wordData';
import { parseSlug, type ValidGameId } from '@/lib/pseo/slugParser';
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
import { isIndexableWordCount } from '@/lib/pseo/config';

interface PageProps {
    params: Promise<{ slug: string }>;
}

const DEFAULT_GAME_ID: ValidGameId = 'wordle';

const GAME_HREFS: Record<ValidGameId, string> = {
    wordle: '/games/wordle',
    'adam-asmaca': '/games/adam-asmaca',
    boggle: '/games/boggle',
    'kelime-arama': '/games/kelime-arama',
};

export function generateStaticParams() {
    const pseoFilters = getWordlePseoFilters();
    return pseoFilters.map((filter) => ({
        slug: generateSlug(filter),
    }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const parsed = parseSlug(slug, DEFAULT_GAME_ID);

    if (!parsed.isValid) {
        return { title: 'Sayfa Bulunamadi' };
    }

    const words = getFilteredWords(parsed.filter);
    const stats = calculateWordStats(words);

    const title = generatePageTitle(parsed);
    const description = generateMetaDescription(parsed, stats);
    const canonicalPath = `/kelimeler/${slug}`;
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

export default async function KelimelerPseoPage({ params }: PageProps) {
    const { slug } = await params;
    const gameId = DEFAULT_GAME_ID;
    const parsed = parseSlug(slug, gameId);

    if (!parsed.isValid) {
        notFound();
    }

    const words = getFilteredWords(parsed.filter);
    const stats = calculateWordStats(words);

    if (words.length === 0) {
        notFound();
    }

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
    const canonicalPath = `/kelimeler/${slug}`;

    const schemas = buildPseoSchemas({
        gameName,
        gameHref,
        displayTitle: parsed.displayTitle,
        canonicalPath,
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-8">
                        <PageDescription description={description} />

                        <section>
                            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                Istatistikler
                            </h2>
                            <WordStatsCards stats={stats} />
                        </section>

                        <section id="kelime-listesi">
                            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                Kelime Listesi ({stats.totalCount} kelime)
                            </h2>
                            <WordListTable words={words} />
                        </section>

                        <FaqSection items={faqItems} />
                    </div>

                    <aside className="space-y-6">
                        <RelatedLinks
                            currentLetter={parsed.filter.startsWith}
                            currentLength={parsed.filter.length}
                            gameId={gameId}
                            gameHref={gameHref}
                            gameName={gameName}
                            availableLetters={availableLetters}
                        />

                        <StrategyCard tips={strategyTips} gameName={gameName} />
                    </aside>
                </div>
            </div>
        </main>
    );
}
