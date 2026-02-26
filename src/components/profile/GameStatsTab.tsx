'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { BarChart3, Gamepad2 } from 'lucide-react';
import Link from 'next/link';
import { ProfileData } from '@/services/profileService';
import { GAME_LABELS } from '@/constants/games';

interface GameStatsTabProps {
    profile: ProfileData;
}

export function GameStatsTab({ profile }: GameStatsTabProps) {
    if (profile.stats.length === 0) {
        return (
            <div className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center">
                <Gamepad2
                    size={40}
                    className="text-text-secondary mx-auto mb-3 opacity-40"
                />
                <p className="text-text-secondary text-sm mb-4">
                    Henüz bir oyun oynamadın. Hadi başlayalım!
                </p>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                >
                    <Gamepad2 size={16} />
                    Oyunlara Git
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                <BarChart3 size={20} className="text-primary" />
                Oyun İstatistikleri
            </h2>
            <div className="grid gap-3">
                {profile.stats.map((stat) => {
                    const gameWinRate =
                        stat.played > 0
                            ? Math.round((stat.won / stat.played) * 100)
                            : 0;
                    return (
                        <div
                            key={stat.game_name}
                            className="bg-surface border-2 border-surface-mid rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-base font-bold text-text-main">
                                    {GAME_LABELS[stat.game_name] ?? stat.game_name}
                                </h3>
                                <span className="text-xs font-bold text-text-secondary bg-bg/50 px-3 py-1 rounded-full">
                                    %{gameWinRate} başarı
                                </span>
                            </div>

                            <div className="w-full h-2 bg-bg rounded-full mb-4 overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${gameWinRate}%` }}
                                    transition={{ duration: 0.8, ease: 'easeOut' }}
                                    className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                                />
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
                                <div>
                                    <p className="text-lg font-black text-text-main">{stat.played}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Oynanan</p>
                                </div>
                                <div>
                                    <p className="text-lg font-black text-correct">{stat.won}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Kazanılan</p>
                                </div>
                                <div>
                                    <p className="text-lg font-black text-text-main">{stat.best_score > 0 ? stat.best_score : '—'}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">En İyi Skor</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-lg font-black text-primary">{stat.current_streak}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Mevcut Seri</p>
                                </div>
                                <div className="hidden sm:block">
                                    <p className="text-lg font-black text-primary">{stat.max_streak}</p>
                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">En İyi Seri</p>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
