"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut } from "lucide-react";

export function AvatarMenu() {
    const { user, signOut } = useAuth();
    const pathname = usePathname();
    const [isOpen, setIsOpen] = useState(false);

    // Get username from metadata, fallback to email prefix if not available
    const username = user?.user_metadata?.username || user?.email?.split("@")[0] || "Kullanıcı";
    const initial = username.charAt(0).toUpperCase();

    const closeMenu = () => setIsOpen(false);

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-tr from-primary to-primary/60 text-bg font-bold text-lg shadow-[0_0_10px_rgba(34,211,238,0.3)] hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
                {initial}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={closeMenu} />

                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: "easeOut" }}
                            className="absolute right-0 top-full mt-3 w-64 rounded-2xl bg-[var(--theme-card-glass)] backdrop-blur-xl border border-[var(--theme-glass-border)] p-2 z-50 flex flex-col gap-1"
                            style={{ boxShadow: "var(--theme-premium-shadow-hover)" }}
                        >
                            <div className="px-3 py-3 border-b border-surface/30 mb-1">
                                <p className="text-xs text-text-main/50 font-medium uppercase tracking-wider mb-1">Oturum Açık</p>
                                <p className="text-sm font-semibold text-text-main truncate">
                                    {username}
                                </p>
                            </div>

                            <Link
                                href="/profile"
                                onClick={closeMenu}
                                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${pathname === "/profile"
                                    ? "bg-primary/10 text-primary"
                                    : "text-text-main hover:bg-surface hover:text-primary"
                                    }`}
                            >
                                <User className="w-4 h-4" />
                                Profil ve İstatistikler
                            </Link>

                            <button
                                onClick={() => {
                                    closeMenu();
                                    signOut();
                                }}
                                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-wrong hover:bg-wrong/10 transition-all duration-200 w-full text-left mt-1"
                            >
                                <LogOut className="w-4 h-4" />
                                Çıkış Yap
                            </button>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
