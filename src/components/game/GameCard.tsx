import React from 'react';

export interface GameCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    onClick?: () => void;
    comingSoon?: boolean;
}

export function GameCard({
    title,
    description,
    icon,
    onClick,
    comingSoon = false,
}: GameCardProps) {
    return (
        <div
            onClick={!comingSoon ? onClick : undefined}
            className={`relative overflow-hidden rounded-2xl bg-slate-800 border-2 border-slate-700 p-6 flex flex-col items-center text-center transition-all duration-200
        ${comingSoon
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:border-cyan-400/50 hover:bg-slate-800 hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-cyan-400/10'
                }
      `}
        >
            <div className="bg-slate-900/50 p-4 rounded-full mb-4 text-cyan-400">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-200 mb-2">{title}</h3>
            <p className="text-sm text-slate-400">{description}</p>

            {comingSoon && (
                <div className="absolute top-4 -right-8 bg-slate-700 text-[10px] uppercase tracking-wider font-bold px-10 py-1 rotate-45 text-slate-300 shadow-md">
                    Yakında
                </div>
            )}
        </div>
    );
}
