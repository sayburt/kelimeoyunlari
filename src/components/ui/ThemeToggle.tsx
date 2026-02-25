"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-10 h-10" />; // Placeholder to avoid layout shift
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-black/5 hover:bg-black/10 dark:bg-white/5 dark:hover:bg-white/10 border-[0.5px] border-black/10 hover:border-black/20 dark:border-white/10 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary hover:text-text-main dark:text-text-secondary dark:hover:text-white"
            aria-label="Toggle theme"
        >
            {isDark ? <Moon className="w-[20px] h-[20px]" /> : <Sun className="w-[20px] h-[20px]" />}
        </button>
    );
}
