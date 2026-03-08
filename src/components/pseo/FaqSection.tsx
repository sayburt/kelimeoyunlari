import type { FAQItem } from '@/lib/pseo/contentTemplates';

interface FaqSectionProps {
    items: FAQItem[];
}

export function FaqSection({ items }: FaqSectionProps) {
    if (items.length === 0) return null;

    return (
        <section>
            <h2 className="text-xl font-black text-text-main mb-4 flex items-center gap-3">
                <span className="w-8 h-1 bg-primary rounded-full" />
                Sik Sorulan Sorular
            </h2>
            <div className="space-y-4">
                {items.map((faq, idx) => (
                    <details
                        key={`${faq.question}-${idx}`}
                        className="group p-4 rounded-2xl bg-surface/10 border border-surface/20"
                    >
                        <summary className="cursor-pointer text-sm font-bold text-text-main list-none flex items-center justify-between">
                            {faq.question}
                            <span className="text-primary ml-2 group-open:rotate-180 transition-transform">v</span>
                        </summary>
                        <p className="mt-3 text-sm text-text-muted leading-relaxed">{faq.answer}</p>
                    </details>
                ))}
            </div>
        </section>
    );
}
