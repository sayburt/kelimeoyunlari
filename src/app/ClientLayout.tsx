'use client';

import React from 'react';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GameSettingsProvider } from '@/context/GameSettingsContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Eğer /games ile başlıyorsa (örn. /games/wordle) global header (Navbar) ve Footer gizlensin
    const isGameRoute = pathname?.startsWith('/games');

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            return;
        }

        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }

        const isLocalHost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isLocalHost) {
            return;
        }

        navigator.serviceWorker.getRegistrations()
            .then((registrations) => {
                registrations.forEach((registration) => {
                    const scriptUrl =
                        registration.active?.scriptURL ||
                        registration.waiting?.scriptURL ||
                        registration.installing?.scriptURL ||
                        '';

                    if (scriptUrl.includes('firebase-messaging-sw.js') || scriptUrl.includes('firebase')) {
                        void registration.unregister();
                    }
                });
            })
            .catch(() => {
                // Local dev ortamında eski service worker temizliği için best-effort.
            });
    }, []);

    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <GameSettingsProvider>
                {!isGameRoute && <Navbar />}
                <main className="flex-1">{children}</main>
                <Footer />
            </GameSettingsProvider>
        </ThemeProvider>
    );
}
