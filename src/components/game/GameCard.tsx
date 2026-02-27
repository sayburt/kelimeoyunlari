import React from 'react';
import Image from 'next/image';
import { Heart, Users, Info, Swords } from 'lucide-react';

export interface GameCardProps {
    title: string;
    description: string;
    onClick?: () => void;
    onInfo?: () => void;
    comingSoon?: boolean;
    thumbnail?: string;
    playCount?: number;
    likeCount?: number;
    isLiked?: boolean;
    onLike?: () => void;
    hasChallenge?: boolean;
}

export function GameCard({
    title,
    description,
    onClick,
    onInfo,
    comingSoon = false,
    thumbnail,
    playCount = 0,
    likeCount = 0,
    isLiked = false,
    onLike,
    hasChallenge = false,
}: GameCardProps) {
    return (
        <div
            onClick={!comingSoon ? onClick : undefined}
            className={`group relative overflow-hidden rounded-2xl bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] flex flex-col w-full h-full transition-all duration-300
        ${comingSoon
                    ? 'opacity-70 cursor-not-allowed grayscale-[0.3]'
                    : 'hover:-translate-y-1.5 cursor-pointer shadow-[var(--theme-premium-shadow)] hover:shadow-[var(--theme-premium-shadow-hover)]'
                }
      `}
        >
            {/* Thumbnail Alanı (16:9 Oran) */}
            <div className="relative w-full aspect-video bg-surface-mid/40 border-b border-surface-mid overflow-hidden flex items-center justify-center shrink-0">
                {thumbnail ? (
                    <Image
                        src={thumbnail}
                        alt={`${title} thumbnail`}
                        fill
                        className={`object-cover transition-all duration-500 ${!comingSoon ? 'group-hover:scale-105 group-hover:saturate-[1.05]' : ''}`}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    /* Görsel yoksa sadece boş bir zemin göster (Skeleton kaldırıldı) */
                    <div className="w-full h-full bg-surface-mid/20"></div>
                )}
            </div>

            {/* Metin ve İçerik Alanı */}
            <div className="p-5 flex flex-col flex-grow text-left">
                <h3 className="text-xl font-bold text-text-main mb-1.5">{title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed mb-4 flex-grow">{description}</p>

                {/* Alt İkonlar ve İstatistikler */}
                <div className="mt-auto pt-4 border-t border-surface-mid/50 flex items-center justify-between text-text-muted">
                    {/* İstatistikler */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium" title="Oynanma Sayısı">
                            <Users size={14} className="text-text-secondary" />
                            <span>{playCount.toLocaleString('tr-TR')}</span>
                        </div>
                        <button
                            disabled={comingSoon}
                            onClick={(e) => {
                                e.stopPropagation();
                                onLike?.();
                            }}
                            className={`flex items-center gap-1.5 text-xs font-medium cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 ${isLiked ? 'text-red-500 hover:text-red-400' : 'text-text-secondary hover:text-red-500'}`}
                            title={isLiked ? "Beğeniyi Geri Al" : "Beğen"}
                            aria-label={isLiked ? "Beğeniyi Geri Al" : "Beğen"}
                        >
                            <Heart size={14} className={isLiked ? "fill-current" : ""} />
                            <span className={isLiked ? "font-semibold" : ""}>{likeCount.toLocaleString('tr-TR')}</span>
                        </button>
                    </div>

                    {/* Etkileşim İkonları */}
                    <div className="flex items-center gap-2">
                        {hasChallenge && (
                            <div className="relative group/challenge flex items-center">
                                <div
                                    className="p-1.5 rounded-md text-green-500 bg-green-500/10 flex items-center justify-center transition-colors shadow-sm cursor-help"
                                    aria-label="Meydan Okuma Mevcut"
                                >
                                    <Swords size={16} />
                                </div>

                                {/* Tooltip */}
                                <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-surface-hover/95 backdrop-blur-md text-text-main text-[11px] leading-relaxed rounded-xl shadow-xl border border-surface-mid opacity-0 invisible group-hover/challenge:opacity-100 group-hover/challenge:visible transition-all duration-200 z-50 pointer-events-none text-center">
                                    <div className="font-bold text-green-500 mb-1.5 flex items-center justify-center gap-1.5">
                                        <Swords size={12} /> Meydan Okuma
                                    </div>
                                    Bu oyunda arkadaşlarınıza meydan okuyabilirsiniz! Oyuna girdikten sonra üst menüdeki kılıç ikonuna tıklayarak link oluşturun.
                                    {/* Küçük ok (arrow) */}
                                    <div className="absolute top-full right-3 border-4 border-transparent border-t-surface-hover/95" />
                                </div>
                            </div>
                        )}
                        <button
                            className="p-1.5 rounded-md hover:bg-surface-mid/50 hover:text-primary transition-colors text-text-secondary disabled:opacity-50"
                            disabled={comingSoon}
                            onClick={(e) => {
                                e.stopPropagation();
                                onInfo?.();
                            }}
                            aria-label="Nasıl Oynanır"
                            title="Nasıl Oynanır"
                        >
                            <Info size={16} />
                        </button>
                    </div>
                </div>
            </div>

            {comingSoon && (
                <div className="absolute top-6 -right-10 bg-surface-mid text-[10px] uppercase tracking-wider font-bold px-12 py-1.5 rotate-45 text-text-secondary shadow-md z-20">
                    Yakında
                </div>
            )}
        </div>
    );
}
