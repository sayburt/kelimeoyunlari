import { useCallback, useEffect, useState } from "react";

type CountMap = Record<string, number>;

type PublicStatsResponse = {
    playCounts?: CountMap;
    likeCounts?: CountMap;
};

type PublicStatsState = {
    playCounts: CountMap;
    likeCounts: CountMap;
};

const INITIAL_STATS: PublicStatsState = {
    playCounts: {},
    likeCounts: {},
};

export function usePublicStats() {
    const [stats, setStats] = useState<PublicStatsState>(INITIAL_STATS);

    useEffect(() => {
        let isMounted = true;

        async function fetchStats() {
            try {
                const response = await fetch("/api/public-stats", { cache: "no-store" });
                if (!response.ok) {
                    return;
                }

                const data = (await response.json()) as PublicStatsResponse;
                if (!isMounted) {
                    return;
                }

                setStats({
                    playCounts: data.playCounts ?? {},
                    likeCounts: data.likeCounts ?? {},
                });
            } catch {
                // Varsayılan kart değerlerini kullanmaya devam et.
            }
        }

        void fetchStats();

        return () => {
            isMounted = false;
        };
    }, []);

    const applyLikeDelta = useCallback((gameId: string, delta: number) => {
        setStats((prev) => ({
            ...prev,
            likeCounts: {
                ...prev.likeCounts,
                [gameId]: Math.max(0, (prev.likeCounts[gameId] || 0) + delta),
            },
        }));
    }, []);

    return {
        playCounts: stats.playCounts,
        likeCounts: stats.likeCounts,
        applyLikeDelta,
    };
}
