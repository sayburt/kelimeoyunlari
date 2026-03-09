import { supabase } from "@/lib/supabase";

export interface LeaderboardEntry {
    user_id: string;
    username: string | null;
    avatar: string | null;
    value: number;
}

export type LeaderboardPeriod = "weekly" | "all_time";

type ProfileJoin = {
    username?: string | null;
    avatar?: string | null;
} | {
    username?: string | null;
    avatar?: string | null;
}[] | null;

function extractProfile(joinedProfile: ProfileJoin): { username: string | null; avatar: string | null } {
    if (!joinedProfile) {
        return { username: null, avatar: null };
    }

    if (Array.isArray(joinedProfile)) {
        const first = joinedProfile[0];
        return {
            username: first?.username ?? null,
            avatar: first?.avatar ?? null,
        };
    }

    return {
        username: joinedProfile.username ?? null,
        avatar: joinedProfile.avatar ?? null,
    };
}

function getCurrentWeekStartISO(): string {
    const now = new Date();
    const day = now.getUTCDay();
    const diffToMonday = (day + 6) % 7;

    return new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate() - diffToMonday,
        0,
        0,
        0,
        0,
    )).toISOString();
}

export const leaderboardService = {
    /**
     * Belirli bir oyun için liderlik tablosunu getirir.
     * - weekly: game_score_events tablosunda mevcut hafta toplam puan
     * - all_time: game_stats tablosunda high_score
     */
    async getGameLeaderboard(
        gameName: string,
        period: LeaderboardPeriod = "all_time",
        limit = 20,
    ): Promise<LeaderboardEntry[]> {
        if (period === "all_time") {
            const { data, error } = await supabase
                .from("game_stats")
                .select("user_id, high_score, profiles!inner(username, avatar)")
                .eq("game_name", gameName)
                .order("high_score", { ascending: false })
                .gt("high_score", 0)
                .limit(limit);

            if (error) {
                console.error("All-time liderlik tablosu hatası:", error);
                return [];
            }

            return (data ?? []).map((row: Record<string, unknown>) => {
                const profile = extractProfile((row.profiles ?? null) as ProfileJoin);
                return {
                    user_id: row.user_id as string,
                    username: profile.username,
                    avatar: profile.avatar,
                    value: (row.high_score as number) ?? 0,
                };
            });
        }

        const weekStartISO = getCurrentWeekStartISO();
        const { data, error } = await supabase
            .from("game_score_events")
            .select("user_id, score, profiles!inner(username, avatar)")
            .eq("game_name", gameName)
            .gte("played_at", weekStartISO);

        if (error) {
            console.error("Haftalık liderlik tablosu hatası:", error);
            return [];
        }

        const aggregateByUser = new Map<string, LeaderboardEntry>();

        for (const row of data ?? []) {
            const profile = extractProfile((row.profiles ?? null) as ProfileJoin);
            const score = Number(row.score ?? 0);
            const userId = row.user_id as string;

            const existing = aggregateByUser.get(userId);
            if (existing) {
                existing.value += score;
                continue;
            }

            aggregateByUser.set(userId, {
                user_id: userId,
                username: profile.username,
                avatar: profile.avatar,
                value: score,
            });
        }

        return Array.from(aggregateByUser.values())
            .filter((entry) => entry.value > 0)
            .sort((a, b) => b.value - a.value)
            .slice(0, limit);
    },
};
