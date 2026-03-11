"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ContactModal } from "./ContactModal";

export default function Footer() {
    const pathname = usePathname();
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);

    // Oyun ekranında footer gizlensin (PRD kuralı)
    const isGamePage = pathname.startsWith("/games/");
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isGamePage || isAuthPage) return null;

    return (
        <>
            <footer className="pt-6 pb-2 md:py-12 px-6 premium-footer text-text-secondary">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 md:gap-8">
                    <div className="text-center md:text-left">
                        <h2 className="text-xl font-black text-text-main mb-0 md:mb-2"><span className="text-primary">KELİME</span> oyunları</h2>
                        <p className="hidden md:block text-sm max-w-xs text-text-secondary mt-1">
                            Kelime oyunu tutkunlarının yeni buluşma noktası.
                        </p>
                    </div>

                    <div className="flex gap-4 md:gap-8 text-sm font-bold">
                        <Link href="/ozellikler" className="hover:text-text-main transition-colors">Özellikler</Link>
                        <Link href="/privacy" className="hover:text-text-main transition-colors">Gizlilik</Link>
                        <Link href="/kvkk" className="hover:text-text-main transition-colors">KVKK</Link>
                        <button
                            onClick={() => setIsContactModalOpen(true)}
                            className="hover:text-text-main transition-colors text-left"
                        >
                            İletişim
                        </button>
                    </div>

                    <div className="text-[10px] md:text-xs">
                        © {new Date().getFullYear()} Kelime Oyunları. Tüm hakları saklıdır.
                    </div>
                </div>
            </footer>

            <ContactModal
                isOpen={isContactModalOpen}
                onClose={() => setIsContactModalOpen(false)}
            />
        </>
    );
}
