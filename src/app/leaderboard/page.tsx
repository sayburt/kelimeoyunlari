'use client';

import React, { useEffect, useState } from 'react';
import { leaderboardService, LeaderboardEntry, LeaderboardType } from '@/services/leaderboardService';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Trophy,
    Crown,
    Medal,
    Swords,
    BarChart3,
    Star,
    Flame,
    ArrowLeft,
} from 'lucide-react';

type Category = 'normal' | 'challenge';

const NORMAL_TABS: { key: LeaderboardType; label: string; icon: React.ReactNode }[] = [
    { key: 'total_score', label: 'Toplam Puan', icon: <Star size={16} /> },
    { key: 'total_wins', label: 'Galibiyet', icon: <Trophy size={16} /> },
    { key: 'best_streak', label: 'En İyi Seri', icon: <Flame size={16} /> },
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.04 } },
};

const itemVariants = {
    hidden: { opacity: 0, x: -12 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.25 } },
};

function getRankStyle(rank: number): { icon: React.ReactNode; bg: string } {
    if (rank === 1) return { icon: <Crown size={20} className="text-yellow-400" />, bg: 'from-yellow-400/10 to-yellow-400/5 border-yellow-400/30' };
    if (rank === 2) return { icon: <Medal size={20} className="text-gray-300" />, bg: 'from-gray-300/10 to-gray-300/5 border-gray-300/30' };
    if (rank === 3) return { icon: <Medal size={20} className="text-amber-600" />, bg: 'from-amber-600/10 to-amber-600/5 border-amber-600/30' };
    return { icon: null, bg: 'from-transparent to-transparent border-surface-mid' };
}

function formatValue(value: number, type: LeaderboardType | 'challenge'): string {
    if (type === 'total_score') {
        if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
        if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
        return value.toLocaleString('tr-TR');
    }
    return value.toLocaleString('tr-TR');
}

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [category, setCategory] = useState<Category>('normal');
    const [normalType, setNormalType] = useState<LeaderboardType>('total_score');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;
        async function load() {
            setLoading(true);
            let data: LeaderboardEntry[];
            if (category === 'challenge') {
                data = await leaderboardService.getChallengeLeaderboard(20);
            } else {
                data = await leaderboardService.getNormalLeaderboard(normalType, 20);
            }
            if (!cancelled) {
                setEntries(data);
                setLoading(false);
            }
        }
        load();
        return () => { cancelled = true; };
    }, [category, normalType]);

    const currentUserId = user?.id;
    const valueLabel = category === 'challenge'
        ? 'Kazanılan'
        : NORMAL_TABS.find(t => t.key === normalType)?.label ?? 'Puan';

    return (
        <div className="min-h-screen bg-bg hero-glow px-4 py-10 sm:py-16">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="flex items-center gap-3 mb-8">
                    <Link
                        href="/"
                        className="p-2 rounded-xl bg-surface border border-surface-mid hover:border-primary/40 text-text-secondary hover:text-text-main transition-colors"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight flex items-center gap-2">
                            <Trophy size={28} className="text-primary" />
                            Liderlik Tablosu
                        </h1>
                        <p className="text-sm text-text-secondary mt-0.5">En iyi oyuncuları keşfet</p>
                    </div>
                </div>

                {/* Kategori Sekmeleri */}
                <div className="flex gap-1 p-1 bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] rounded-2xl mb-6">
                    <button
                        onClick={() => setCategory('normal')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${category === 'normal'
                            ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'text-text-secondary hover:text-text-main'
                            }`}
                    >
                        <BarChart3 size={16} />
                        Normal Oyunlar
                    </button>
                    <button
                        onClick={() => setCategory('challenge')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${category === 'challenge'
                            ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'text-text-secondary hover:text-text-main'
                            }`}
                    >
                        <Swords size={16} />
                        Meydan Okumalar
                    </button>
                </div>

                {/* Normal Oyun Alt Sekmeleri */}
                {category === 'normal' && (
                    <div className="flex gap-2 mb-6">
                        {NORMAL_TABS.map(tab => (
                            <button
                                key={tab.key}
                                onClick={() => setNormalType(tab.key)}
                                className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-xs font-bold transition-all border ${normalType === tab.key
                                    ? 'bg-surface border-primary/30 text-primary shadow-sm'
                                    : 'bg-transparent border-surface-mid text-text-secondary hover:text-text-main hover:border-surface-mid/80'
                                    }`}
                            >
                                {tab.icon}
                                {tab.label}
                            </button>
                        ))}
                    </div>
                )}

                {/* Tablo */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="bg-surface border border-surface-mid rounded-2xl p-10 text-center">
                        <Trophy size={44} className="text-text-secondary mx-auto mb-3 opacity-40" />
                        <p className="text-text-secondary text-sm">
                            Henüz sıralama verisi yok. İlk sen ol!
                        </p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                    >
                        {/* Tablo Başlığı */}
                        <div className="flex items-center px-4 py-2 text-[10px] uppercase tracking-wider font-bold text-text-secondary">
                            <span className="w-10 text-center">#</span>
                            <span className="flex-1 ml-3">Oyuncu</span>
                            <span className="w-24 text-right">{valueLabel}</span>
                        </div>

                        {entries.map((entry, index) => {
                            const rank = index + 1;
                            const { icon: rankIcon, bg } = getRankStyle(rank);
                            const isCurrentUser = currentUserId === entry.user_id;

                            return (
                                <motion.div
                                    key={entry.user_id}
                                    variants={itemVariants}
                                    className={`flex items-center px-4 py-3 rounded-2xl border bg-gradient-to-r transition-all ${bg} ${isCurrentUser
                                        ? 'ring-2 ring-primary/30 shadow-[0_0_16px_rgba(34,211,238,0.1)]'
                                        : ''
                                        }`}
                                >
                                    {/* Sıra */}
                                    <div className="w-10 flex items-center justify-center">
                                        {rankIcon ?? (
                                            <span className="text-sm font-black text-text-secondary">{rank}</span>
                                        )}
                                    </div>

                                    {/* Avatar + İsim */}
                                    <div className="flex items-center gap-3 flex-1 ml-3 min-w-0">
                                        <div className="w-10 h-10 rounded-xl bg-surface border border-surface-mid flex items-center justify-center text-xl shrink-0">
                                            {entry.avatar ?? '😎'}
                                        </div>
                                        <span className={`text-sm font-bold truncate ${isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                                            {entry.username ?? 'Anonim'}
                                            {isCurrentUser && (
                                                <span className="text-[10px] text-primary ml-1.5 font-bold">(Sen)</span>
                                            )}
                                        </span>
                                    </div>

                                    {/* Değer */}
                                    <div className="w-24 text-right">
                                        <span className={`text-base font-black ${rank <= 3 ? 'text-primary' : 'text-text-main'}`}>
                                            {formatValue(entry.value, category === 'challenge' ? 'challenge' : normalType)}
                                        </span>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </motion.div>
                )}
            </div>
        </div>
    );
}
