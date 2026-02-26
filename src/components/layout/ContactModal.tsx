'use client';

import React, { useState } from 'react';
import { X, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function ContactModal({ isOpen, onClose }: ContactModalProps) {
    const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        topic: 'Genel',
        message: ''
    });

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus('submitting');

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Gönderim hatası');
            }

            setStatus('success');
            setTimeout(() => {
                onClose();
                // Formu sıfırla
                setTimeout(() => {
                    setStatus('idle');
                    setFormData({ name: '', email: '', topic: 'Genel', message: '' });
                }, 300);
            }, 2000);
        } catch (error) {
            console.error('İletişim form hatası:', error);
            alert('Mesaj gönderilirken bir hata oluştu. Lütfen bağlantınızı kontrol edip tekrar deneyin.');
            setStatus('idle');
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-surface border-2 border-surface-mid rounded-2xl p-6 w-full max-w-md shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-text-secondary hover:text-text-main transition-colors p-1"
                            disabled={status === 'submitting'}
                        >
                            <X size={20} />
                        </button>

                        <h2 className="text-xl font-black text-text-main mb-6">İletişim</h2>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="flex flex-col items-center justify-center py-8 text-center space-y-4"
                            >
                                <CheckCircle2 size={48} className="text-green-500" />
                                <div>
                                    <h3 className="text-lg font-bold text-text-main">Mesajınız Alındı</h3>
                                    <p className="text-sm text-text-secondary mt-1">En kısa sürede size geri dönüş yapacağız.</p>
                                </div>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label htmlFor="name" className="block text-xs font-bold text-text-secondary mb-1">
                                        İsim Soyisim
                                    </label>
                                    <input
                                        id="name"
                                        type="text"
                                        required
                                        className="w-full bg-surface-mid border-2 border-surface-mid text-text-main rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="Adınız Soyadınız"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        disabled={status === 'submitting'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-xs font-bold text-text-secondary mb-1">
                                        E-posta Adresi
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        required
                                        className="w-full bg-surface-mid border-2 border-surface-mid text-text-main rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        placeholder="ornek@email.com"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        disabled={status === 'submitting'}
                                    />
                                </div>

                                <div>
                                    <label htmlFor="topic" className="block text-xs font-bold text-text-secondary mb-1">
                                        İletişim Konusu
                                    </label>
                                    <select
                                        id="topic"
                                        className="w-full bg-surface-mid border-2 border-surface-mid text-text-main rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                                        value={formData.topic}
                                        onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                                        disabled={status === 'submitting'}
                                    >
                                        <option value="Genel">Genel</option>
                                        <option value="Hata Bildirimi">Hata Bildirimi</option>
                                        <option value="Oyun Talebi">Oyun Talebi</option>
                                        <option value="Reklam Talebi">Reklam Talebi</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="message" className="block text-xs font-bold text-text-secondary mb-1">
                                        Mesajınız
                                    </label>
                                    <textarea
                                        id="message"
                                        required
                                        rows={4}
                                        className="w-full bg-surface-mid border-2 border-surface-mid text-text-main rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-primary/50 transition-colors resize-none"
                                        placeholder="Mesajınızı buraya yazın..."
                                        value={formData.message}
                                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                        disabled={status === 'submitting'}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'submitting'}
                                    className="w-full mt-2 bg-primary text-bg font-black py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-transform disabled:opacity-70 disabled:hover:scale-100 flex items-center justify-center gap-2"
                                >
                                    {status === 'submitting' ? (
                                        <span className="animate-pulse">GÖNDERİLİYOR...</span>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            <span>GÖNDER</span>
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
