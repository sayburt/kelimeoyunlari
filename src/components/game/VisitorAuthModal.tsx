'use client';

import React from 'react';
import { X, Swords } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

interface VisitorAuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VisitorAuthModal({ isOpen, onClose }: VisitorAuthModalProps) {
    const router = useRouter();

    if (!isOpen) return null;

    // Use current URL as redirect to return to same game
    const currentUrl = typeof window !== 'undefined' ? window.location.pathname : '/';
    const redirectUrl = encodeURIComponent(currentUrl);

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-bg/80 backdrop-blur-sm">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-surface border-2 border-surface-mid rounded-2xl p-6 w-full max-w-sm shadow-2xl relative"
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-text-secondary hover:text-text-main transition-colors p-1"
                        >
                            <X size={20} />
                        </button>

                        <div className="flex justify-center items-center gap-3 mb-4">
                            <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                                <Swords className="text-primary w-6 h-6" />
                            </div>
                        </div>

                        <h2 className="text-xl font-black text-text-main mb-3 text-center">Üye Olun</h2>

                        <p className="text-sm text-center text-text-secondary mb-6 leading-relaxed">
                            Arkadaşlarınıza <strong className="text-text-main">meydan okumak</strong> ve puanlarınızın <strong className="text-text-main">sıralama tablosunda</strong> yer alması için üye olmalısınız.
                        </p>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => router.push(`/login?redirect=${redirectUrl}`)}
                                className="w-full bg-primary text-bg font-black py-3 rounded-xl shadow-[0_0_15px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-transform"
                            >
                                GİRİŞ YAP
                            </button>
                            <button
                                onClick={() => router.push(`/register?redirect=${redirectUrl}`)}
                                className="w-full bg-surface-hover text-text-main font-bold py-3 rounded-xl hover:bg-surface-mid transition-colors border border-surface-hover"
                            >
                                ÜYE OL
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
