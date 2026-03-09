import { hasSupabaseEnv, supabase } from "@/lib/supabase";
import { storage } from "@/lib/storage";

type ToggleLikeResult = { isLiked: boolean; error?: unknown };

function normalizeGameId(gameId: string): string {
    if (gameId === "hangman") {
        return "adam-asmaca";
    }
    return gameId;
}

function getEquivalentGameIds(gameId: string): string[] {
    const normalized = normalizeGameId(gameId);
    if (normalized === "adam-asmaca") {
        return ["adam-asmaca", "hangman"];
    }
    return [normalized];
}

async function getAuthenticatedUserLikes(userId: string): Promise<string[]> {
    const { data, error } = await supabase
        .from("game_likes")
        .select("game_name")
        .eq("user_id", userId);

    if (error) {
        throw error;
    }

    return Array.from(new Set((data ?? []).map((row) => normalizeGameId(row.game_name))));
}

async function toggleAuthenticatedLike(
    normalizedGameId: string,
    equivalentGameIds: string[],
    userId: string,
): Promise<ToggleLikeResult> {
    const { data: existingRows, error: existingError } = await supabase
        .from("game_likes")
        .select("id")
        .eq("user_id", userId)
        .in("game_name", equivalentGameIds);

    if (existingError) {
        throw existingError;
    }

    if ((existingRows ?? []).length > 0) {
        const idsToDelete = (existingRows ?? []).map((row) => row.id);
        const { error } = await supabase
            .from("game_likes")
            .delete()
            .in("id", idsToDelete);

        if (error) {
            throw error;
        }

        return { isLiked: false };
    }

    const { error } = await supabase
        .from("game_likes")
        .insert({
            user_id: userId,
            session_id: storage.getSessionId(),
            game_name: normalizedGameId,
        });

    if (error) {
        throw error;
    }

    return { isLiked: true };
}

async function syncGuestLike(
    normalizedGameId: string,
    equivalentGameIds: string[],
    isLiked: boolean,
): Promise<void> {
    if (!hasSupabaseEnv) {
        return;
    }

    const sessionId = storage.getSessionId();

    if (isLiked) {
        await supabase.from("game_likes").insert({
            session_id: sessionId,
            game_name: normalizedGameId,
        });
        return;
    }

    await supabase.from("game_likes").delete()
        .is("user_id", null)
        .eq("session_id", sessionId)
        .in("game_name", equivalentGameIds);
}

export const likeService = {
    /**
     * Kullanıcının beğendiği oyunların id'lerini (game_name) döner.
     */
    async getUserLikes(userId?: string): Promise<string[]> {
        if (userId) {
            try {
                return await getAuthenticatedUserLikes(userId);
            } catch (error) {
                console.error("Kullanıcı beğenileri alınırken hata:", error);
                return storage.getGuestLikes();
            }
        }

        return storage.getGuestLikes();
    },

    /**
     * Bir oyunu beğen/beğenmekten vazgeç işlemini yapar.
     * Güncel beğeni durumunu (true = beğenildi, false = beğenilmedi) döner.
     */
    async toggleLike(gameId: string, userId?: string): Promise<{ isLiked: boolean; error?: unknown }> {
        const normalizedGameId = normalizeGameId(gameId);
        const equivalentGameIds = getEquivalentGameIds(normalizedGameId);

        if (userId) {
            if (!hasSupabaseEnv) {
                return { isLiked: storage.getGuestLikes().includes(normalizedGameId) };
            }

            try {
                return await toggleAuthenticatedLike(normalizedGameId, equivalentGameIds, userId);
            } catch (error) {
                console.error("Beğeni işlemi sırasında hata:", error);
                return { isLiked: false, error };
            }
        }

        const isLiked = storage.toggleGuestLike(normalizedGameId);

        try {
            await syncGuestLike(normalizedGameId, equivalentGameIds, isLiked);
        } catch (error) {
            if (process.env.NODE_ENV === "development") {
                console.error("Misafir beğenisi Supabase ile senkronize edilemedi:", error);
            }
        }

        return { isLiked };
    }
};
