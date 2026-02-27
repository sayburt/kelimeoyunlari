import { GAMES } from "@/data/games";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Metadata } from "next";
import { JsonLd } from "@/components/seo/JsonLd";
import { buildArticleSchema, buildBreadcrumbSchema, buildHowToSchema } from "@/components/seo/schemaGenerator";

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const game = GAMES.find((g) => g.id === id);
    if (!game) return { title: "Oyun Bulunamadı" };

    return {
        title: `${game.title} Nasıl Oynanır? Kurallar ve Taktikler | Kelime Oyunları`,
        description: `Ücretsiz Türkçe ${game.title} oyunu hakkında her şey: Tarihçesi, kuralları ve kazanma taktikleri. Öğrenin ve oynamaya başlayın.`,
        openGraph: {
            images: [{ url: game.thumbnail }],
        },
    };
}

export default async function GameHowToPage({ params }: Props) {
    const { id } = await params;
    const game = GAMES.find((g) => g.id === id);

    if (!game) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-bg hero-glow">
            <JsonLd data={[
                buildArticleSchema({
                    headline: `${game.title} Nasıl Oynanır? Kurallar ve Taktikler`,
                    description: `Ücretsiz Türkçe ${game.title} oyunu hakkında her şey: Tarihçesi, kuralları ve kazanma taktikleri. Öğrenin ve oynamaya başlayın.`,
                    image: `https://www.kelimeoyunlari.tr${game.thumbnail}`,
                    url: `https://www.kelimeoyunlari.tr/nasil-oynanir/${game.id}`
                }),
                buildHowToSchema(
                    `${game.title} Nasıl Oynanır?`,
                    game.instructions.basic,
                    game.instructions.rules.map((rule, idx) => ({
                        text: rule,
                        url: `https://www.kelimeoyunlari.tr/nasil-oynanir/${game.id}#step${idx + 1}`
                    }))
                ),
                buildBreadcrumbSchema([
                    { name: 'Anasayfa', item: '/' },
                    { name: 'Nasıl Oynanır', item: '/nasil-oynanir' },
                    { name: `${game.title} Nasıl Oynanır?`, item: `/nasil-oynanir/${game.id}` }
                ])
            ]} />
            {/* Hero Section */}
            <header className="relative h-[50vh] min-h-[400px] w-full bg-surface/20 flex items-end overflow-hidden">
                <Image
                    src={game.thumbnail}
                    alt={game.title}
                    fill
                    className="object-cover opacity-20 blur-sm scale-110"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-bg via-bg/80 to-transparent" />

                <div className="relative z-10 max-w-4xl mx-auto w-full px-6 pb-12">
                    <Link
                        href="/nasil-oynanir"
                        className="text-primary text-sm font-black mb-4 inline-block hover:underline"
                    >
                        ← GERİ DÖN
                    </Link>
                    <h1 className="text-5xl md:text-7xl font-black text-text-main tracking-tighter mb-4">
                        {game.title.toUpperCase()}
                    </h1>
                    <p className="text-xl text-text-muted max-w-2xl font-medium tracking-tight">
                        {game.description}
                    </p>
                </div>
            </header>

            {/* Content Section */}
            <article className="max-w-4xl mx-auto px-6 py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Main Text */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* History */}
                        <section>
                            <h2 className="text-2xl font-black text-text-main mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                TARİHÇE
                            </h2>
                            <p className="text-text-muted leading-relaxed text-lg">
                                {game.blogContent?.history || "Bu oyunun tarihçesi çok yakında eklenecektir."}
                            </p>
                        </section>

                        {/* How to Play Detail */}
                        <section>
                            <h2 className="text-2xl font-black text-text-main mb-6 flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full" />
                                ADIM ADIM KURALLAR
                            </h2>
                            <ul className="space-y-4 mb-12">
                                {game.instructions.rules.map((rule, idx) => (
                                    <li key={idx} className="flex items-start gap-4 text-text-muted text-lg">
                                        <span className="flex-shrink-0 w-8 h-8 rounded-full bg-surface font-black text-primary flex items-center justify-center text-sm border border-surface-active">
                                            {idx + 1}
                                        </span>
                                        <span className="mt-1">{rule}</span>
                                    </li>
                                ))}
                            </ul>

                            {game.instructions.examples && game.instructions.examples.length > 0 && (
                                <div className="space-y-8 mt-16 p-8 rounded-3xl bg-surface/5 border border-surface/10">
                                    <h3 className="text-xl font-black text-text-main mb-8 tracking-tight">ÖRNEK TAHMİNLER</h3>
                                    <div className="space-y-10">
                                        {game.instructions.examples.map((example, idx) => (
                                            <div key={idx} className="space-y-4">
                                                <div className="flex gap-2">
                                                    {example.word.split('').map((char, charIdx) => {
                                                        const color = example.colors[charIdx];
                                                        let bgClass = 'bg-surface border-surface-active';
                                                        if (color === 'correct') bgClass = 'bg-correct border-correct text-white';
                                                        else if (color === 'present') bgClass = 'bg-present border-present text-white';
                                                        else if (color === 'absent') bgClass = 'bg-absent border-absent text-white';

                                                        return (
                                                            <div
                                                                key={charIdx}
                                                                className={`w-12 h-12 flex items-center justify-center rounded-xl font-black text-xl border-2 transition-transform hover:scale-105 ${bgClass}`}
                                                            >
                                                                {char}
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                                <p className="text-text-muted font-medium bg-surface/20 p-4 rounded-2xl border border-surface/10">
                                                    <span className="text-primary font-black mr-2">➜</span>
                                                    {example.description}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </section>

                        {/* Challenge Section */}
                        {game.instructions.challenge && (
                            <section>
                                <h2 className="text-2xl font-black text-text-main mb-6 flex items-center gap-3">
                                    <span className="w-8 h-1 bg-primary rounded-full" />
                                    MEYDAN OKUMA <span className="text-primary italic ml-2">⚔️</span>
                                </h2>
                                <div className="p-8 rounded-3xl bg-surface/5 border border-surface/10 space-y-6">
                                    <p className="text-text-muted leading-relaxed text-lg">
                                        {game.instructions.challenge.description}
                                    </p>
                                    <ul className="space-y-4">
                                        {game.instructions.challenge.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-start gap-3 text-text-muted">
                                                <span className="text-primary font-black mt-1">✨</span>
                                                <span className="leading-relaxed">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </section>
                        )}
                    </div>

                    {/* Sidebar / Tips */}
                    <aside className="space-y-8">
                        {/* CTA Card */}
                        <div className="p-8 rounded-3xl bg-primary text-bg shadow-xl shadow-primary/20 relative overflow-hidden group">
                            <div className="relative z-10 text-center">
                                <h3 className="text-2xl font-black mb-4">HAZIR MISIN?</h3>
                                <Link
                                    href={game.href}
                                    className="block w-full py-4 bg-bg text-text-main rounded-2xl font-black text-lg hover:scale-105 transition-transform"
                                >
                                    HEMEN OYNA
                                </Link>
                            </div>
                            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-32 h-32 bg-bg/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                        </div>

                        {/* Pro Tips */}
                        <div className="p-8 rounded-3xl bg-surface/10 border border-surface/20">
                            <h3 className="text-xl font-black text-primary mb-6 italic">İPUÇLARI</h3>
                            <ul className="space-y-6">
                                {(game.blogContent?.proTips || ["Taktikler yakında burada olacak!"]).map((tip, idx) => (
                                    <li key={idx} className="text-sm text-text-muted leading-relaxed font-medium">
                                        ✨ {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Scoring System */}
                        {game.instructions.scoring && (
                            <div className="p-8 rounded-3xl bg-surface/10 border border-surface/20">
                                <h3 className="text-xl font-black text-text-main mb-6 flex items-center gap-2">
                                    <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary text-sm">🏆</span>
                                    PUANLAMA
                                </h3>
                                <div className="space-y-4">
                                    <p className="text-xs text-text-muted leading-relaxed font-medium">
                                        {game.instructions.scoring.description}
                                    </p>
                                    <div className="space-y-2">
                                        {game.instructions.scoring.points.map((item, idx) => (
                                            <div key={idx} className="flex justify-between items-center p-3 rounded-xl bg-surface/20 border border-surface/10">
                                                <span className="text-xs font-bold text-text-muted uppercase tracking-wider">{item.condition}</span>
                                                <span className="text-sm font-black text-primary">{item.value}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </aside>
                </div>
            </article >
        </main >
    );
}
