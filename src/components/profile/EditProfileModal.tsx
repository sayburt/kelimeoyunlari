'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, User, Palette, ShieldCheck, Check } from 'lucide-react';
import { profileService } from '@/services/profileService';

const AVATARS = [
    '😎', '🤓', '🤠', '🥳',
    '🎃', '🤖', '👽', '🐵',
    '🦊', '🐼', '🦁', '🐸',
    '🦉', '🐯', '🐱', '🦄',
    '🧠', '💎', '🔥', '⭐',
];

type TabType = 'profile' | 'avatar' | 'security';

interface EditProfileModalProps {
    userId: string;
    username: string;
    avatar: string;
    onClose: () => void;
    onSave: (username: string, avatar: string) => void;
    onSignOut: () => void;
}

export function EditProfileModal({ userId, username, avatar, onClose, onSave }: EditProfileModalProps) {
    const [activeTab, setActiveTab] = useState<TabType>('profile');
    const [editUsername, setEditUsername] = useState(username);
    const [editAvatar, setEditAvatar] = useState(avatar);
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [deleteSuccess, setDeleteSuccess] = useState(false);
    const [deleteError, setDeleteError] = useState(null as string | null);

    const handleSave = async () => {
        if (!userId || saving || !editUsername.trim()) return;
        setSaving(true);
        const success = await profileService.updateProfile(userId, {
            username: editUsername,
            avatar: editAvatar
        });
        if (success) {
            onSave(editUsername, editAvatar);
            onClose();
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

    const tabs = [
        { id: 'profile' as TabType, label: 'Profil', icon: User },
        { id: 'avatar' as TabType, label: 'Avatar', icon: Palette },
        { id: 'security' as TabType, label: 'Güvenlik', icon: ShieldCheck },
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border border-surface-mid rounded-3xl w-full max-w-md shadow-2xl relative overflow-hidden glass-surface"
            >
                {/* Header */}
                <div className="p-6 pb-2 flex items-center justify-between border-b border-surface-mid">
                    <h2 className="text-xl font-black text-text-main">Ayarlar</h2>
                    <button
                        onClick={onClose}
                        className="text-text-secondary hover:text-text-main transition-colors p-2 bg-surface-mid/50 rounded-full"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs Navigation */}
                <div className="flex px-4 pt-4 gap-1">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-bold transition-all relative ${isActive
                                    ? 'text-primary'
                                    : 'text-text-secondary hover:text-text-main hover:bg-surface-mid/30'
                                    }`}
                            >
                                <Icon size={16} />
                                {tab.label}
                                {isActive && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-2 right-2 h-1 bg-primary rounded-full"
                                    />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Tab Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
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
                                    <label className="block text-sm font-bold text-text-secondary mb-2">Kullanıcı Adı</label>
                                    <input
                                        type="text"
                                        value={editUsername}
                                        onChange={(e) => setEditUsername(e.target.value)}
                                        className="w-full bg-bg border border-surface-mid rounded-2xl px-5 py-4 text-text-main focus:border-primary focus:outline-none transition-colors font-bold text-lg"
                                        placeholder="Kullanıcı adınızı girin"
                                        maxLength={20}
                                    />
                                    <p className="mt-2 text-xs text-text-secondary">
                                        Bu ad oyun liderlik tablolarında ve profilde görünecektir.
                                    </p>
                                </div>

                                <button
                                    onClick={handleSave}
                                    disabled={saving || !editUsername.trim()}
                                    className="w-full bg-primary text-bg font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center shadow-[0_8px_20px_rgba(34,211,238,0.25)]"
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
                                className="space-y-4"
                            >
                                <div className="grid grid-cols-4 gap-4">
                                    {AVATARS.map(a => (
                                        <button
                                            key={a}
                                            onClick={() => setEditAvatar(a)}
                                            className={`text-4xl flex items-center justify-center h-20 rounded-2xl transition-all ${editAvatar === a
                                                ? 'bg-primary/20 border-2 border-primary scale-105 shadow-[0_0_20px_rgba(34,211,238,0.3)]'
                                                : 'bg-surface-mid/30 border border-surface-mid/50 hover:scale-105 hover:bg-surface-mid'}`}
                                        >
                                            {a}
                                        </button>
                                    ))}
                                </div>
                                <div className="pt-4">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="w-full bg-primary text-bg font-black py-4 rounded-2xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center shadow-[0_8px_20px_rgba(34,211,238,0.25)]"
                                    >
                                        Avatarı Kaydet
                                    </button>
                                </div>
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
                                <div className="bg-danger/5 border border-danger/10 rounded-2xl p-6">
                                    <div className="flex items-center gap-3 text-danger mb-4">
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
                                                className="w-full bg-danger/10 text-danger font-bold py-3.5 rounded-xl hover:bg-danger hover:text-white transition-all border border-danger/20"
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
                                                    className="flex-1 bg-danger text-white text-sm font-bold py-3 rounded-xl hover:bg-danger-dark transition-colors disabled:opacity-50"
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
                                        <div className="mt-4 p-4 bg-danger/10 border border-danger/20 rounded-xl text-center">
                                            <p className="text-danger font-bold text-xs">{deleteError}</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Footer Info */}
                <div className="px-6 py-4 bg-surface-mid/10 border-t border-surface-mid flex justify-center">
                    <p className="text-[10px] text-text-secondary uppercase tracking-widest font-black">
                        Kelime Oyunları © 2026
                    </p>
                </div>
            </motion.div>
        </div>
    );
}


