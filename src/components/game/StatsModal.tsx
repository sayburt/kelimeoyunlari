'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, BarChart3, Loader2, LogIn, Gamepad2 } from 'lucide-react';
import { leaderboardService, LeaderboardEntry, LeaderboardPeriod } from '@/services/leaderboardService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { storage, GuestStat } from '@/lib/storage';
import Link from 'next/link';
import { GAME_LABELS } from '@/constants/games';

interface PersonalStats {
    played: number;
    won: number;
    winRate: number;
    bestScore: number;
    highScore: number;
    currentStreak: number;
    maxStreak: number;
}

interface StatsModalProps {
    gameName: string;
    onClose: () => void;
}

type TabId = 'leaderboard' | 'personal';

export function StatsModal({ gameName, onClose }: StatsModalProps) {
    const [activeTab, setActiveTab] = useState<TabId>('leaderboard');
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [leaderboardPeriod, setLeaderboardPeriod] = useState<LeaderboardPeriod>('weekly');
    const [personalStats, setPersonalStats] = useState<PersonalStats | null>(null);
    const [loadingLeaderboard, setLoadingLeaderboard] = useState(true);
    const [loadingPersonal, setLoadingPersonal] = useState(true);
    const { user, isAuthenticated } = useAuth();

    // Oyun bazlı leaderboard verisini çek
    useEffect(() => {
        let cancelled = false;

        const fetchLeaderboard = async (showLoader = true) => {
            if (showLoader) {
                setLoadingLeaderboard(true);
            }

            const data = await leaderboardService.getGameLeaderboard(gameName, leaderboardPeriod, 20);
            if (!cancelled) {
                setLeaderboard(data);
                if (showLoader) {
                    setLoadingLeaderboard(false);
                }
            }
        };

        const handleScoreUpdated = (event: Event) => {
            const customEvent = event as CustomEvent<{ gameName?: string }>;
            if (customEvent.detail?.gameName === gameName) {
                fetchLeaderboard(false);
            }
        };

        const realtimeChannel = supabase
            .channel(`stats-modal-score-events-${gameName}`)
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'game_score_events',
                    filter: `game_name=eq.${gameName}`,
                },
                () => {
                    fetchLeaderboard(false);
                }
            )
            .subscribe();

        fetchLeaderboard();
        window.addEventListener('game-score-updated', handleScoreUpdated as EventListener);

        return () => {
            cancelled = true;
            window.removeEventListener('game-score-updated', handleScoreUpdated as EventListener);
            void supabase.removeChannel(realtimeChannel);
        };
    }, [gameName, leaderboardPeriod]);

    // Kişisel istatistikleri çek
    useEffect(() => {
        let cancelled = false;

        const fetchPersonalStats = async () => {
            if (!cancelled) {
                setLoadingPersonal(true);
            }

            if (isAuthenticated && user) {
                const { data } = await supabase
                    .from('game_stats')
                    .select('played, won, best_score, high_score, current_streak, max_streak')
                    .eq('user_id', user.id)
                    .eq('game_name', gameName)
                    .single();

                if (cancelled) return;
                if (data) {
                    const played = data.played ?? 0;
                    const won = data.won ?? 0;
                    setPersonalStats({
                        played,
                        won,
                        winRate: played > 0 ? Math.round((won / played) * 100) : 0,
                        bestScore: data.best_score ?? 0,
                        highScore: data.high_score ?? 0,
                        currentStreak: data.current_streak ?? 0,
                        maxStreak: data.max_streak ?? 0,
                    });
                } else {
                    setPersonalStats(null);
                }
            } else {
                // Misafir kullanıcı — localStorage'dan çek
                const guestStats: GuestStat[] = storage.getGuestStats();
                const stat = guestStats.find(s => s.game_name === gameName);
                if (stat) {
                    setPersonalStats({
                        played: stat.played,
                        won: stat.won,
                        winRate: stat.played > 0 ? Math.round((stat.won / stat.played) * 100) : 0,
                        bestScore: stat.best_score,
                        highScore: stat.high_score ?? 0,
                        currentStreak: stat.current_streak,
                        maxStreak: stat.max_streak,
                    });
                } else {
                    setPersonalStats(null);
                }
            }
            if (!cancelled) setLoadingPersonal(false);
        };

        fetchPersonalStats();
        return () => { cancelled = true; };
    }, [gameName, isAuthenticated, user]);

    const tabs: { id: TabId; label: string; icon: React.ElementType }[] = [
        { id: 'leaderboard', label: 'Skor Tablosu', icon: Trophy },
        { id: 'personal', label: 'İstatistiklerin', icon: BarChart3 },
    ];

    const gameLabel = GAME_LABELS[gameName] ?? gameName;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <motion.div
                initial={{ opacity: 0, scale: 0.92, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.92, y: 20 }}
                transition={{ type: 'spring', duration: 0.4 }}
                className="relative w-full max-w-md glass-surface rounded-3xl border border-surface-mid shadow-2xl overflow-hidden"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 pt-5 pb-3">
                    <h3 className="text-lg font-black text-text-main tracking-tight">
                        {gameLabel} İstatistikleri
                    </h3>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-surface hover:bg-surface-mid text-text-secondary hover:text-text-main transition-all active:scale-95 cursor-pointer"
                        aria-label="Kapat"
                    >
                        <X size={16} />
                    </button>
                </div>

                {/* Tab Bar */}
                <div className="flex mx-5 mb-4 bg-bg/60 rounded-xl p-1 relative">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`relative flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-sm font-bold transition-colors z-10 cursor-pointer ${isActive ? 'text-primary' : 'text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                {isActive && (
                                    <motion.div
                                        layoutId="stats-tab-indicator"
                                        className="absolute inset-0 bg-surface rounded-lg shadow-sm"
                                        transition={{ type: 'spring', duration: 0.35, bounce: 0.2 }}
                                    />
                                )}
                                <span className="relative z-10 flex items-center gap-1.5">
                                    <Icon size={15} />
                                    {tab.label}
                                </span>
                            </button>
                        );
                    })}
                </div>

                {/* Content */}
                <div className="px-5 pb-5 min-h-[320px] max-h-[60vh] overflow-y-auto">
                    <AnimatePresence mode="wait">
                        {activeTab === 'leaderboard' ? (
                            <motion.div
                                key="leaderboard"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <LeaderboardTab
                                    data={leaderboard}
                                    loading={loadingLeaderboard}
                                    currentUserId={user?.id}
                                    period={leaderboardPeriod}
                                    onPeriodChange={setLeaderboardPeriod}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="personal"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                <PersonalTab
                                    stats={personalStats}
                                    loading={loadingPersonal}
                                    isAuthenticated={isAuthenticated}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
}

/* ─── Leaderboard Tab ────────────────────────────────── */

function LeaderboardTab({
    data,
    loading,
    currentUserId,
    period,
    onPeriodChange,
}: {
    data: LeaderboardEntry[];
    loading: boolean;
    currentUserId?: string;
    period: LeaderboardPeriod;
    onPeriodChange: (period: LeaderboardPeriod) => void;
}) {
    const periodTabs: { id: LeaderboardPeriod; label: string }[] = [
        { id: 'weekly', label: 'Haftalık' },
        { id: 'all_time', label: 'Tüm Zamanlar' },
    ];

    const scoreLabel = period === 'weekly' ? 'Haftalık Puan' : 'En Yüksek Puan';

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex bg-bg/50 p-1 rounded-xl border border-surface-mid">
                {periodTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onPeriodChange(tab.id)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${period === tab.id
                            ? 'bg-surface text-primary'
                            : 'text-text-secondary hover:text-text-main'
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Oyuncular</p>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">{scoreLabel}</p>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy size={36} className="text-text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-text-secondary text-sm">Henüz skor kaydedilmemiş.</p>
                    <p className="text-text-muted text-xs mt-1">İlk sen ol!</p>
                </div>
            ) : (
                <LeaderboardRows data={data} currentUserId={currentUserId} />
            )}
        </div>
    );
}

function LeaderboardRows({ data, currentUserId }: { data: LeaderboardEntry[]; currentUserId?: string }) {
    const medalEmojis = ['🥇', '🥈', '🥉'];

    return (
        <div className="space-y-1.5">
            {data.map((entry, idx) => {
                const isCurrentUser = currentUserId && entry.user_id === currentUserId;
                return (
                    <div
                        key={entry.user_id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isCurrentUser
                            ? 'bg-primary/10 border border-primary/25'
                            : 'bg-bg/40 hover:bg-bg/70'
                            }`}
                    >
                        {/* Sıra */}
                        <span className="w-7 text-center shrink-0">
                            {idx < 3 ? (
                                <span className="text-lg">{medalEmojis[idx]}</span>
                            ) : (
                                <span className="text-sm font-bold text-text-secondary">{idx + 1}</span>
                            )}
                        </span>

                        {/* Avatar */}
                        <div className="w-8 h-8 rounded-full bg-surface-mid flex items-center justify-center shrink-0 text-base">
                            {entry.avatar || '👤'}
                        </div>

                        {/* Kullanıcı adı */}
                        <span className={`flex-1 text-sm font-semibold truncate ${isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                            {entry.username || 'Anonim'}
                            {isCurrentUser && <span className="text-xs ml-1 opacity-60">(sen)</span>}
                        </span>

                        {/* Puan */}
                        <span className={`text-sm font-black tabular-nums ${isCurrentUser ? 'text-primary' : 'text-text-main'}`}>
                            {entry.value.toLocaleString('tr-TR')}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}

/* ─── Personal Stats Tab ─────────────────────────────── */

function PersonalTab({ stats, loading, isAuthenticated }: { stats: PersonalStats | null; loading: boolean; isAuthenticated: boolean }) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <Gamepad2 size={36} className="text-text-secondary mx-auto mb-3 opacity-30" />
                <p className="text-text-secondary text-sm mb-1">
                    Henüz bu oyunda bir istatistiğin yok.
                </p>
                <p className="text-text-muted text-xs">Bir oyun oyna, burada görünsün!</p>
            </div>
        );
    }

    const statItems = [
        { label: 'Oynanan', value: stats.played, color: 'text-text-main' },
        { label: 'Kazanılan', value: stats.won, color: 'text-correct' },
        { label: 'Başarı', value: `%${stats.winRate}`, color: 'text-primary' },
        { label: 'Oyuna Özel En İyi', value: stats.bestScore > 0 ? stats.bestScore : '—', color: 'text-text-main' },
        { label: 'En Yüksek Puan', value: stats.highScore > 0 ? stats.highScore.toLocaleString('tr-TR') : '—', color: 'text-primary' },
        { label: 'Mevcut Seri', value: stats.currentStreak, color: 'text-text-main' },
        { label: 'En İyi Seri', value: stats.maxStreak, color: 'text-primary' },
    ];

    return (
        <div className="space-y-4">
            {/* Başarı oranı barı */}
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Başarı Oranı</span>
                    <span className="text-sm font-black text-primary">%{stats.winRate}</span>
                </div>
                <div className="w-full h-2.5 bg-bg rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.winRate}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                    />
                </div>
            </div>

            {/* İstatistik grid */}
            <div className="grid grid-cols-2 gap-2.5">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="bg-bg/50 rounded-xl px-3.5 py-3 text-center"
                    >
                        <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold mt-0.5">{item.label}</p>
                    </div>
                ))}
            </div>

            {/* Giriş yap CTA (misafir için) */}
            {!isAuthenticated && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                    <p className="text-text-secondary text-xs mb-3">
                        Giriş yap, istatistiklerin bulutta kayıt altına alınsın!
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform"
                    >
                        <LogIn size={14} />
                        Giriş Yap
                    </Link>
                </div>
            )}
        </div>
    );
}
