'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, BarChart3 } from 'lucide-react';
import { leaderboardService, LeaderboardEntry, LeaderboardPeriod } from '@/services/leaderboardService';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { storage, GuestStat } from '@/lib/storage';
import { GAME_LABELS } from '@/constants/games';
import { LeaderboardTab } from '@/components/game/stats-modal/LeaderboardTab';
import { PersonalTab } from '@/components/game/stats-modal/PersonalTab';
import { PersonalStats } from '@/components/game/stats-modal/types';

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
