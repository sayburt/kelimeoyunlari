import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type CountMap = Record<string, number>;

type PublicStatsPayload = {
    playCounts?: CountMap;
    likeCounts?: CountMap;
};

const EMPTY_STATS: { playCounts: CountMap; likeCounts: CountMap } = {
    playCounts: {},
    likeCounts: {},
};

function buildSupabaseClient() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !anon) {
        return null;
    }

    return createClient(url, anon, {
        auth: {
            persistSession: false,
            autoRefreshToken: false,
        },
    });
}

export async function GET() {
    const supabase = buildSupabaseClient();
    if (!supabase) {
        return NextResponse.json(EMPTY_STATS, {
            headers: {
                "Cache-Control": "no-store",
            },
        });
    }

    const { data, error } = await supabase.rpc("get_public_game_stats");
    const payload = !error && data && typeof data === "object"
        ? (data as PublicStatsPayload)
        : EMPTY_STATS;
    const playCounts = payload.playCounts ?? EMPTY_STATS.playCounts;
    const likeCounts = payload.likeCounts ?? EMPTY_STATS.likeCounts;

    return NextResponse.json(
        { playCounts, likeCounts },
        {
            headers: {
                "Cache-Control": "no-store",
            },
        },
    );
}
