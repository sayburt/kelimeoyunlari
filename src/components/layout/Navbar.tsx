"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { AvatarMenu } from "@/components/ui/AvatarMenu";

export default function Navbar() {
    const { isAuthenticated } = useAuth();
    const pathname = usePathname();

    // Auth sayfalarında Navbar'ı gizleyebiliriz veya farklı gösterebiliriz
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isAuthPage) return null;

    return (
        <nav className="h-16 flex items-center justify-between px-6 bg-surface/10 backdrop-blur-md border-b border-surface/20 sticky top-0 z-50">
            <Link href="/" className="text-2xl font-black text-text-main tracking-tighter">
                <span className="text-primary">KELİME</span> oyunları
            </Link>

            <div className="flex items-center gap-6">
                <div className="hidden md:flex items-center gap-6 mr-4">
                    <Link
                        href="/nasil-oynanir"
                        className={`text-sm font-bold transition-colors hover:text-primary ${pathname.startsWith("/nasil-oynanir") ? "text-primary" : "text-text-main"
                            }`}
                    >
                        Nasıl Oynanır?
                    </Link>
                </div>
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <ThemeToggle />
                        <AvatarMenu />
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <ThemeToggle />
                        <Link
                            href="/login"
                            className="text-sm font-bold text-text-main hover:text-primary transition-colors"
                        >
                            Giriş
                        </Link>
                        <Link
                            href="/register"
                            className="px-4 py-2 text-xs font-black bg-primary text-bg rounded-full hover:scale-105 transition-transform shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                        >
                            Kayıt Ol
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    );
}
