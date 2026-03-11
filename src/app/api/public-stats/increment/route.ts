import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { gameId } = body;

        if (!gameId || typeof gameId !== "string") {
            return NextResponse.json({ error: "Invalid gameId" }, { status: 400 });
        }

        const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
        // Use service role key to bypass RLS and perform increments securely from backend
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

        if (!url || !serviceKey) {
            console.error("Missing Supabase credentials for anonymous increment.");
            return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
        }

        const supabase = createClient(url, serviceKey, {
            auth: {
                persistSession: false,
                autoRefreshToken: false,
            },
        });

        // Call the secure backend RPC directly
        const { error } = await supabase.rpc("increment_anonymous_play", {
            req_game_id: gameId
        });

        if (error) {
            console.error("Supabase RPC error:", error);
            return NextResponse.json({ error: "Database error" }, { status: 500 });
        }

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Failed to increment public stats:", err);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
