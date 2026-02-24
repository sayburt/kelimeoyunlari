import { supabase } from "@/lib/supabase";
import { storage, GuestStat } from "@/lib/storage";

export interface GameStat {
    game_name: string;
    played: number;
    won: number;
    best_score: number;
    current_streak: number;
    max_streak: number;
}

export interface ChallengeStat {
    game_name: string;
    sent_count: number;
    received_count: number;
    won_count: number;
    best_score: number;
    avg_score: number;
    last_played_at: string | null;
}

export interface Badge {
    badge_key: string;
    earned_at: string;
}

export interface ProfileData {
    username: string | null;
    createdAt: string | null;
    stats: GameStat[];
    challengeStats: ChallengeStat[];
    badges: Badge[];
    totalPlayed: number;
    totalWon: number;
    winRate: number;
    bestStreak: number;
    isGuest: boolean;
}

function computeAggregates(stats: GameStat[]): Pick<ProfileData, "totalPlayed" | "totalWon" | "winRate" | "bestStreak"> {
    const totalPlayed = stats.reduce((sum, s) => sum + s.played, 0);
    const totalWon = stats.reduce((sum, s) => sum + s.won, 0);
    const winRate = totalPlayed > 0 ? Math.round((totalWon / totalPlayed) * 100) : 0;
    const bestStreak = stats.reduce((max, s) => Math.max(max, s.max_streak), 0);
    return { totalPlayed, totalWon, winRate, bestStreak };
}

function mapGuestStats(guestStats: GuestStat[]): GameStat[] {
    return guestStats.map((s) => ({
        game_name: s.game_name,
        played: s.played,
        won: s.won,
        best_score: s.best_score,
        current_streak: s.current_streak,
        max_streak: s.max_streak,
    }));
}

export const profileService = {
    /**
     * Kullanıcı profil verisini döndürür.
     * Giriş yapmışsa Supabase'den, misafirse LocalStorage'dan çeker.
     */
    async getProfileData(userId?: string): Promise<ProfileData> {
        if (userId) {
            return this.getAuthenticatedProfile(userId);
        }
        return this.getGuestProfile();
    },

    getGuestProfile(): ProfileData {
        const guestStats = storage.getGuestStats();
        const stats = mapGuestStats(guestStats);
        const aggregates = computeAggregates(stats);

        return {
            username: null,
            createdAt: null,
            stats,
            challengeStats: [],
            badges: [],
            ...aggregates,
            isGuest: true,
        };
    },

    async getAuthenticatedProfile(userId: string): Promise<ProfileData> {
        try {
            // Profil, istatistikler, challenge istatistikleri ve rozetleri paralel çek
            const [profileRes, statsRes, challengeStatsRes, badgesRes] = await Promise.all([
                supabase.from("profiles").select("username, created_at").eq("id", userId).single(),
                supabase.from("game_stats").select("game_name, played, won, best_score, current_streak, max_streak").eq("user_id", userId),
                supabase.from("challenge_stats").select("game_name, sent_count, received_count, won_count, best_score, total_score, last_played_at").eq("user_id", userId),
                supabase.from("badges").select("badge_key, earned_at").eq("user_id", userId),
            ]);

            const profile = profileRes.data;
            const rawStats: GameStat[] = (statsRes.data ?? []).map((s) => ({
                game_name: s.game_name,
                played: s.played ?? 0,
                won: s.won ?? 0,
                best_score: s.best_score ?? 0,
                current_streak: s.current_streak ?? 0,
                max_streak: s.max_streak ?? 0,
            }));

            const rawChallengeStats: ChallengeStat[] = (challengeStatsRes.data ?? []).map((s) => ({
                game_name: s.game_name,
                sent_count: s.sent_count ?? 0,
                received_count: s.received_count ?? 0,
                won_count: s.won_count ?? 0,
                best_score: s.best_score ?? 0,
                avg_score: s.received_count > 0
                    ? Math.round((s.total_score ?? 0) / s.received_count)
                    : 0,
                last_played_at: s.last_played_at ?? null,
            }));

            const badges: Badge[] = (badgesRes.data ?? []).map((b) => ({
                badge_key: b.badge_key,
                earned_at: b.earned_at ?? "",
            }));

            const aggregates = computeAggregates(rawStats);

            return {
                username: profile?.username ?? null,
                createdAt: profile?.created_at ?? null,
                stats: rawStats,
                challengeStats: rawChallengeStats,
                badges,
                ...aggregates,
                isGuest: false,
            };
        } catch (error) {
            console.error("Profil verisi alınırken hata:", error);
            // Fallback: misafir profili döndür
            return this.getGuestProfile();
        }
    },
};
