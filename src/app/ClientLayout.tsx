'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // Eğer /games ile başlıyorsa (örn. /games/wordle) global header (Navbar) ve Footer gizlensin
    const isGameRoute = pathname?.startsWith('/games');

    return (
        <>
            {!isGameRoute && <Navbar />}
            <main className="flex-1">{children}</main>
            <Footer />
        </>
    );
}
