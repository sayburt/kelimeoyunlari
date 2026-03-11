"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, BarChart3, Cloud, Users, Settings } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        id: "profil",
        title: "Bulut Kayıt & Üyelik Sistemi",
        description: "Misafir olarak da oynayabilirsiniz ancak ücretsiz üye olduğunuzda tüm ilerlemeniz güvenle bulutta saklanır. Avatarınızı seçin, cihazlar arası sorunsuz devam edin.",
        icon: <Cloud className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/profil.webp",
        color: "text-blue-400",
        bgLight: "bg-blue-400/10",
        bgDark: "bg-blue-900/20"
    },
    {
        id: "istatistikler",
        title: "Kapsamlı İstatistikler",
        description: "Gelişiminizi yakından takip edin. Her oyun için kazanma oranınız, ortalama süreniz, en iyi dereceniz, kullandığınız joker sayısı ve daha fazlası detaylı grafiklerle hizmetinizde.",
        icon: <BarChart3 className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/istatistikler.webp",
        color: "text-purple-400",
        bgLight: "bg-purple-400/10",
        bgDark: "bg-purple-900/20"
    },
    {
        id: "liderlik",
        title: "Global Liderlik Tablosu",
        description: "Tüm Türkiye ile yarışın! Oyun bazlı bağımsız liderlik tablolarında haftalık ve tüm zamanların sıralamasına girerek rekabetin tadını çıkarın.",
        icon: <Trophy className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/liderlik.webp",
        color: "text-yellow-400",
        bgLight: "bg-yellow-400/10",
        bgDark: "bg-yellow-900/20"
    },
    {
        id: "meydan-okuma",
        title: "Meydan Okuma Sistemi",
        description: "Yaptığınız iyi bir skoru veya kendi belirlediğiniz zorlu kelimeleri bir bağlantı (link) ile arkadaşınıza gönderin. Linke tıklayan arkadaşınız aynı şartlarda sizinle yarışır!",
        icon: <Users className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/meydan-okuma.webp",
        color: "text-green-400",
        bgLight: "bg-green-400/10",
        bgDark: "bg-green-900/20"
    },
    {
        id: "ayarlar",
        title: "Gelişmiş Oyun Ayarları",
        description: "Oyunu kendinize göre kişiselleştirin. 12 farklı kategoride konu seçin, 'Kolay/Orta/Zor' zorluk seviyelerini ayarlayın, ses ve tema (koyu/açık) tercihlerinizi yönetin.",
        icon: <Settings className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/ayarlar.webp",
        color: "text-cyan-400",
        bgLight: "bg-cyan-400/10",
        bgDark: "bg-cyan-900/20"
    },
    {
        id: "oyun-cesitliligi",
        title: "Zengin Oyun Seçenekleri",
        description: "Wordle, Adam Asmaca, Kelime Arama, Boggle ve çok daha fazlası... Sürekli genişleyen oyun yelpazesi ile kelime bilginizi farklı formatlarda test edin.",
        icon: <Gamepad2 className="w-6 h-6 sm:w-8 sm:h-8" />,
        image: "/features/ayarlar.webp", // Will use equivalent placeholders initially
        color: "text-rose-400",
        bgLight: "bg-rose-400/10",
        bgDark: "bg-rose-900/20"
    }
];

