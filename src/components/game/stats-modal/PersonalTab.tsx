import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, Loader2, LogIn } from "lucide-react";
import { PersonalStats } from "./types";

type PersonalTabProps = {
    stats: PersonalStats | null;
    loading: boolean;
    isAuthenticated: boolean;
};

export function PersonalTab({ stats, loading, isAuthenticated }: PersonalTabProps) {
    if (loading) {
        return (
            <div className="flex items-center justify-center py-16">
                <Loader2 size={28} className="animate-spin text-primary" />
            </div>
        );
    }

    if (!stats) {
        return (
            <div className="text-center py-12">
                <Gamepad2 size={36} className="text-text-secondary mx-auto mb-3 opacity-30" />
                <p className="text-text-secondary text-sm mb-1">
                    Henüz bu oyunda bir istatistiğin yok.
                </p>
                <p className="text-text-muted text-xs">Bir oyun oyna, burada görünsün!</p>
            </div>
        );
    }

    const statItems = [
        { label: "Oynanan", value: stats.played, color: "text-text-main" },
        { label: "Kazanılan", value: stats.won, color: "text-correct" },
        { label: "Başarı", value: `%${stats.winRate}`, color: "text-primary" },
        { label: "Oyuna Özel En İyi", value: stats.bestScore > 0 ? stats.bestScore : "—", color: "text-text-main" },
        { label: "En Yüksek Puan", value: stats.highScore > 0 ? stats.highScore.toLocaleString("tr-TR") : "—", color: "text-primary" },
        { label: "Mevcut Seri", value: stats.currentStreak, color: "text-text-main" },
        { label: "En İyi Seri", value: stats.maxStreak, color: "text-primary" },
    ];

    return (
        <div className="space-y-4">
            <div>
                <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-bold text-text-secondary uppercase tracking-wider">Başarı Oranı</span>
                    <span className="text-sm font-black text-primary">%{stats.winRate}</span>
                </div>
                <div className="w-full h-2.5 bg-bg rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${stats.winRate}%` }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="h-full bg-gradient-to-r from-primary to-correct rounded-full"
                    />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
                {statItems.map((item) => (
                    <div
                        key={item.label}
                        className="bg-bg/50 rounded-xl px-3.5 py-3 text-center"
                    >
                        <p className={`text-xl font-black ${item.color}`}>{item.value}</p>
                        <p className="text-[10px] text-text-secondary uppercase tracking-wider font-bold mt-0.5">{item.label}</p>
                    </div>
                ))}
            </div>

            {!isAuthenticated && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 text-center">
                    <p className="text-text-secondary text-xs mb-3">
                        Giriş yap, istatistiklerin bulutta kayıt altına alınsın!
                    </p>
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-bold bg-primary text-bg rounded-full hover:scale-105 transition-transform"
                    >
                        <LogIn size={14} />
                        Giriş Yap
                    </Link>
                </div>
            )}
        </div>
    );
}
