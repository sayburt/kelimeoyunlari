'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface ErrorToastProps {
    message: string | null;
}

export function ErrorToast({ message }: ErrorToastProps) {
    return (
        <AnimatePresence>
            {message && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-20 left-1/2 -translate-x-1/2 z-30 bg-slate-800/80 backdrop-blur-xl border border-slate-600/50 text-gray-200 px-5 py-2.5 rounded-xl text-sm font-bold shadow-[0_8px_24px_rgba(0,0,0,0.3)] pointer-events-none"
                >
                    {message}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
