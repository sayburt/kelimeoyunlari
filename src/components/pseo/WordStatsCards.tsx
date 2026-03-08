import type { WordStats } from '@/lib/wordData';

interface WordStatsCardsProps {
    stats: WordStats;
}

export function WordStatsCards({ stats }: WordStatsCardsProps) {
    const topCategories = Object.entries(stats.categoryDistribution)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5);
    const categoryCount = Object.keys(stats.categoryDistribution).length;

    return (
        <div className="space-y-6">
            {/* Ana istatistikler */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-surface/10 border border-surface/20 text-center">
                    <p className="text-2xl font-black text-primary">{stats.totalCount}</p>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">Toplam Kelime</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface/10 border border-surface/20 text-center">
                    <p className="text-2xl font-black text-text-main">{topCategories[0]?.[0] || '-'}</p>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">En Yaygn Kat.</p>
                </div>
                <div className="p-4 rounded-2xl bg-surface/10 border border-surface/20 text-center">
                    <p className="text-2xl font-black text-text-main">{categoryCount}</p>
                    <p className="text-xs font-bold text-text-muted uppercase tracking-wider mt-1">Kategori Sayisi</p>
                </div>
            </div>

            {/* Kategori dagilimi */}
            {topCategories.length > 0 && (
                <div className="p-5 rounded-2xl bg-surface/10 border border-surface/20">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4">
                        En Yaygn Kategoriler
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {topCategories.map(([cat, count]) => (
                            <span
                                key={cat}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-bold"
                            >
                                <span className="text-primary">{cat}</span>
                                <span className="text-text-muted">({count})</span>
                            </span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
