"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";

export default function Navbar() {
    const { isAuthenticated, signOut } = useAuth();
    const pathname = usePathname();

    // Auth sayfalarında Navbar'ı gizleyebiliriz veya farklı gösterebiliriz
    const isAuthPage = pathname.startsWith("/login") || pathname.startsWith("/register");

    if (isAuthPage) return null;

    return (
        <nav className="h-16 flex items-center justify-between px-6 bg-surface/10 backdrop-blur-md border-b border-surface/20 sticky top-0 z-50">
            <Link href="/" className="text-2xl font-black text-text-main tracking-tighter">
                Kelime<span className="text-primary">.</span>
            </Link>

            <div className="flex items-center gap-6">
                {isAuthenticated ? (
                    <div className="flex items-center gap-4">
                        <Link
                            href="/profile"
                            className={`text-sm font-bold transition-colors ${pathname === "/profile" ? "text-primary" : "text-text-main hover:text-primary"
                                }`}
                        >
                            Profil
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="px-4 py-2 text-xs font-bold bg-surface text-wrong border border-wrong/30 rounded-full hover:bg-wrong hover:text-white transition-all"
                        >
                            Çıkış
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-3">
                        <Link
                            href="/profile"
                            className={`text-sm font-bold transition-colors ${pathname === "/profile" ? "text-primary" : "text-text-main hover:text-primary"
                                }`}
                        >
                            İstatistiklerim
                        </Link>
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
