'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, LogOut } from 'lucide-react';
import { profileService } from '@/services/profileService';

const AVATARS = [
    '😎', '🤓', '🤠', '🥳',
    '🎃', '🤖', '👽', '🐵',
    '🦊', '🐼', '🦁', '🐸',
    '🦉', '🐯', '🐱', '🦄',
    '🧠', '💎', '🔥', '⭐',
];

interface EditProfileModalProps {
    userId: string;
    username: string;
    avatar: string;
    onClose: () => void;
    onSave: (username: string, avatar: string) => void;
    onSignOut: () => void;
}

export function EditProfileModal({ userId, username, avatar, onClose, onSave, onSignOut }: EditProfileModalProps) {
    const [editUsername, setEditUsername] = useState(username);
    const [editAvatar, setEditAvatar] = useState(avatar);
    const [saving, setSaving] = useState(false);

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

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-surface border-2 border-surface-mid rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-text-secondary hover:text-text-main transition-colors p-1"
                >
                    <X size={20} />
                </button>

                <h2 className="text-xl font-black text-text-main mb-6">Profili Düzenle</h2>

                {/* Avatar Seçimi */}
                <div className="mb-6">
                    <label className="block text-sm font-bold text-text-secondary mb-3">Avatar Seç</label>
                    <div className="grid grid-cols-5 gap-3">
                        {AVATARS.map(a => (
                            <button
                                key={a}
                                onClick={() => setEditAvatar(a)}
                                className={`text-3xl flex items-center justify-center h-14 rounded-xl transition-all ${editAvatar === a
                                    ? 'bg-primary/20 border-2 border-primary scale-110 shadow-[0_0_12px_rgba(34,211,238,0.2)]'
                                    : 'bg-surface-mid/50 border-2 border-transparent hover:scale-105 hover:bg-surface-mid'}`}
                            >
                                {a}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Kullanıcı Adı */}
                <div className="mb-8">
                    <label className="block text-sm font-bold text-text-secondary mb-2">Kullanıcı Adı</label>
                    <input
                        type="text"
                        value={editUsername}
                        onChange={(e) => setEditUsername(e.target.value)}
                        className="w-full bg-bg border-2 border-surface-mid rounded-xl px-4 py-3 text-text-main focus:border-primary focus:outline-none transition-colors font-medium"
                        placeholder="Kullanıcı adınızı girin"
                        maxLength={20}
                    />
                </div>

                {/* Butonlar */}
                <button
                    onClick={handleSave}
                    disabled={saving || !editUsername.trim()}
                    className="w-full bg-primary text-bg font-bold py-3 rounded-xl hover:scale-[1.02] transition-transform disabled:opacity-50 flex justify-center items-center shadow-[0_0_15px_rgba(34,211,238,0.2)]"
                >
                    {saving ? <div className="w-5 h-5 border-2 border-bg/30 border-t-bg rounded-full animate-spin" /> : 'Kaydet'}
                </button>

                {/* Çıkış Yap */}
                <div className="mt-6 pt-6 border-t border-surface-mid">
                    <button
                        onClick={onSignOut}
                        className="w-full flex items-center justify-center gap-2 text-danger font-bold py-2.5 rounded-xl hover:bg-danger/10 transition-colors"
                    >
                        <LogOut size={18} />
                        Hesaptan Çıkış Yap
                    </button>
                </div>
            </motion.div>
        </div>
    );
}
