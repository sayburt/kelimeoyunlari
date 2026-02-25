'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { Gamepad2, Trophy, Percent, Flame } from 'lucide-react';
import { StatCard } from '@/components/game/StatCard';
import { ProfileData } from '@/services/profileService';

interface StatsCardsProps {
    profile: ProfileData;
    itemVariants: Variants;
}

export function StatsCards({ profile, itemVariants }: StatsCardsProps) {
    return (
        <motion.div variants={itemVariants}>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <StatCard
                    label="Toplam Oyun"
                    value={profile.totalPlayed}
                    icon={<Gamepad2 size={20} />}
                />
                <StatCard
                    label="Galibiyet"
                    value={profile.totalWon}
                    icon={<Trophy size={20} />}
                />
                <StatCard
                    label="Kazanma Oranı"
                    value={`%${profile.winRate}`}
                    icon={<Percent size={20} />}
                    highlight
                />
                <StatCard
                    label="En İyi Seri"
                    value={profile.bestStreak}
                    icon={<Flame size={20} />}
                    highlight
                />
            </div>
        </motion.div>
    );
}
