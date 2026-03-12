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
        return <div className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0" />; // Placeholder to avoid layout shift
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="flex flex-shrink-0 items-center justify-center w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] hover:border-primary/30 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-secondary hover:text-text-main dark:text-text-secondary dark:hover:text-white premium-shadow"
            aria-label="Toggle theme"
        >
            {isDark ? <Moon className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" /> : <Sun className="w-[16px] h-[16px] sm:w-[20px] sm:h-[20px]" />}
        </button>
    );
}
