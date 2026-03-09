import React from "react";
import { Trophy, Loader2 } from "lucide-react";
import { LeaderboardEntry, LeaderboardPeriod } from "@/services/leaderboardService";

type LeaderboardTabProps = {
    data: LeaderboardEntry[];
    loading: boolean;
    currentUserId?: string;
    period: LeaderboardPeriod;
    onPeriodChange: (period: LeaderboardPeriod) => void;
};

export function LeaderboardTab({
    data,
    loading,
    currentUserId,
    period,
    onPeriodChange,
}: LeaderboardTabProps) {
    const periodTabs: { id: LeaderboardPeriod; label: string }[] = [
        { id: "weekly", label: "Haftalık" },
        { id: "all_time", label: "Tüm Zamanlar" },
    ];

    const scoreLabel = period === "weekly" ? "Haftalık Puan" : "En Yüksek Puan";

    if (loading) {
        return (
            <div>
                <div className="flex items-center justify-center py-16">
                    <Loader2 size={28} className="animate-spin text-primary" />
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            <div className="flex bg-bg/50 p-1 rounded-xl border border-surface-mid">
                {periodTabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onPeriodChange(tab.id)}
                        className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors ${period === tab.id
                            ? "bg-surface text-primary"
                            : "text-text-secondary hover:text-text-main"
                            }`}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="flex items-center justify-between px-1">
                <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">Oyuncular</p>
                <p className="text-[10px] uppercase tracking-wider text-text-secondary font-bold">{scoreLabel}</p>
            </div>

            {data.length === 0 ? (
                <div className="text-center py-12">
                    <Trophy size={36} className="text-text-secondary mx-auto mb-3 opacity-30" />
                    <p className="text-text-secondary text-sm">Henüz skor kaydedilmemiş.</p>
                    <p className="text-text-muted text-xs mt-1">İlk sen ol!</p>
                </div>
            ) : (
                <LeaderboardRows data={data} currentUserId={currentUserId} />
            )}
        </div>
    );
}

function LeaderboardRows({ data, currentUserId }: { data: LeaderboardEntry[]; currentUserId?: string }) {
    const medalEmojis = ["🥇", "🥈", "🥉"];

    return (
        <div className="space-y-1.5">
            {data.map((entry, idx) => {
                const isCurrentUser = currentUserId && entry.user_id === currentUserId;
                return (
                    <div
                        key={entry.user_id}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${isCurrentUser
                            ? "bg-primary/10 border border-primary/25"
                            : "bg-bg/40 hover:bg-bg/70"
                            }`}
                    >
                        <span className="w-7 text-center shrink-0">
                            {idx < 3 ? (
                                <span className="text-lg">{medalEmojis[idx]}</span>
                            ) : (
                                <span className="text-sm font-bold text-text-secondary">{idx + 1}</span>
                            )}
                        </span>

                        <div className="w-8 h-8 rounded-full bg-surface-mid flex items-center justify-center shrink-0 text-base">
                            {entry.avatar || "👤"}
                        </div>

                        <span className={`flex-1 text-sm font-semibold truncate ${isCurrentUser ? "text-primary" : "text-text-main"}`}>
                            {entry.username || "Anonim"}
                            {isCurrentUser && <span className="text-xs ml-1 opacity-60">(sen)</span>}
                        </span>

                        <span className={`text-sm font-black tabular-nums ${isCurrentUser ? "text-primary" : "text-text-main"}`}>
                            {entry.value.toLocaleString("tr-TR")}
                        </span>
                    </div>
                );
            })}
        </div>
    );
}
