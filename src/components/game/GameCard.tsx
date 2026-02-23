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
            className={`relative overflow-hidden rounded-2xl bg-surface border-2 border-surface-mid p-6 flex flex-col items-center text-center transition-all duration-200
        ${comingSoon
                    ? 'opacity-70 cursor-not-allowed'
                    : 'hover:border-primary/50 hover:bg-surface hover:-translate-y-1 cursor-pointer shadow-lg hover:shadow-primary/10'
                }
      `}
        >
            <div className="bg-bg/50 p-4 rounded-full mb-4 text-primary">
                {icon}
            </div>
            <h3 className="text-xl font-bold text-text-main mb-2">{title}</h3>
            <p className="text-sm text-text-secondary">{description}</p>

            {comingSoon && (
                <div className="absolute top-4 -right-8 bg-surface-mid text-[10px] uppercase tracking-wider font-bold px-10 py-1 rotate-45 text-text-secondary shadow-md">
                    Yakında
                </div>
            )}
        </div>
    );
}
