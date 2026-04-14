'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { profileService, ProfileData } from '@/services/profileService';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Palette, ShieldCheck, Check, Trash2, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const AVATARS = [
    '😎', '🤓', '🤠', '🥳',
    '🎃', '🤖', '👽', '🐵',
    '🦊', '🐼', '🦁', '🐸',
    '🦉', '🐯', '🐱', '🦄',
    '🧠', '💎', '🔥', '⭐',
];

type TabType = 'profile' | 'avatar' | 'security';

export default function SettingsPage() {
    const { user, loading: authLoading } = useAuth();
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const fetchingRef = React.useRef(false);
    const [activeTab, setActiveTab ] = useState<TabType>('profile');
    const [editUsername, setEditUsername] = useState('');
    const [editAvatar, setEditAvatar] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(null as string | null);

    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const loading = authLoading || (user && !profile);

    useEffect(() => {
        if (authLoading || !user || profile || fetchingRef.current) return;

        fetchingRef.current = true;
        profileService.getProfileData(user.id)
            .then(data => {
                if (data) {
                    setProfile(data);
                    setEditUsername(data.username ?? '');
                    setEditAvatar(data.avatar ?? AVATARS[0]);
                }
            })
            .finally(() => {
                fetchingRef.current = false;
            });
    }, [user, authLoading, profile]);

    const handleSave = async (type: 'profile' | 'avatar') => {
        if (!user?.id || saving) return;
        if (type === 'profile' && !editUsername.trim()) return;

        setSaving(true);
        const updates = type === 'profile' 
            ? { username: editUsername } 
            : { avatar: editAvatar };

        const success = await profileService.updateProfile(user.id, updates);
        if (success) {
            setProfile(prev => prev ? { ...prev, ...updates } : null);
            setToastMessage(type === 'avatar' ? 'Avatar değişti' : 'Profil güncellendi');
            window.dispatchEvent(new Event('profileUpdated'));
            setTimeout(() => setToastMessage(null), 3000);
        } else {
            setToastMessage('Bir hata oluştu');
            setTimeout(() => setToastMessage(null), 3000);
        }
        setSaving(false);
    };

    const handleDeleteAccount = async () => {
        setDeleteLoading(true);
        setDeleteError(null);
        const result = await profileService.requestAccountDeletion();
        if (result.success) {
            setDeleteSuccess(true);
            setShowDeleteConfirm(false);
        } else {
            setDeleteError(result.error ?? 'Bir hata oluştu.');
        }
        setDeleteLoading(false);
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-bg flex items-center justify-center">
                <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
                <p className="text-text-secondary mb-4">Ayarları görüntülemek için giriş yapmalısınız.</p>
                <Link href="/login" className="bg-primary text-bg font-bold py-2 px-6 rounded-xl">Giriş Yap</Link>
            </div>
        );
    }

    const tabs = [
        { id: 'profile' as TabType, label: 'Profil', icon: User },
        { id: 'avatar' as TabType, label: 'Avatar', icon: Palette },
        { id: 'security' as TabType, label: 'Güvenlik', icon: ShieldCheck },
    ];

    return (
        <div className="min-h-screen bg-bg hero-glow px-4 py-10 sm:py-16">
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.2 }}
                        className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[var(--theme-card-glass)] backdrop-blur-xl border border-primary text-text-main px-6 py-3 rounded-xl text-sm font-bold shadow-[0_8px_24px_rgba(34,211,238,0.2)] pointer-events-none flex items-center gap-2"
                    >
                        <Check size={18} className="text-primary" />
                        {toastMessage}
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="max-w-xl mx-auto">
                <div className="mb-8 flex items-center justify-between">
                    <Link href="/profile/stats" className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors font-bold text-sm">
                        <ArrowLeft size={16} />
                        Geri Dön
                    </Link>
                    <h1 className="text-2xl font-black text-text-main tracking-tight">Profil Ayarları</h1>
                </div>

                <div className="bg-[var(--theme-card-glass)] backdrop-blur-xl border border-[var(--theme-glass-border)] rounded-3xl overflow-hidden shadow-2xl">
                    {/* Tabs Navigation */}
                    <div className="flex px-4 pt-4 gap-1 border-b border-surface-mid/30">
                        {tabs.map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`flex-1 flex items-center justify-center gap-2 py-4 px-2 rounded-t-xl text-sm font-bold transition-all relative ${isActive
                                        ? 'text-primary'
                                        : 'text-text-secondary hover:text-text-main'
                                        }`}
                                >
                                    <Icon size={16} />
                                    {tab.label}
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTabSettings"
                                            className="absolute bottom-0 left-2 right-2 h-1 bg-primary rounded-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="p-8">
                        <AnimatePresence mode="wait">
                            {activeTab === 'profile' && (
                                <motion.div
                                    key="profile-tab"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-6"
                                >
                                    <div>
                                        <label className="block text-sm font-bold text-text-secondary mb-2 uppercase tracking-wider">Kullanıcı Adı</label>
                                        <input
                                            type="text"
                                            value={editUsername}
                                            onChange={(e) => setEditUsername(e.target.value)}
                                            className="w-full bg-surface-mid/20 border border-surface-mid rounded-2xl px-5 py-4 text-text-main focus:border-primary focus:outline-none transition-colors font-bold text-lg"
                                            placeholder="Kullanıcı adınızı girin"
                                            maxLength={20}
                                        />
                                        <p className="mt-3 text-sm text-text-secondary leading-relaxed">
                                            Bu ad oyun liderlik tablolarında ve profilde görünecektir.
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => handleSave('profile')}
                                        disabled={saving || !editUsername.trim() || profile?.username === editUsername}
                                        className="w-full bg-primary text-bg font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_8px_20px_rgba(34,211,238,0.25)]"
                                    >
                                        {saving ? (
                                            <div className="w-6 h-6 border-3 border-bg/30 border-t-bg rounded-full animate-spin" />
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                <Check size={20} />
                                                <span>Değişiklikleri Kaydet</span>
                                            </div>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'avatar' && (
                                <motion.div
                                    key="avatar-tab"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-6"
                                >
                                    <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
                                        {AVATARS.map(a => (
                                            <button
                                                key={a}
                                                onClick={() => setEditAvatar(a)}
                                                className={`text-4xl flex items-center justify-center aspect-square rounded-2xl transition-all ${editAvatar === a
                                                    ? 'bg-primary/20 border-2 border-primary scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                                    : 'bg-surface-mid/30 border border-surface-mid/50 hover:scale-110 hover:bg-surface-mid active:scale-95'}`}
                                            >
                                                {a}
                                            </button>
                                        ))}
                                    </div>
                                    <button
                                        onClick={() => handleSave('avatar')}
                                        disabled={saving || profile?.avatar === editAvatar}
                                        className="w-full bg-primary text-bg font-black py-4 rounded-2xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 flex justify-center items-center shadow-[0_8px_20px_rgba(34,211,238,0.25)]"
                                    >
                                        {saving ? (
                                            <div className="w-6 h-6 border-3 border-bg/30 border-t-bg rounded-full animate-spin" />
                                        ) : (
                                            <span>Avatarı Kaydet</span>
                                        )}
                                    </button>
                                </motion.div>
                            )}

                            {activeTab === 'security' && (
                                <motion.div
                                    key="security-tab"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: 10 }}
                                    className="space-y-4"
                                >
                                    <div className="bg-wrong/5 border border-wrong/10 rounded-2xl p-6">
                                        <div className="flex items-center gap-3 text-wrong mb-4">
                                            <Trash2 size={24} />
                                            <h3 className="font-black text-lg">Hesabı Sil</h3>
                                        </div>

                                        {!showDeleteConfirm ? (
                                            <div className="space-y-4">
                                                <p className="text-sm text-text-secondary leading-relaxed">
                                                    Hesabınızı sildiğinizde tüm istatistikleriniz, rozetleriniz ve verileriniz kalıcı olarak kaldırılacaktır.
                                                </p>
                                                <button
                                                    onClick={() => setShowDeleteConfirm(true)}
                                                    className="w-full bg-wrong/10 text-wrong font-bold py-3.5 rounded-xl hover:bg-wrong hover:text-bg transition-all border border-wrong/20"
                                                >
                                                    Hesabımı Silmek İstiyorum
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                <p className="text-sm font-bold text-text-main text-center">
                                                    Emin misiniz?
                                                </p>
                                                <p className="text-xs text-center text-text-secondary">
                                                    Onay için e-posta adresinize bir bağlantı gönderilecek.
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={handleDeleteAccount}
                                                        disabled={deleteLoading}
                                                        className="flex-1 bg-wrong text-bg text-sm font-bold py-3 rounded-xl hover:bg-wrong/90 transition-colors disabled:opacity-50"
                                                    >
                                                        {deleteLoading ? 'Gönderiliyor...' : 'Doğrulama Gönder'}
                                                    </button>
                                                    <button
                                                        onClick={() => setShowDeleteConfirm(false)}
                                                        className="flex-1 bg-surface-mid text-text-main text-sm font-bold py-3 rounded-xl hover:bg-surface-mid2 transition-colors"
                                                    >
                                                        Vazgeç
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {deleteSuccess && (
                                            <div className="mt-4 p-4 bg-correct/10 border border-correct/20 rounded-xl text-center space-y-1">
                                                <p className="text-correct font-bold text-sm">Onay e-postası gönderildi!</p>
                                                <p className="text-xs text-text-secondary">Lütfen gelen kutunuzu kontrol edin.</p>
                                            </div>
                                        )}
                                        {deleteError && (
                                            <div className="mt-4 p-4 bg-wrong/10 border border-wrong/20 rounded-xl text-center">
                                                <p className="text-wrong font-bold text-xs">{deleteError}</p>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-8 flex justify-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black opacity-50">
                        Kelime Oyunları © 2026
                    </p>
                </div>
            </div>
        </div>
    );
}
