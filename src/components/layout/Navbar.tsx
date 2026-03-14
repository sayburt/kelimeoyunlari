"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AvatarMenu } from "@/components/ui/AvatarMenu";
import { shareContent } from "@/utils/shareUtils";
import { useState, useEffect } from "react";
import { Share2, User, Menu, X, Trophy, Home, HelpCircle, Star } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();
    const [isCopied, setIsCopied] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleShare = async () => {
        const result = await shareContent({
            title: 'Kelime Oyunları',
            text: 'En eğlenceli kelime oyunları burada! Hemen denemelisin.',
            url: window.location.origin,
        });

        if (result.success && result.type === 'copy') {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };

    // Auth sayfalarında Navbar'ı gizleyebiliriz veya farklı gösterebiliriz
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isAuthPage) return null;

    return (
        <nav className={`h-16 flex items-center justify-between px-6 sticky top-0 z-50 transition-all duration-300 ${
            isScrolled || isMobileMenuOpen 
                ? "bg-bg shadow-md border-b border-surface-mid" 
                : "glass-header"
        }`}>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    className="md:hidden p-1.5 -ml-1 text-text-main hover:bg-surface/10 rounded-md transition-colors"
                >
                    {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
                <Link href="/" className="text-2xl font-black text-text-main tracking-tighter">
                    <span className="text-primary">KELİME</span> oyunları
                </Link>
            </div>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 mr-4">
                    <Link
                        href="/"
                        className={`text-sm font-bold flex items-center gap-1.5 transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-text-main"
                            }`}
                    >
                        <Home size={16} />
                        Ana Sayfa
                    </Link>
                    <Link
                        href="/nasil-oynanir"
                        className={`text-sm font-bold flex items-center gap-1.5 transition-colors hover:text-primary ${pathname.startsWith("/nasil-oynanir") ? "text-primary" : "text-text-main"
                            }`}
                    >
                        <HelpCircle size={16} />
                        Nasıl Oynanır?
                    </Link>
                    <Link
                        href="/ozellikler"
                        className={`text-sm font-bold flex items-center gap-1.5 transition-colors hover:text-primary ${pathname.startsWith("/ozellikler") ? "text-primary" : "text-text-main"
                            }`}
                    >
                        <Star size={16} />
                        Özellikler
                    </Link>
                    <Link
                        href="/leaderboard"
                        className={`text-sm font-bold transition-colors hover:text-primary flex items-center gap-1.5 ${pathname.startsWith("/leaderboard") ? "text-primary" : "text-text-main"
                            }`}
                    >
                        <Trophy size={16} />
                        Liderlik
                    </Link>
                    <button
                        onClick={handleShare}
                        className="text-sm font-bold text-text-main hover:text-primary transition-all flex items-center gap-1.5 cursor-pointer active:scale-95"
                    >
                        {isCopied ? (
                            <span className="text-green-500 animate-in fade-in zoom-in duration-300">Kopyalandı!</span>
                        ) : (
                            <>
                                <Share2 size={14} />
                                Siteyi Paylaş
                            </>
                        )}
                    </button>
                </div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-2 sm:gap-4">
                        <ThemeToggle />
                        <AvatarMenu />
                    </div>
                ) : (
                    <div className="flex items-center gap-2 sm:gap-3">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="flex flex-shrink-0 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-[0.5px] border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary hover:text-text-main dark:text-text-secondary dark:hover:text-white group"
                            aria-label="Giriş / Kayıt Ol"
                        >
                            <User className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px] group-hover:scale-110 transition-transform" />
                        </Link>
                    </div>
                )}
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="absolute top-16 left-0 w-full bg-bg border-b border-surface-mid shadow-lg md:hidden flex flex-col p-4 gap-4 z-40 animate-in slide-in-from-top-2">
                    <Link
                        href="/"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base font-bold flex items-center gap-2 transition-colors hover:text-primary ${pathname === "/" ? "text-primary" : "text-text-main"}`}
                    >
                        <Home size={18} />
                        Ana Sayfa
                    </Link>
                    <Link
                        href="/nasil-oynanir"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base font-bold flex items-center gap-2 transition-colors hover:text-primary ${pathname.startsWith("/nasil-oynanir") ? "text-primary" : "text-text-main"}`}
                    >
                        <HelpCircle size={18} />
                        Nasıl Oynanır?
                    </Link>
                    <Link
                        href="/ozellikler"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base font-bold flex items-center gap-2 transition-colors hover:text-primary ${pathname.startsWith("/ozellikler") ? "text-primary" : "text-text-main"}`}
                    >
                        <Star size={18} />
                        Özellikler
                    </Link>
                    <Link
                        href="/leaderboard"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={`text-base font-bold transition-colors hover:text-primary flex items-center gap-2 ${pathname.startsWith("/leaderboard") ? "text-primary" : "text-text-main"}`}
                    >
                        <Trophy size={18} />
                        Liderlik Tablosu
                    </Link>
                    <button
                        onClick={handleShare}
                        className="text-base font-bold text-text-main hover:text-primary transition-all flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                        {isCopied ? (
                            <span className="text-accent-emerald animate-in fade-in zoom-in duration-300">Kopyalandı!</span>
                        ) : (
                            <>
                                <Share2 size={16} />
                                Siteyi Paylaş
                            </>
                        )}
                    </button>
                </div>
            )}
        </nav>
    );
}
