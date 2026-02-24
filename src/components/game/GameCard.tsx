import React from 'react';
import Image from 'next/image';
import { Heart, Bookmark, Users, Info } from 'lucide-react';

export interface GameCardProps {
    title: string;
    description: string;
    onClick?: () => void;
    onInfo?: () => void;
    comingSoon?: boolean;
    thumbnail?: string;
    playCount?: number;
    likeCount?: number;
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
}: GameCardProps) {
    return (
        <div
            onClick={!comingSoon ? onClick : undefined}
            className={`group relative overflow-hidden rounded-2xl bg-surface border-2 border-surface-mid flex flex-col w-full h-full transition-all duration-300
        ${comingSoon
                    ? 'opacity-70 cursor-not-allowed grayscale-[0.3]'
                    : 'hover:border-primary/50 hover:bg-surface hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-primary/10'
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
                        className={`object-cover transition-transform duration-500 ${!comingSoon ? 'group-hover:scale-105' : ''}`}
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
                        <div className="flex items-center gap-1.5 text-xs font-medium" title="Beğeni Sayısı">
                            <Heart size={14} className="text-text-secondary" />
                            <span>{likeCount.toLocaleString('tr-TR')}</span>
                        </div>
                    </div>

                    {/* Etkileşim İkonları (Şu an tıklandığında sadece UI, fonksiyonel değil) */}
                    <div className="flex items-center gap-2">
                        <button
                            className="p-1.5 rounded-md hover:bg-surface-mid/50 hover:text-red-400 transition-colors text-text-secondary disabled:opacity-50"
                            disabled={comingSoon}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Beğen"
                            title="Beğen"
                        >
                            <Heart size={16} />
                        </button>
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
                        <button
                            className="p-1.5 rounded-md hover:bg-surface-mid/50 hover:text-primary transition-colors text-text-secondary disabled:opacity-50"
                            disabled={comingSoon}
                            onClick={(e) => e.stopPropagation()}
                            aria-label="Favorilere ekle"
                            title="Favorilere Ekle"
                        >
                            <Bookmark size={16} />
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
