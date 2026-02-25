'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Swords, BarChart3, SendHorizonal, Users, Trophy, Star } from 'lucide-react';
import Link from 'next/link';
import { StatCard } from '@/components/game/StatCard';
import { ProfileData } from '@/services/profileService';

const GAME_LABELS: Record<string, string> = {
    wordle: 'Wordle',
    anagram: 'Anagram',
    hangman: 'Adam Asmaca',
    quiz: 'Kelime Bilgi',
};

interface ChallengeStatsTabProps {
    profile: ProfileData;
}

export function ChallengeStatsTab({ profile }: ChallengeStatsTabProps) {
    if (profile.isGuest) {
        return (
            <div className="bg-surface border-2 border-surface-mid rounded-2xl p-10 text-center">
                <Swords
                    size={44}
                    className="text-text-secondary mx-auto mb-3 opacity-40"
                />
                <p className="text-text-secondary text-sm mb-4">
                    Meydan okuma istatistiklerini görmek için giriş yap!
                </p>
                <div className="flex items-center justify-center gap-3">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    >
                        Giriş Yap
                    </Link>
                    <Link
                        href="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-surface text-text-main border-2 border-surface-mid rounded-full hover:border-primary/40 transition-colors"
                    >
                        Kayıt Ol
                    </Link>
                </div>
            </div>
        );
    }

    const totalChallengeSent = profile.challengeStats.reduce((s, c) => s + c.sent_count, 0);
    const totalChallengeReceived = profile.challengeStats.reduce((s, c) => s + c.received_count, 0);
    const totalChallengeWon = profile.challengeStats.reduce((s, c) => s + c.won_count, 0);
    const bestChallengeScore = profile.challengeStats.reduce((m, c) => Math.max(m, c.best_score), 0);
    const challengeWinRate = totalChallengeReceived > 0
        ? Math.round((totalChallengeWon / totalChallengeReceived) * 100)
        : 0;

    return (
        <div className="space-y-6">
            {/* Özet Kartlar */}
            <div className="space-y-4">
                <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                    <Swords size={20} className="text-primary" />
                    Meydan Okuma Özeti
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <StatCard label="Gönderilen" value={totalChallengeSent} icon={<SendHorizonal size={20} />} />
                    <StatCard label="Katılınan" value={totalChallengeReceived} icon={<Users size={20} />} />
                    <StatCard label="Kazanılan" value={totalChallengeWon} icon={<Trophy size={20} />} highlight />
                    <StatCard label="En İyi Skor" value={bestChallengeScore > 0 ? bestChallengeScore : '—'} icon={<Star size={20} />} highlight />
                </div>
            </div>

            {/* Oyuna Göre Detay */}
            {profile.challengeStats.length > 0 ? (
                <div className="space-y-4">
                    <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                        <BarChart3 size={20} className="text-primary" />
                        Oyuna Göre Detay
                    </h2>
                    <div className="grid gap-3">
                        {profile.challengeStats.map((stat) => {
                            const winRate = stat.received_count > 0
                                ? Math.round((stat.won_count / stat.received_count) * 100)
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
                                            %{winRate} başarı
                                        </span>
                                    </div>

                                    <div className="w-full h-2 bg-bg rounded-full mb-4 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${winRate}%` }}
                                            transition={{ duration: 0.8, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                                        <div>
                                            <p className="text-lg font-black text-text-main">{stat.sent_count}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Gönderilen</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-text-main">{stat.received_count}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Katılınan</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-correct">{stat.won_count}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">Kazanılan</p>
                                        </div>
                                        <div>
                                            <p className="text-lg font-black text-primary">{stat.best_score > 0 ? stat.best_score : '—'}</p>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">En İyi Skor</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            ) : (
                <div className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center">
                    <Swords size={40} className="text-text-secondary mx-auto mb-3 opacity-40" />
                    <p className="text-text-secondary text-sm mb-4">Henüz bir meydan okumaya katılmadın.</p>
                </div>
            )}

            {/* Kazanma Oranı Banner */}
            {totalChallengeReceived > 0 && (
                <div className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                        <p className="text-sm font-bold text-text-main">Genel Meydan Okuma Başarısı</p>
                        <span className="text-xl font-black text-primary">%{challengeWinRate}</span>
                    </div>
                    <div className="w-full h-3 bg-bg rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${challengeWinRate}%` }}
                            className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
