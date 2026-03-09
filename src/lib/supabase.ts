import { createClient } from "@supabase/supabase-js";

export const hasSupabaseEnv = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

let urlWarningLogged = false;
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || (() => {
    if (process.env.NODE_ENV === "development" && !urlWarningLogged) {
        console.warn("[supabase] Missing NEXT_PUBLIC_SUPABASE_URL, using local fallback.");
        urlWarningLogged = true;
    }
    return "http://127.0.0.1:54321";
})();

let keyWarningLogged = false;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || (() => {
    if (process.env.NODE_ENV === "development" && !keyWarningLogged) {
        console.warn("[supabase] Missing NEXT_PUBLIC_SUPABASE_ANON_KEY, using local fallback.");
        keyWarningLogged = true;
    }
    return "dev-anon-key";
})();

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
