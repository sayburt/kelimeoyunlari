import { supabase } from "@/lib/supabase";

export interface GamePlayCount {
    game_id: string;
    play_count: number;
}

export const statsService = {
    /**
     * Tüm oyunların toplam oynanma sayılarını döner.
     * Sadece kayıtlı kullanıcıların verilerini game_stats tablosundan toplar.
     */
    async getGlobalPlayCounts(): Promise<Record<string, number>> {
        try {
            const { data, error } = await supabase
                .from('global_game_stats')
                .select('game_id, total_plays');

            if (error) throw error;

            const counts: Record<string, number> = {};

            data?.forEach(row => {
                counts[row.game_id] = Number(row.total_plays || 0);
            });

            return counts;
        } catch (error) {
            console.error("Global oynanma sayıları alınırken hata:", error);
            return {};
        }
    }
};
