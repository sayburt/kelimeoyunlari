'use client';

import React from 'react';
import { Award, Trophy, Flame, Zap, Gamepad2, Target, LogIn } from 'lucide-react';
import Link from 'next/link';
import { ProfileData } from '@/services/profileService';

const BADGE_LABELS: Record<string, { label: string; criteria: string; icon: React.ReactNode }> = {
    first_win: { label: 'İlk Galibiyet', criteria: 'İlk oyun zaferi', icon: <Trophy size={20} /> },
    streak_5: { label: 'Ateşli', criteria: '5 seri galibiyet', icon: <Flame size={20} /> },
    streak_10: { label: 'Durdurulamaz', criteria: '10 seri galibiyet', icon: <Zap size={20} /> },
    games_10: { label: 'Acemi', criteria: '10 oyun oynandı', icon: <Gamepad2 size={20} /> },
    games_50: { label: 'Müdavim', criteria: '50 oyun oynandı', icon: <Target size={20} /> },
    perfect_score: { label: 'Kusursuz', criteria: 'İlk denemede bildin', icon: <Award size={20} /> },
    points_1k: { label: 'Binlik Kulübü', criteria: '1,000 puan', icon: <Trophy size={20} className="text-yellow-600" /> },
    points_10k: { label: 'Acemi Dilci', criteria: '10,000 puan', icon: <Target size={20} className="text-blue-500" /> },
    points_50k: { label: 'Kelime Avcısı', criteria: '50,000 puan', icon: <Zap size={20} className="text-purple-500" /> },
    points_100k: { label: 'Puan Ustası', criteria: '100,000 puan', icon: <Trophy size={20} className="text-yellow-400" /> },
    points_250k: { label: 'Kelime Efsanesi', criteria: '250,000 puan', icon: <Flame size={20} className="text-orange-500" /> },
    points_500k: { label: 'Ölümsüz Dilbilimci', criteria: '500,000 puan', icon: <Award size={20} className="text-red-500" /> },
};

interface BadgesSectionProps {
    profile: ProfileData;
}

export function BadgesSection({ profile }: BadgesSectionProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                <Award size={20} className="text-primary" />
                Rozetler
            </h2>

            {profile.isGuest ? (
                <div className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center">
                    <Award size={40} className="text-text-secondary mx-auto mb-3 opacity-40" />
                    <p className="text-text-secondary text-sm mb-4">Giriş yaparak rozet kazanabilirsin!</p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                    >
                        <LogIn size={16} />
                        Giriş Yap
                    </Link>
                </div>
            ) : profile.badges.length === 0 ? (
                <div className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center">
                    <Award size={40} className="text-text-secondary mx-auto mb-3 opacity-40" />
                    <p className="text-text-secondary text-sm">Henüz rozet kazanılmadı. Oyun oynayarak rozet kazanabilirsin!</p>
                </div>
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {Object.keys(BADGE_LABELS).map((badgeKey) => {
                        const info = BADGE_LABELS[badgeKey];
                        const earnedBadge = profile.badges.find(b => b.badge_key === badgeKey);
                        const isEarned = !!earnedBadge;

                        return (
                            <div
                                key={badgeKey}
                                className={`border-2 rounded-2xl p-4 flex flex-col items-center text-center gap-2 transition-all ${isEarned
                                    ? 'bg-surface border-primary/20 shadow-[0_0_12px_rgba(34,211,238,0.08)]'
                                    : 'bg-bg/50 border-surface-mid opacity-40 grayscale-[50%]'
                                    }`}
                            >
                                <div className={isEarned ? "text-primary scale-110 transition-transform" : "text-text-secondary"}>
                                    {info?.icon ?? <Award size={20} />}
                                </div>
                                <p className={`text-xs font-bold leading-tight ${isEarned ? 'text-text-main' : 'text-text-secondary'}`}>
                                    {info?.label ?? badgeKey}
                                </p>

                                {isEarned ? (
                                    <p className="text-[10px] text-text-secondary">
                                        Kazanıldı: {new Date(earnedBadge!.earned_at).toLocaleDateString('tr-TR')}
                                    </p>
                                ) : (
                                    <p className="text-[10px] text-text-secondary leading-tight mt-1 line-clamp-2">
                                        {info?.criteria}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
