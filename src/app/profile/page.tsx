'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { profileService, ProfileData } from '@/services/profileService';
import { StatCard } from '@/components/game/StatCard';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
    Gamepad2,
    Trophy,
    Percent,
    Flame,
    User,
    Award,
    LogIn,
    Target,
    Zap,
    BarChart3,
} from 'lucide-react';

// Rozet adı mapping
const BADGE_LABELS: Record<string, { label: string; icon: React.ReactNode }> = {
    first_win: { label: 'İlk Galibiyet', icon: <Trophy size={20} /> },
    streak_5: { label: '5 Seri Galibiyet', icon: <Flame size={20} /> },
    streak_10: { label: '10 Seri Galibiyet', icon: <Zap size={20} /> },
    games_10: { label: '10 Oyun Oynandı', icon: <Gamepad2 size={20} /> },
    games_50: { label: '50 Oyun Oynandı', icon: <Target size={20} /> },
    perfect_score: { label: 'Mükemmel Skor', icon: <Award size={20} /> },
};

// Oyun adı mapping
const GAME_LABELS: Record<string, string> = {
    wordle: 'Wordle',
    anagram: 'Anagram',
    hangman: 'Adam Asmaca',
    quiz: 'Kelime Bilgi',
};

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProfile() {
            const data = await profileService.getProfileData(user?.id);
            setProfile(data);
            setLoading(false);
        }
        if (!authLoading) {
            fetchProfile();
        }
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!profile) return null;

    const displayName = profile.username ?? 'Misafir Oyuncu';
    const initial = displayName.charAt(0).toLocaleUpperCase('tr-TR');
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
        })
        : null;

    return (
        <div className="min-h-screen bg-bg px-4 py-10 sm:py-16">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* ─── Profil Başlığı ─── */}
                    <motion.div
                        variants={itemVariants}
                        className="flex items-center gap-5"
                    >
                        <div className="w-16 h-16 rounded-full bg-primary/15 border-2 border-primary/40 flex items-center justify-center text-primary text-2xl font-black shrink-0 shadow-[0_0_24px_rgba(34,211,238,0.15)]">
                            {profile.isGuest ? (
                                <User size={28} />
                            ) : (
                                initial
                            )}
                        </div>
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-black text-text-main tracking-tight">
                                {displayName}
                            </h1>
                            {memberSince && (
                                <p className="text-sm text-text-secondary mt-0.5">
                                    Üye: {memberSince}
                                </p>
                            )}
                            {profile.isGuest && (
                                <p className="text-sm text-text-secondary mt-0.5">
                                    Misafir olarak oynuyorsun
                                </p>
                            )}
                        </div>
                    </motion.div>

                    {/* ─── Özet Kartlar ─── */}
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

                    {/* ─── Oyun Bazlı İstatistikler ─── */}
                    {profile.stats.length > 0 && (
                        <motion.div variants={itemVariants} className="space-y-4">
                            <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                                <BarChart3 size={20} className="text-primary" />
                                Oyun İstatistikleri
                            </h2>
                            <div className="grid gap-3">
                                {profile.stats.map((stat) => {
                                    const gameWinRate =
                                        stat.played > 0
                                            ? Math.round(
                                                (stat.won / stat.played) * 100
                                            )
                                            : 0;
                                    return (
                                        <div
                                            key={stat.game_name}
                                            className="bg-surface border-2 border-surface-mid rounded-2xl p-5"
                                        >
                                            <div className="flex items-center justify-between mb-4">
                                                <h3 className="text-base font-bold text-text-main">
                                                    {GAME_LABELS[stat.game_name] ??
                                                        stat.game_name}
                                                </h3>
                                                <span className="text-xs font-bold text-text-secondary bg-bg/50 px-3 py-1 rounded-full">
                                                    %{gameWinRate} başarı
                                                </span>
                                            </div>

                                            {/* İlerleme çubuğu */}
                                            <div className="w-full h-2 bg-bg rounded-full mb-4 overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{
                                                        width: `${gameWinRate}%`,
                                                    }}
                                                    transition={{
                                                        duration: 0.8,
                                                        ease: 'easeOut',
                                                    }}
                                                    className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                                                />
                                            </div>

                                            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3 text-center">
                                                <div>
                                                    <p className="text-lg font-black text-text-main">
                                                        {stat.played}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                                                        Oynanan
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-correct">
                                                        {stat.won}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                                                        Kazanılan
                                                    </p>
                                                </div>
                                                <div>
                                                    <p className="text-lg font-black text-text-main">
                                                        {stat.best_score > 0
                                                            ? stat.best_score
                                                            : '—'}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                                                        En İyi Skor
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-lg font-black text-primary">
                                                        {stat.current_streak}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                                                        Mevcut Seri
                                                    </p>
                                                </div>
                                                <div className="hidden sm:block">
                                                    <p className="text-lg font-black text-primary">
                                                        {stat.max_streak}
                                                    </p>
                                                    <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold">
                                                        En İyi Seri
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </motion.div>
                    )}

                    {/* ─── Rozetler ─── */}
                    <motion.div variants={itemVariants} className="space-y-4">
                        <h2 className="text-lg font-black text-text-main flex items-center gap-2">
                            <Award size={20} className="text-primary" />
                            Rozetler
                        </h2>

                        {profile.isGuest ? (
                            <div className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center">
                                <Award
                                    size={40}
                                    className="text-text-secondary mx-auto mb-3 opacity-40"
                                />
                                <p className="text-text-secondary text-sm mb-4">
                                    Giriş yaparak rozet kazanabilirsin!
                                </p>
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
                                <Award
                                    size={40}
                                    className="text-text-secondary mx-auto mb-3 opacity-40"
                                />
                                <p className="text-text-secondary text-sm">
                                    Henüz rozet kazanılmadı. Oyun oynayarak
                                    rozet kazanabilirsin!
                                </p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                {profile.badges.map((badge) => {
                                    const info = BADGE_LABELS[badge.badge_key];
                                    return (
                                        <div
                                            key={badge.badge_key}
                                            className="bg-surface border-2 border-primary/20 rounded-2xl p-4 flex flex-col items-center text-center gap-2 shadow-[0_0_12px_rgba(34,211,238,0.08)]"
                                        >
                                            <div className="text-primary">
                                                {info?.icon ?? (
                                                    <Award size={20} />
                                                )}
                                            </div>
                                            <p className="text-xs font-bold text-text-main">
                                                {info?.label ??
                                                    badge.badge_key}
                                            </p>
                                            <p className="text-[10px] text-text-secondary">
                                                {new Date(
                                                    badge.earned_at
                                                ).toLocaleDateString('tr-TR')}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </motion.div>

                    {/* ─── Misafir CTA ─── */}
                    {profile.isGuest && (
                        <motion.div
                            variants={itemVariants}
                            className="bg-gradient-to-br from-primary/5 to-primary/10 border-2 border-primary/20 rounded-2xl p-6 text-center"
                        >
                            <h3 className="text-base font-black text-text-main mb-2">
                                Verilerini Kaydet!
                            </h3>
                            <p className="text-sm text-text-secondary mb-4">
                                Giriş yap ve istatistiklerini kaybetme. Rozetler
                                ve sıralamalar seni bekliyor!
                            </p>
                            <div className="flex items-center justify-center gap-3">
                                <Link
                                    href="/login"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                                >
                                    <LogIn size={16} />
                                    Giriş Yap
                                </Link>
                                <Link
                                    href="/register"
                                    className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold bg-surface text-text-main border-2 border-surface-mid rounded-full hover:border-primary/40 transition-colors"
                                >
                                    Kayıt Ol
                                </Link>
                            </div>
                        </motion.div>
                    )}

                    {/* Boş istatistik durumu */}
                    {profile.stats.length === 0 && (
                        <motion.div
                            variants={itemVariants}
                            className="bg-surface border-2 border-surface-mid rounded-2xl p-8 text-center"
                        >
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
                        </motion.div>
                    )}
                </motion.div>
            </div>
        </div>
    );
}
