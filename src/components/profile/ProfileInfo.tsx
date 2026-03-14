'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Variants } from 'framer-motion';
import { User, Settings } from 'lucide-react';
import { ProfileData } from '@/services/profileService';
import { BadgesSection } from './BadgesSection';

interface ProfileInfoProps {
    profile: ProfileData;
    activeAvatar: string;
    memberSince: string | null;
    onEditClick: () => void;
    itemVariants: Variants;
    hideEditButton?: boolean;
}

export function ProfileInfo({ profile, activeAvatar, memberSince, onEditClick, itemVariants, hideEditButton }: ProfileInfoProps) {
    const displayName = profile.username ?? 'Misafir Oyuncu';

    return (
        <motion.div
            variants={itemVariants}
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 w-full"
        >
            <div className="flex gap-4 items-center">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-surface border-2 border-surface-mid flex items-center justify-center text-3xl shrink-0 shadow-[0_0_20px_rgba(0,0,0,0.2)]">
                    {profile.isGuest ? (
                        <User size={32} className="text-text-secondary" />
                    ) : (
                        <span>{activeAvatar}</span>
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
                        <p className="text-sm text-text-secondary mt-0.5 flex items-center gap-1">
                            Misafir olarak oynuyorsun
                        </p>
                    )}
                </div>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                {!profile.isGuest && (
                    <div className="flex-1 min-w-[200px] sm:min-w-[300px]">
                        <BadgesSection profile={profile} isHeader={true} />
                    </div>
                )}

                {!profile.isGuest && !hideEditButton && (
                    <button
                        onClick={onEditClick}
                        className="p-2 sm:px-4 sm:py-2 rounded-xl bg-surface border-2 border-surface-mid hover:border-primary/40 text-text-secondary hover:text-text-main transition-colors flex items-center gap-2 group shrink-0"
                    >
                        <Settings size={20} className="group-hover:rotate-45 transition-transform" />
                        <span className="hidden sm:inline font-bold text-sm">Düzenle</span>
                    </button>
                )}
            </div>
        </motion.div>
    );
}
