'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface BoggleTimerProps {
    remainingTime: number;
    gameDuration: number;
}

export function BoggleTimer({ remainingTime, gameDuration }: BoggleTimerProps) {
    const progress = Math.max(0, remainingTime / gameDuration);
    const seconds = Math.ceil(remainingTime / 1000);
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const isUrgent = remainingTime <= 30_000; // Son 30 saniye
    const isCritical = remainingTime <= 10_000; // Son 10 saniye

    const barColor = isCritical
        ? 'bg-error'
        : isUrgent
            ? 'bg-present'
            : 'bg-primary';

    return (
        <div className="w-full space-y-1.5">
            {/* Timer text */}
            <div className="flex items-center justify-between px-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-text-muted">
                    KALAN SÜRE
                </span>
                <motion.span
                    className={`
                        font-black text-lg tabular-nums
                        ${isCritical ? 'text-error' : isUrgent ? 'text-present' : 'text-primary'}
                    `}
                    animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ repeat: Infinity, duration: 1 }}
                >
                    {minutes}:{secs.toString().padStart(2, '0')}
                </motion.span>
            </div>

            {/* Progress bar */}
            <div className="h-2 bg-surface-mid rounded-full overflow-hidden">
                <motion.div
                    className={`h-full rounded-full ${barColor} transition-colors duration-500`}
                    style={{ width: `${progress * 100}%` }}
                    animate={isCritical ? { opacity: [1, 0.5, 1] } : { opacity: 1 }}
                    transition={isCritical ? { repeat: Infinity, duration: 0.5 } : {}}
                />
            </div>
        </div>
    );
}