export default function OzelliklerPage() {
    return (
        <div className="min-h-[100dvh] bg-bg font-sans selection:bg-primary/30 selection:text-primary pb-20 overflow-x-hidden">
            {/* Hero Section */}
            <section className="relative pt-32 pb-16 md:pt-40 md:pb-24 px-6 md:px-12 flex flex-col items-center justify-center text-center">
                {/* Background Glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] md:w-[600px] md:h-[600px] bg-primary/20 blur-[100px] rounded-full pointer-events-none -z-10 opacity-70"></div>
                
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="max-w-3xl"
                >
                    <h1 className="text-4xl md:text-5xl lg:text-7xl font-black text-text-main tracking-tighter uppercase mb-6 drop-shadow-sm">
                        Kelime Oyunları <span className="text-primary italic">Özellikleri</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary font-medium tracking-wide leading-relaxed max-w-2xl mx-auto">
                        Sıradan bir kelime testinden çok daha fazlası. <br className="hidden md:block" /> 
                        Türkiye&apos;nin en gelişmiş kelime platformunda sizi neler bekliyor?
                    </p>
                </motion.div>
            </section>

            {/* Features List */}
            <section className="px-6 md:px-12 max-w-7xl mx-auto space-y-24 md:space-y-36">
                {features.map((feature, index) => {
                    const isEven = index % 2 === 0;
                    
                    return (
                        <motion.div 
                            key={feature.id}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.7 }}
                            className={`flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-10 md:gap-16 lg:gap-24`}
                        >
                            {/* Text Content */}
                            <div className="w-full md:w-1/2 space-y-6">
                                <div className={`inline-flex p-4 rounded-3xl ${feature.bgLight} dark:${feature.bgDark} ${feature.color} shadow-sm border border-black/5 dark:border-white/5`}>
                                    {feature.icon}
                                </div>
                                <h2 className="text-3xl md:text-4xl font-black text-text-main tracking-tight">
                                    {feature.title}
                                </h2>
                                <p className="text-lg text-text-secondary leading-relaxed font-medium">
                                    {feature.description}
                                </p>
                            </div>

                            {/* Image Placeholder / Visual */}
                            <div className="w-full md:w-1/2">
                                <motion.div 
                                    whileHover={{ y: -5 }}
                                    transition={{ duration: 0.3 }}
                                    className="relative w-full aspect-video md:aspect-[4/3] rounded-[2rem] overflow-hidden glass-surface shadow-2xl shadow-black/10 dark:shadow-black/40 border border-[var(--theme-glass-border)] bg-surface-hover/30 p-2 sm:p-4"
                                >
                                    <div className="w-full h-full rounded-2xl md:rounded-[1.5rem] bg-surface-mid/80 flex flex-col items-center justify-center overflow-hidden relative group">
                                        <div className={`absolute inset-0 bg-gradient-to-br from-transparent to-${feature.color.split('-')[1]}-500/10 mix-blend-overlay`}></div>
                                        
                                        {/* Fallback pattern / Placeholder for screenshots */}
                                        <div className="text-center p-6 z-10">
                                            <div className={`w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full ${feature.bgLight} dark:${feature.bgDark} flex items-center justify-center mb-4 border border-white/10 shadow-lg`}>
                                                <div className={`scale-150 sm:scale-[2] ${feature.color}`}>
                                                    {feature.icon}
                                                </div>
                                            </div>
                                            <p className="text-text-muted text-sm font-bold uppercase tracking-widest mt-4 opacity-50">
                                                Görsel Çok Yakında
                                            </p>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    );
                })}
            </section>

            {/* CTA Section */}
            <section className="mt-32 px-6">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto rounded-[3rem] glass-surface p-10 md:p-16 text-center shadow-2xl border border-[var(--theme-glass-border)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                    <h2 className="text-3xl md:text-5xl font-black text-text-main mb-6 tracking-tight relative z-10">
                        Şimdi Rekabete Katılın
                    </h2>
                    <p className="text-text-secondary text-lg mb-10 max-w-xl mx-auto font-medium relative z-10">
                        Hemen üye olun, kelime dağarcığınızı geliştirirken liderlik tablosundaki yerinizi alın.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                        <Link href="/register" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-primary text-bg font-black uppercase text-sm tracking-[0.2em] shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all">
                            ÜCRETSİZ ÜYE OL
                        </Link>
                        <Link href="/" className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-surface-hover text-text-main font-bold uppercase text-sm tracking-[0.2em] border border-surface-mid hover:bg-surface-mid active:scale-95 transition-all">
                            OYUNLARI İNCELE
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
