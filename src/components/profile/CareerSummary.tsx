'use client';

import React from 'react';
import { Layers, TrendingUp } from 'lucide-react';
import { ProfileData } from '@/services/profileService';
import { GAME_LABELS } from '@/constants/games';

interface CareerSummaryProps {
    profile: ProfileData;
}

export function CareerSummary({ profile }: CareerSummaryProps) {
    return (
        <div className="space-y-4">
            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                <Layers size={20} className="text-primary" />
                Kariyer Özeti
            </h2>

            {profile.careerSummary.length === 0 ? (
                <div className="bg-surface border-2 border-surface-mid rounded-2xl p-5 text-sm text-text-secondary">
                    Henüz yüksek skor kaydın yok. Bir oyun tamamladığında kariyer özetin burada görünecek.
                </div>
            ) : (
                <div className="grid sm:grid-cols-2 gap-3">
                    {profile.careerSummary.map((item) => (
                        <div
                            key={item.game_name}
                            className="bg-surface border-2 border-surface-mid rounded-2xl p-4"
                        >
                            <div className="flex items-center justify-between gap-3 mb-2">
                                <h3 className="text-sm font-bold text-text-main truncate">
                                    {GAME_LABELS[item.game_name] ?? item.game_name}
                                </h3>
                                <span className="text-[10px] font-black uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-full">
                                    {item.level}
                                </span>
                            </div>
                            <p className="text-2xl font-black text-text-main tabular-nums flex items-center gap-2">
                                <TrendingUp size={16} className="text-primary" />
                                {item.high_score.toLocaleString('tr-TR')}
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
