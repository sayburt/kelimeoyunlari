"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";

export function ThemeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <div className="w-[68px] h-10" />; // Placeholder to avoid layout shift
    }

    const isDark = theme === "dark";

    return (
        <button
            onClick={() => setTheme(isDark ? "light" : "dark")}
            className="group relative flex items-center w-[68px] h-10 rounded-full p-1 bg-surface/30 hover:bg-surface/50 border-[0.5px] border-text-main/15 dark:border-white/10 hover:border-text-main/30 dark:hover:border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-inner shadow-text-main/5 dark:shadow-black/50"
            aria-label="Toggle theme"
        >
            <div className="absolute inset-0 flex justify-between items-center px-[10px] pointer-events-none">
                <Sun className={`w-4 h-4 text-text-secondary/50 transition-colors duration-300 ${!isDark && "text-transparent"}`} />
                <Moon className={`w-4 h-4 text-text-secondary/50 transition-colors duration-300 ${isDark && "text-transparent"}`} />
            </div>

            <motion.div
                initial={false}
                animate={{
                    x: isDark ? 28 : 0,
                }}
                transition={{
                    type: "spring",
                    stiffness: 700,
                    damping: 30,
                }}
                className={`z-10 flex items-center justify-center w-8 h-8 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] ${isDark
                    ? "bg-surface-mid text-primary border border-surface/50"
                    : "bg-white text-orange-500 border border-stone-200"
                    }`}
            >
                {isDark ? <Moon className="w-[14px] h-[14px]" /> : <Sun className="w-[14px] h-[14px]" />}
            </motion.div>
        </button>
    );
}
