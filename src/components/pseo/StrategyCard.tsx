import type { StrategyTip } from '@/lib/pseo/contentTemplates';

interface StrategyCardProps {
    tips: StrategyTip[];
    gameName: string;
}

export function StrategyCard({ tips, gameName }: StrategyCardProps) {
    if (tips.length === 0) return null;

    return (
        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/20">
            <h2 className="text-lg font-black text-text-main mb-5 flex items-center gap-3">
                <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">
                    *
                </span>
                {gameName} Strateji Ipuclari
            </h2>
            <div className="space-y-4">
                {tips.map((tip, idx) => (
                    <div key={idx} className="space-y-1.5">
                        <h3 className="text-sm font-black text-primary">
                            {tip.title}
                        </h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            {tip.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
