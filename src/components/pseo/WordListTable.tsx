import type { WordEntry } from '@/lib/wordData';

interface WordListTableProps {
    words: WordEntry[];
    /** Sayfa basina gosterilecek kelime sayisi (varsayilan: tumu) */
    maxDisplay?: number;
}

export function WordListTable({ words, maxDisplay }: WordListTableProps) {
    const displayWords = maxDisplay ? words.slice(0, maxDisplay) : words;
    const hasMore = maxDisplay ? words.length > maxDisplay : false;

    return (
        <div className="space-y-4">
            <div className="overflow-x-auto rounded-2xl border border-surface/20">
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-surface/10 border-b border-surface/20">
                            <th className="px-4 py-3 text-xs font-black text-text-muted uppercase tracking-wider">
                                Kelime
                            </th>
                            <th className="px-4 py-3 text-xs font-black text-text-muted uppercase tracking-wider hidden sm:table-cell">
                                Anlam
                            </th>
                            <th className="px-4 py-3 text-xs font-black text-text-muted uppercase tracking-wider hidden md:table-cell">
                                Kategori
                            </th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-surface/10">
                        {displayWords.map((word, idx) => (
                            <tr
                                key={`${word.kelime}-${idx}`}
                                className="hover:bg-surface/5 transition-colors"
                            >
                                <td className="px-4 py-3">
                                    <span className="font-black text-text-main text-sm tracking-wide">
                                        {word.kelime.toLocaleUpperCase('tr-TR')}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden sm:table-cell">
                                    <span className="text-text-muted text-sm line-clamp-1">
                                        {word.anlam || '-'}
                                    </span>
                                </td>
                                <td className="px-4 py-3 hidden md:table-cell">
                                    <div className="flex flex-wrap gap-1">
                                        {word.kategoriler.slice(0, 2).map((cat, i) => (
                                            <span
                                                key={`${cat}-${i}`}
                                                className="inline-block px-2 py-0.5 text-xs font-bold rounded-full bg-primary/10 text-primary"
                                            >
                                                {cat}
                                            </span>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {hasMore && (
                <p className="text-center text-sm text-text-muted">
                    ve {words.length - (maxDisplay || 0)} kelime daha...
                    Tum listeyi gormek icin sayfayi asagi kaydir.
                </p>
            )}
        </div>
    );
}
