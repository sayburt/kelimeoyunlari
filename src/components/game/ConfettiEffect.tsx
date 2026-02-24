'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ConfettiParticle {
    id: string;
    targetX: string;
    targetY: string;
    rotate: number;
    duration: number;
    delay: number;
    width: number;
    height: number;
    borderRadius: string;
    background: string;
}

export interface ConfettiEffectProps {
    isVisible: boolean;
}

export function ConfettiEffect({ isVisible }: ConfettiEffectProps) {
    const [confettiParticles, setConfettiParticles] = useState<ConfettiParticle[]>([]);

    useEffect(() => {
        if (isVisible) {
            const timer = setTimeout(() => {
                const particles = Array.from({ length: 20 }).map((_, i) => ({
                    id: `confetti-${i}`,
                    targetX: `${Math.random() * 100}vw`,
                    targetY: `${Math.random() * 100}vh`,
                    rotate: Math.random() * 720 - 360,
                    duration: 1.5 + Math.random(),
                    delay: Math.random() * 0.3,
                    width: 8 + Math.random() * 8,
                    height: 8 + Math.random() * 8,
                    borderRadius: Math.random() > 0.5 ? '50%' : '2px',
                    background: [
                        '#22C55E',
                        '#22D3EE',
                        '#F59E0B',
                        '#A855F7',
                        '#EC4899',
                    ][Math.floor(Math.random() * 5)],
                }));
                setConfettiParticles(particles);
            }, 0);
            return () => clearTimeout(timer);
        } else {
            const clearTimer = setTimeout(() => setConfettiParticles([]), 0);
            return () => clearTimeout(clearTimer);
        }
    }, [isVisible]);

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div key="confetti-container" className="fixed inset-0 pointer-events-none z-40">
                    {confettiParticles.map((particle) => (
                        <motion.div
                            key={particle.id}
                            initial={{
                                opacity: 1,
                                x: '50vw',
                                y: '40vh',
                                scale: 0,
                            }}
                            animate={{
                                opacity: [1, 1, 0],
                                x: particle.targetX,
                                y: particle.targetY,
                                scale: [0, 1, 0.5],
                                rotate: particle.rotate,
                            }}
                            transition={{
                                duration: particle.duration,
                                delay: particle.delay,
                            }}
                            className="fixed z-40 pointer-events-none"
                            style={{
                                width: particle.width,
                                height: particle.height,
                                borderRadius: particle.borderRadius,
                                background: particle.background,
                            }}
                        />
                    ))}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
