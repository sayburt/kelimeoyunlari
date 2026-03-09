import { useCallback, useEffect, useState } from "react";
import { likeService } from "@/services/likeService";

type UseGameLikesParams = {
    userId?: string;
    authLoading: boolean;
    applyLikeDelta: (gameId: string, delta: number) => void;
};

export function useGameLikes({ userId, authLoading, applyLikeDelta }: UseGameLikesParams) {
    const [userLikes, setUserLikes] = useState<string[]>([]);

    useEffect(() => {
        if (authLoading) {
            return;
        }

        let isMounted = true;

        async function fetchUserLikes() {
            const likes = await likeService.getUserLikes(userId);
            if (isMounted) {
                setUserLikes(likes);
            }
        }

        void fetchUserLikes();

        return () => {
            isMounted = false;
        };
    }, [userId, authLoading]);

    const toggleLike = useCallback(async (gameId: string) => {
        if (authLoading) {
            return;
        }

        const isCurrentlyLiked = userLikes.includes(gameId);

        setUserLikes((prev) => (
            isCurrentlyLiked ? prev.filter((id) => id !== gameId) : [...prev, gameId]
        ));
        applyLikeDelta(gameId, isCurrentlyLiked ? -1 : 1);

        const { isLiked, error } = await likeService.toggleLike(gameId, userId);

        if (error || isLiked === isCurrentlyLiked) {
            setUserLikes((prev) => {
                const hasLike = prev.includes(gameId);

                if (isCurrentlyLiked) {
                    return hasLike ? prev : [...prev, gameId];
                }

                return prev.filter((id) => id !== gameId);
            });

            applyLikeDelta(gameId, isCurrentlyLiked ? 1 : -1);
        }
    }, [authLoading, userId, userLikes, applyLikeDelta]);

    return {
        userLikes,
        toggleLike,
    };
}
