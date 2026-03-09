'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { profileService, ProfileData } from '@/services/profileService';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Swords,
} from 'lucide-react';

// Yeni bileşenler
import { ProfileInfo } from '@/components/profile/ProfileInfo';
import { StatsCards } from '@/components/profile/StatsCards';
import { CareerSummary } from '@/components/profile/CareerSummary';
import { GameStatsTab } from '@/components/profile/GameStatsTab';
import { ChallengeStatsTab } from '@/components/profile/ChallengeStatsTab';
import { BadgesSection } from '@/components/profile/BadgesSection';
import { EditProfileModal } from '@/components/profile/EditProfileModal';

const AVATARS = [
    '😎', '🤓', '🤠', '🥳',
    '🎃', '🤖', '👽', '🐵',
    '🦊', '🐼', '🦁', '🐸',
    '🦉', '🐯', '🐱', '🦄',
    '🧠', '💎', '🔥', '⭐',
];

const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

type Tab = 'normal' | 'challenge';

export default function ProfilePage() {
    const { user, loading: authLoading, signOut } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<Tab>('normal');
    const [isEditingProfile, setIsEditingProfile] = useState(false);

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

    const activeAvatar = profile.avatar ?? AVATARS[0];
    const memberSince = profile.createdAt
        ? new Date(profile.createdAt).toLocaleDateString('tr-TR', {
            year: 'numeric',
            month: 'long',
        })
        : null;

    return (
        <div className="min-h-screen bg-bg hero-glow px-4 py-10 sm:py-16">
            <div className="max-w-3xl mx-auto">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="space-y-8"
                >
                    {/* ─── Profil Başlığı ─── */}
                    <ProfileInfo
                        profile={profile}
                        activeAvatar={activeAvatar}
                        memberSince={memberSince}
                        onEditClick={() => setIsEditingProfile(true)}
                        itemVariants={itemVariants}
                    />

                    {/* ─── Özet Kartlar ─── */}
                    <StatsCards profile={profile} itemVariants={itemVariants} />

                    {/* ─── Kariyer Özeti ─── */}
                    <motion.div variants={itemVariants}>
                        <CareerSummary profile={profile} />
                    </motion.div>

                    {/* ─── Sekmeler ─── */}
                    <motion.div variants={itemVariants}>
                        <div className="flex gap-1 p-1 bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] rounded-2xl">
                            <button
                                onClick={() => setActiveTab('normal')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'normal'
                                    ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                                    : 'text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                <BarChart3 size={16} />
                                Normal Oyunlar
                            </button>
                            <button
                                onClick={() => setActiveTab('challenge')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all duration-200 ${activeTab === 'challenge'
                                    ? 'bg-primary text-bg shadow-[0_0_12px_rgba(34,211,238,0.3)]'
                                    : 'text-text-secondary hover:text-text-main'
                                    }`}
                            >
                                <Swords size={16} />
                                Meydan Okumalar
                            </button>
                        </div>
                    </motion.div>

                    {/* ─── Sekme İçeriği ─── */}
                    <motion.div
                        key={activeTab}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.25 }}
                        className="space-y-6"
                    >
                        {activeTab === 'normal' ? (
                            <>
                                <GameStatsTab profile={profile} />
                                <BadgesSection profile={profile} />
                            </>
                        ) : (
                            <ChallengeStatsTab profile={profile} />
                        )}
                    </motion.div>
                </motion.div>

                {/* ─── Profil Düzenleme Modalı ─── */}
                {isEditingProfile && user && (
                    <EditProfileModal
                        userId={user.id}
                        username={profile.username ?? ''}
                        avatar={activeAvatar}
                        onClose={() => setIsEditingProfile(false)}
                        onSave={(username, avatar) => {
                            setProfile(prev => prev ? { ...prev, username, avatar } : null);
                        }}
                        onSignOut={() => {
                            setIsEditingProfile(false);
                            signOut();
                        }}
                    />
                )}
            </div>
        </div>
    );
}
