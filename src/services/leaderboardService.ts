import { supabase } from "@/lib/supabase";

export interface LeaderboardEntry {
    user_id: string;
    username: string | null;
    avatar: string | null;
    value: number; // total_score veya best_score
}

export type LeaderboardType = 'total_score' | 'total_wins' | 'best_streak';
export type LeaderboardCategory = 'normal' | 'challenge';

export const leaderboardService = {
    /**
     * Normal oyun liderlik tablosunu getirir.
     * `game_stats` + `profiles` tablosundan çeker.
     */
    async getNormalLeaderboard(
        type: LeaderboardType,
        limit = 20
    ): Promise<LeaderboardEntry[]> {
        let query;

        if (type === 'total_score') {
            query = supabase
                .from('profiles')
                .select('id, username, avatar, total_score')
                .order('total_score', { ascending: false })
                .gt('total_score', 0)
                .limit(limit);
        } else if (type === 'total_wins') {
            query = supabase
                .from('profiles')
                .select('id, username, avatar, total_wins')
                .order('total_wins', { ascending: false })
                .gt('total_wins', 0)
                .limit(limit);
        } else {
            // best_streak → game_stats tablosundan max_streak
            query = supabase
                .from('game_stats')
                .select('user_id, max_streak, profiles!inner(username, avatar)')
                .order('max_streak', { ascending: false })
                .gt('max_streak', 0)
                .limit(limit);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Liderlik tablosu hatası:', error);
            return [];
        }

        if (type === 'best_streak') {
            return (data ?? []).map((row: Record<string, unknown>) => {
                const profiles = row.profiles as Record<string, unknown> | null;
                return {
                    user_id: row.user_id as string,
                    username: (profiles?.username as string) ?? null,
                    avatar: (profiles?.avatar as string) ?? null,
                    value: row.max_streak as number,
                };
            });
        }

        return (data ?? []).map((row: Record<string, unknown>) => ({
            user_id: row.id as string,
            username: (row.username as string) ?? null,
            avatar: (row.avatar as string) ?? null,
            value: (type === 'total_score'
                ? row.total_score
                : row.total_wins) as number,
        }));
    },

    /**
     * Meydan okuma liderlik tablosunu getirir.
     * `challenge_stats` + `profiles` tablosundan çeker.
     */
    async getChallengeLeaderboard(
        limit = 20
    ): Promise<LeaderboardEntry[]> {
        const { data, error } = await supabase
            .from('challenge_stats')
            .select('user_id, won_count, profiles!inner(username, avatar)')
            .order('won_count', { ascending: false })
            .gt('won_count', 0)
            .limit(limit);

        if (error) {
            console.error('Meydan okuma liderlik tablosu hatası:', error);
            return [];
        }

        return (data ?? []).map((row: Record<string, unknown>) => {
            const profiles = row.profiles as Record<string, unknown> | null;
            return {
                user_id: row.user_id as string,
                username: (profiles?.username as string) ?? null,
                avatar: (profiles?.avatar as string) ?? null,
                value: row.won_count as number,
            };
        });
    },

    /**
     * Belirli bir oyun için liderlik tablosunu getirir.
     * `game_stats` tablosundan `high_score` sıralı, `profiles` join'li.
     */
    async getGameLeaderboard(
        gameName: string,
        limit = 20
    ): Promise<LeaderboardEntry[]> {
        const { data, error } = await supabase
            .from('game_stats')
            .select('user_id, high_score, profiles!inner(username, avatar)')
            .eq('game_name', gameName)
            .order('high_score', { ascending: false })
            .gt('high_score', 0)
            .limit(limit);

        if (error) {
            console.error('Oyun liderlik tablosu hatası:', error);
            return [];
        }

        return (data ?? []).map((row: Record<string, unknown>) => {
            const profiles = row.profiles as Record<string, unknown> | null;
            return {
                user_id: row.user_id as string,
                username: (profiles?.username as string) ?? null,
                avatar: (profiles?.avatar as string) ?? null,
                value: row.high_score as number,
            };
        });
    },
};
