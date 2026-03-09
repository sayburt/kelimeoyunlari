'use client';

import React, { useEffect, useState } from 'react';
import { leaderboardService, LeaderboardEntry, LeaderboardPeriod } from '@/services/leaderboardService';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, CalendarDays, Crown, Infinity, Medal, Trophy } from 'lucide-react';
import { GAMES } from '@/data/games';
import { GAME_LABELS } from '@/constants/games';

const LEADERBOARD_GAMES = GAMES
    .filter((game) => !game.comingSoon)
    .map((game) => game.id);

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

function formatValue(value: number): string {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    if (value >= 1_000) return `${(value / 1_000).toFixed(1)}K`;
    return value.toLocaleString('tr-TR');
}

export default function LeaderboardPage() {
    const { user } = useAuth();
    const [period, setPeriod] = useState<LeaderboardPeriod>('weekly');
    const [selectedGame, setSelectedGame] = useState<string>(LEADERBOARD_GAMES[0] ?? 'wordle');
    const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        async function load(showLoader = true) {
            if (showLoader) {
                setLoading(true);
            }

            const data = await leaderboardService.getGameLeaderboard(selectedGame, period, 20);

            if (!cancelled) {
                setEntries(data);
                if (showLoader) {
                    setLoading(false);
                }
            }
        }

        const handleScoreUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<{ gameName?: string }>;
            if (customEvent.detail?.gameName === selectedGame) {
                load(false);
            }
        };

        const realtimeChannel = supabase
            .channel(`leaderboard-score-events-${selectedGame}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'game_score_events',
                    filter: `game_name=eq.${selectedGame}`,
                },
                () => {
                    load(false);
                }
            )
            .subscribe();

        load();
        window.addEventListener('game-score-updated', handleScoreUpdated as EventListener);

        return () => {
            cancelled = true;
            window.removeEventListener('game-score-updated', handleScoreUpdated as EventListener);
            void supabase.removeChannel(realtimeChannel);
        };
    }, [selectedGame, period]);

    const currentUserId = user?.id;
    const valueLabel = period === 'weekly' ? 'Haftalık Puan' : 'En Yüksek Puan';

    return (
        <div className="min-h-screen bg-bg hero-glow px-4 py-10 sm:py-16">
            <div className="max-w-2xl mx-auto">
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
                            Oyun Liderlikleri
                        </h1>
                        <p className="text-sm text-text-secondary mt-0.5">Her oyun kendi puan sistemiyle sıralanır</p>
                    </div>
                </div>

                <div className="mb-6">
                    <p className="text-xs font-bold text-text-secondary uppercase tracking-wider mb-2">Oyun Seç</p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {LEADERBOARD_GAMES.map((gameId) => (
                            <button
                                key={gameId}
                                onClick={() => setSelectedGame(gameId)}
                                className={`px-3 py-2 rounded-xl text-sm font-bold border transition-colors ${selectedGame === gameId
                                    ? 'bg-primary/10 border-primary/40 text-primary'
                                    : 'bg-surface border-surface-mid text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                {GAME_LABELS[gameId] ?? gameId}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-1 p-1 bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] rounded-2xl mb-6">
                    <button
                        onClick={() => setPeriod('weekly')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${period === 'weekly'
                            ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'text-text-secondary hover:text-text-main'
                            }`}
                    >
                        <CalendarDays size={16} />
                        Haftalık En İyiler
                    </button>
                    <button
                        onClick={() => setPeriod('all_time')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${period === 'all_time'
                            ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                            : 'text-text-secondary hover:text-text-main'
                            }`}
                    >
                        <Infinity size={16} />
                        Tüm Zamanlar
                    </button>
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                ) : entries.length === 0 ? (
                    <div className="bg-surface border border-surface-mid rounded-2xl p-10 text-center">
                        <Trophy size={44} className="text-text-secondary mx-auto mb-3 opacity-40" />
                        <p className="text-text-secondary text-sm">
                            Seçili oyunda henüz sıralama verisi yok. İlk sen ol!
                        </p>
                    </div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="space-y-2"
                    >
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
                                    <div className="w-10 flex items-center justify-center">
                                        {rankIcon ?? (
                                            <span className="text-sm font-black text-text-secondary">{rank}</span>
                                        )}
                                    </div>

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

                                    <div className="w-24 text-right">
                                        <span className={`text-base font-black ${rank <= 3 ? 'text-primary' : 'text-text-main'}`}>
                                            {formatValue(entry.value)}
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
