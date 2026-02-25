import React from "react";

export interface StatCardProps {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
    highlight?: boolean;
}

export function StatCard({ label, value, icon, highlight = false }: StatCardProps) {
    return (
        <div
            className={`flex flex-col items-center justify-center rounded-2xl p-5 transition-all duration-200
                ${highlight
                    ? "bg-primary/10 backdrop-blur-md border border-primary/30 shadow-[0_0_20px_rgba(34,211,238,0.1)]"
                    : "bg-[var(--theme-card-glass)] backdrop-blur-md border border-[var(--theme-glass-border)] premium-shadow"
                }`}
        >
            {icon && (
                <div className={`mb-2 ${highlight ? "text-primary" : "text-text-secondary"}`}>
                    {icon}
                </div>
            )}
            <span className={`text-3xl font-black ${highlight ? "text-primary" : "text-text-main"}`}>
                {value}
            </span>
            <span className="text-xs font-bold text-text-secondary mt-1 uppercase tracking-wider">
                {label}
            </span>
        </div>
    );
}
