import Link from 'next/link';
import Image from 'next/image';
import { TURKISH_ALPHABET } from '@/lib/wordData';
import { generatePseoPath } from '@/lib/pseo/slugGenerator';
import { getDisplayLetter, type ValidGameId } from '@/lib/pseo/slugParser';
import { GAMES } from '@/data/games';

interface RelatedLinksProps {
    /** Su anki harf (highlight icin) */
    currentLetter?: string;
    /** Su anki uzunluk */
    currentLength?: number;
    /** Hangi oyun icin */
    gameId: ValidGameId;
    /** Oyun ana sayfa linki */
    gameHref: string;
    /** Oyun adi */
    gameName: string;
    /** Link verilecek harfler (digerleri pasif gosterilir) */
    availableLetters?: string[];
}

export function RelatedLinks({
    currentLetter,
    currentLength,
    gameId,
    gameHref,
    gameName,
    availableLetters,
}: RelatedLinksProps) {
    const otherGames = GAMES
        .filter((game) => !game.comingSoon && game.id !== gameId)
        .map((game) => ({
            id: game.id,
            title: game.title,
            description: game.description,
            href: game.href,
            thumbnail: game.thumbnail,
        }));

    return (
        <div className="space-y-8">
            {/* Oyuna yonlendirme CTA */}
            <div className="p-6 rounded-2xl bg-primary text-bg shadow-xl shadow-primary/20 relative overflow-hidden group">
                <div className="relative z-10 text-center">
                    <h3 className="text-xl font-black mb-2">HEMEN OYNA</h3>
                    <p className="text-sm opacity-80 mb-4">
                        Bu kelimeleri {gameName} oyununda test et!
                    </p>
                    <Link
                        href={gameHref}
                        className="block w-full py-3 bg-bg text-text-main rounded-xl font-black text-base hover:scale-105 transition-transform text-center"
                    >
                        {gameName} Oyna
                    </Link>
                </div>
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-bg/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
            </div>

            {/* Diger harfler */}
            {currentLength && (
                <div className="p-5 rounded-2xl bg-surface/10 border border-surface/20">
                    <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4">
                        Diger {currentLength} Harfli Kelimeler
                    </h3>
                    <div className="flex flex-wrap gap-1.5">
                        {TURKISH_ALPHABET.map((letter) => {
                            const isCurrent = letter === currentLetter;
                            const isAvailable = !availableLetters || availableLetters.includes(letter);
                            const path = generatePseoPath({
                                startsWith: letter,
                                length: currentLength,
                            });

                            return isCurrent ? (
                                <span
                                    key={letter}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-primary text-bg font-black text-sm"
                                >
                                    {getDisplayLetter(letter)}
                                </span>
                            ) : isAvailable ? (
                                <Link
                                    key={letter}
                                    href={path}
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface/20 text-text-muted font-bold text-sm hover:bg-primary/10 hover:text-primary transition-colors border border-surface/10"
                                >
                                    {getDisplayLetter(letter)}
                                </Link>
                            ) : (
                                <span
                                    key={letter}
                                    aria-disabled="true"
                                    title="Bu harf icin su anda yeterli sayfa yok"
                                    className="w-9 h-9 flex items-center justify-center rounded-lg bg-surface/10 text-text-muted/40 font-bold text-sm border border-surface/10 cursor-not-allowed"
                                >
                                    {getDisplayLetter(letter)}
                                </span>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Diger oyunlar */}
            <div className="p-5 rounded-2xl bg-surface/10 border border-surface/20">
                <h3 className="text-sm font-black text-text-main uppercase tracking-wider mb-4">
                    Diger Oyunlar
                </h3>
                <div className="space-y-3">
                    {otherGames.map((game) => (
                        <Link
                            key={game.id}
                            href={game.href}
                            className="group block overflow-hidden rounded-xl bg-surface/10 border border-surface/10 hover:bg-surface/20 hover:border-primary/30 transition-all"
                        >
                            <div className="relative aspect-video border-b border-surface/10 bg-surface/20 overflow-hidden">
                                <Image
                                    src={game.thumbnail}
                                    alt={`${game.title} gorseli`}
                                    fill
                                    sizes="(max-width: 1024px) 100vw, 320px"
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                            <div className="p-3 space-y-1.5">
                                <p className="text-sm font-black text-text-main leading-tight">
                                    {game.title}
                                </p>
                                <p className="text-xs text-text-muted leading-relaxed line-clamp-2">
                                    {game.description}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
