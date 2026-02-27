import { supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

export const likeService = {
    /**
     * Tüm oyunların toplam beğeni sayılarını döner.
     */
    async getGlobalLikeCounts(): Promise<Record<string, number>> {
        try {
            const { data, error } = await supabase
                .from('global_game_likes')
                .select('game_name, total_likes');

            if (error) throw error;

            const counts: Record<string, number> = {};

            data?.forEach(row => {
                counts[row.game_name] = Number(row.total_likes || 0);
            });

            return counts;
        } catch (error) {
            console.error("Global beğeni sayıları alınırken hata:", error);
            return {};
        }
    },

    /**
     * Kullanıcının beğendiği oyunların id'lerini (game_name) döner.
     */
    async getUserLikes(userId?: string): Promise<string[]> {
        if (userId) {
            try {
                const { data, error } = await supabase
                    .from('game_likes')
                    .select('game_name')
                    .eq('user_id', userId);

                if (error) throw error;
                return data?.map(row => row.game_name) || [];
            } catch (error) {
                console.error("Kullanıcı beğenileri alınırken hata:", error);
                return storage.getGuestLikes();
            }
        } else {
            return storage.getGuestLikes();
        }
    },

    /**
     * Bir oyunu beğen/beğenmekten vazgeç işlemini yapar.
     * Güncel beğeni durumunu (true = beğenildi, false = beğenilmedi) döner.
     */
    async toggleLike(gameId: string, userId?: string): Promise<{ isLiked: boolean; error?: unknown }> {
        if (userId) {
            try {
                // Önce var mı kontrol et
                const { data: existing } = await supabase
                    .from('game_likes')
                    .select('id')
                    .eq('user_id', userId)
                    .eq('game_name', gameId)
                    .maybeSingle();

                if (existing) {
                    // Varsa sil (unlike)
                    const { error } = await supabase
                        .from('game_likes')
                        .delete()
                        .eq('user_id', userId)
                        .eq('game_name', gameId);

                    if (error) throw error;
                    return { isLiked: false };
                } else {
                    // Yoksa ekle (like)
                    const { error } = await supabase
                        .from('game_likes')
                        .insert({
                            user_id: userId,
                            session_id: storage.getSessionId(),
                            game_name: gameId
                        });

                    if (error) throw error;
                    return { isLiked: true };
                }
            } catch (error) {
                console.error("Beğeni işlemi sırasında hata:", error);
                return { isLiked: false, error };
            }
        } else {
            // Misafir modunda
            const isLiked = storage.toggleGuestLike(gameId);

            // Supabase'e misafir beğeni işlemini senkronize etmeyi deneyelim
            try {
                const sessionId = storage.getSessionId();
                if (isLiked) {
                    await supabase.from('game_likes').insert({
                        session_id: sessionId,
                        game_name: gameId
                    });
                } else {
                    await supabase.from('game_likes').delete()
                        .is('user_id', null)
                        .eq('session_id', sessionId)
                        .eq('game_name', gameId);
                }
            } catch (error) {
                console.error("Misafir beğenisi Supabase ile senkronize edilemedi:", error);
                // Locale yazdığımız için hatayı yoksayabiliriz.
            }

            return { isLiked };
        }
    }
};
