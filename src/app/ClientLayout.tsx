'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { GameSettingsProvider } from '@/context/GameSettingsContext';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Eğer /games ile başlıyorsa (örn. /games/wordle) global header (Navbar) ve Footer gizlensin
    const isGameRoute = pathname?.startsWith('/games');

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
