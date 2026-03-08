import Link from 'next/link';

interface PseoHeroProps {
    gameName: string;
    gameHref: string;
    displayTitle: string;
    gameCTA: string;
    totalCount: number;
    heroFilterLabel: string;
    categoryCount: number;
}

export function PseoHero({
    gameName,
    gameHref,
    displayTitle,
    gameCTA,
    totalCount,
    heroFilterLabel,
    categoryCount,
}: PseoHeroProps) {
    return (
        <header className="pt-8 pb-10 sm:pt-10 sm:pb-12">
            <div className="max-w-6xl mx-auto px-4 sm:px-6">
                <div className="premium-card rounded-3xl p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                    <div className="absolute -top-24 -right-24 h-52 w-52 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

                    <div className="relative z-10 space-y-6">
                        <nav className="flex flex-wrap items-center gap-2 text-xs text-text-muted">
                            <Link href="/" className="hover:text-primary transition-colors">Anasayfa</Link>
                            <span>/</span>
                            <Link href={gameHref} className="hover:text-primary transition-colors">{gameName}</Link>
                            <span>/</span>
                            <span className="text-text-main font-bold">{displayTitle}</span>
                        </nav>

                        <div className="space-y-3">
                            <p className="inline-flex items-center rounded-full border border-primary/30 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                                pSEO Kelime Rehberi
                            </p>
                            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-text-main tracking-tight leading-tight">
                                {displayTitle}
                            </h1>
                            <p className="text-base sm:text-lg text-text-secondary max-w-3xl leading-relaxed">
                                {gameCTA}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            <div className="rounded-xl border border-surface/20 bg-surface/10 px-4 py-3">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Toplam Kelime</p>
                                <p className="text-xl font-black text-primary mt-1">{totalCount}</p>
                            </div>
                            <div className="rounded-xl border border-surface/20 bg-surface/10 px-4 py-3">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Filtre</p>
                                <p className="text-sm sm:text-base font-black text-text-main mt-1 line-clamp-1">{heroFilterLabel}</p>
                            </div>
                            <div className="rounded-xl border border-surface/20 bg-surface/10 px-4 py-3">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Oyun</p>
                                <p className="text-sm sm:text-base font-black text-text-main mt-1">{gameName}</p>
                            </div>
                            <div className="rounded-xl border border-surface/20 bg-surface/10 px-4 py-3">
                                <p className="text-xs text-text-muted uppercase tracking-wider font-bold">Kategori Sayisi</p>
                                <p className="text-sm sm:text-base font-black text-text-main mt-1">{categoryCount}</p>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
                            <Link
                                href={gameHref}
                                className="inline-flex items-center justify-center rounded-xl bg-primary text-black font-black px-5 py-3 hover:bg-primary/90 transition-colors"
                            >
                                {gameName} Oyna
                            </Link>
                            <Link
                                href="#kelime-listesi"
                                className="inline-flex items-center justify-center rounded-xl border border-surface/30 bg-surface/10 text-text-main font-bold px-5 py-3 hover:bg-surface/20 transition-colors"
                            >
                                Kelime Listesine Git
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
