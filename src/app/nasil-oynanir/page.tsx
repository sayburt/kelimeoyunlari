"use client";

import { GAMES } from "@/data/games";
import Link from "next/link";
import Image from "next/image";
import { useState, useMemo } from "react";
import { Search } from "lucide-react";

export default function HowToPlayPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const activeGames = useMemo(() => {
        const games = GAMES.filter(game => !game.comingSoon);
        if (!searchQuery.trim()) return games;

        const query = searchQuery.toLowerCase();
        return games.filter(game =>
            game.title.toLowerCase().includes(query) ||
            game.description.toLowerCase().includes(query)
        );
    }, [searchQuery]);

    return (
        <main className="min-h-screen bg-bg py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <header className="mb-12 text-center">
                    <h1 className="text-4xl md:text-6xl font-black text-text-main mb-4 tracking-tighter">
                        NASIL <span className="text-primary italic">OYNANIR?</span>
                    </h1>
                    <p className="text-text-muted text-lg max-w-2xl mx-auto">
                        Oyunların kurallarını öğrenin, tarihçelerini keşfedin ve
                        uzmanlardan galibiyet taktikleri alın.
                    </p>
                </header>

                {/* Arama Bölümü */}
                <div className="max-w-xl mx-auto mb-20 relative group">
                    <div className="absolute inset-x-0 -top-10 -bottom-10 bg-primary/10 blur-[100px] rounded-full opacity-50 transition-opacity group-focus-within:opacity-100" />
                    <div className="relative flex items-center bg-surface/40 backdrop-blur-2xl border-2 border-surface/30 rounded-3xl px-8 py-5 focus-within:border-primary/60 focus-within:bg-surface/60 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-focus-within:shadow-primary/20">
                        <Search className="w-6 h-6 text-primary mr-5 transition-transform group-focus-within:scale-110" />
                        <input
                            type="text"
                            placeholder="Bir oyun ismi yazın..."
                            className="w-full bg-transparent border-none outline-none text-text-main placeholder:text-text-main/30 font-bold text-xl"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        {searchQuery && (
                            <button
                                onClick={() => setSearchQuery("")}
                                className="ml-4 px-3 py-1 bg-surface/80 hover:bg-primary hover:text-bg rounded-lg text-text-muted transition-all text-[10px] font-black uppercase tracking-widest border border-surface/20"
                            >
                                SIFIRLA
                            </button>
                        )}
                    </div>
                </div>

                {activeGames.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {activeGames.map((game) => (
                            <div key={game.id} className="flex flex-col gap-4 group">
                                <Link
                                    href={`/nasil-oynanir/${game.id}`}
                                    className="relative aspect-video overflow-hidden rounded-2xl bg-surface/5 border border-surface/20 transition-all group-hover:scale-[1.02] group-hover:shadow-2xl group-hover:shadow-primary/10"
                                >
                                    <Image
                                        src={game.thumbnail}
                                        alt={game.title}
                                        fill
                                        className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg/20 via-transparent to-transparent opacity-60 transition-opacity" />


                                </Link>
                                <div className="px-1">
                                    <h2 className="text-lg font-black text-text-main tracking-tight group-hover:text-primary transition-colors">
                                        {game.title} Nasıl Oynanır ?
                                    </h2>
                                    <div className="h-0.5 w-0 group-hover:w-full bg-primary transition-all duration-500 rounded-full mt-1.5" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="py-20 text-center">
                        <p className="text-2xl font-black text-text-main/40 italic">Aradığınız oyun bulunamadı...</p>
                    </div>
                )}


            </div>
        </main>
    );
}
