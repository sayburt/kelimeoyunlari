"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Gamepad2, Trophy, BarChart3, Cloud, Settings, Swords, Save } from 'lucide-react';
import Link from 'next/link';

const features = [
    {
        id: "profil",
        title: "Bulut Kayıt & Üyelik Sistemi",
        description: "Misafir olarak da oynayabilirsiniz ancak ücretsiz üye olduğunuzda tüm ilerlemeniz güvenle bulutta saklanır. Oyun istatistikleriniz (oynanma sayısı, dereceler) hesabınıza işlenir, cihazlar arası sorunsuz devam edebilirsiniz.",
        icon: <Cloud className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-blue-400",
        bgLight: "bg-blue-400/10",
        bgDark: "bg-blue-900/20",
        borderColor: "border-blue-500/20"
    },
    {
        id: "istatistikler",
        title: "Kapsamlı İstatistikler",
        description: "Gelişiminizi yakından takip edin. Her oyun için kazanma oranınız, ortalama süreniz, en iyi dereceniz, kullandığınız joker sayısı ve daha fazlası detaylı grafiklerle hizmetinizde.",
        icon: <BarChart3 className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-purple-400",
        bgLight: "bg-purple-400/10",
        bgDark: "bg-purple-900/20",
        borderColor: "border-purple-500/20"
    },
    {
        id: "liderlik",
        title: "Global Liderlik Tablosu",
        description: "Rekabet hiç bu kadar zevkli olmamıştı! Her oyun modu için ayrı oluşturulmuş eş zamanlı tablolar. Hem haftalık sıfırlanan heyecanlı yarışta hem de tüm zamanların global liderlik tablosunda yerinizi alın.",
        icon: <Trophy className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-yellow-400",
        bgLight: "bg-yellow-400/10",
        bgDark: "bg-yellow-900/20",
        borderColor: "border-yellow-500/20"
    },
    {
        id: "kaydetme",
        title: "Oyunları Kaydetme",
        description: "Oyun oynarken acil bir işiniz mi çıktı? Oyun tahtasındaki güncel durumunuz, tahminleriniz ve süreniz otomatik olarak kaydedilir. Daha sonra geri döndüğünüzde oyununuza tam olarak kaldığınız yerden devam edebilirsiniz.",
        icon: <Save className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-orange-400",
        bgLight: "bg-orange-400/10",
        bgDark: "bg-orange-900/20",
        borderColor: "border-orange-500/20"
    },
    {
        id: "meydan-okuma",
        title: "Meydan Okuma Sistemi",
        description: "Yüksek bir skor mu yaptınız? Meydan okuma butonuna tıklayarak oyuna özel bir link oluşturun. Bu linki arkadaşlarınıza gönderdiğinizde, onlar da birebir sizin çözdüğünüz kelimeyle, sizin şartlarınızda yarışarak yeteneklerini test edebilirler!",
        icon: <Swords className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-green-400",
        bgLight: "bg-green-400/10",
        bgDark: "bg-green-900/20",
        borderColor: "border-green-500/20"
    },
    {
        id: "ayarlar",
        title: "Oyuna Özgü Ayarlar",
        description: "Oyun deneyimini tamamen kendi isteğinize göre şekillendirin. Her oyunun kendi mekaniğine özgü gelişmiş ayarları bulunur. Zorluk derecelerini, gece modunu ve ses tercihlerini özelleştirerek en rahat oynanış deneyimini yaratın.",
        icon: <Settings className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-cyan-400",
        bgLight: "bg-cyan-400/10",
        bgDark: "bg-cyan-900/20",
        borderColor: "border-cyan-500/20"
    },
    {
        id: "oyun-cesitliligi",
        title: "Zengin Oyun Seçenekleri",
        description: "Tek bir platformda toplanmış birden fazla akıl sporu! Wordle kopyalarından çok daha öte; Boggle, Kelime Arama, Zıt Anlamlılar gibi birbirinden farklı zihinsel antrenmanlar sunan geniş bir oyun kataloğu.",
        icon: <Gamepad2 className="w-7 h-7 sm:w-8 sm:h-8" />,
        color: "text-rose-400",
        bgLight: "bg-rose-400/10",
        bgDark: "bg-rose-900/20",
        borderColor: "border-rose-500/20"
    }
];

export default function OzelliklerPage() {
    return (
        <div className="min-h-[100dvh] bg-bg font-sans selection:bg-primary/30 selection:text-primary pb-20 overflow-x-hidden relative">
            
            {/* Ambient Background Blur Elements */}
            <div className="fixed top-0 left-1/4 w-[50vw] h-[50vw] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
            <div className="fixed bottom-0 right-1/4 w-[40vw] h-[40vw] bg-purple-500/5 rounded-full blur-[100px] pointer-events-none -z-10"></div>

            {/* Hero Section */}
            <section className="relative pt-24 pb-12 md:pt-28 md:pb-16 px-6 md:px-12 flex flex-col items-center justify-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl"
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-surface border border-[var(--theme-glass-border)] mb-8 shadow-sm">
                         <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                         <span className="text-xs md:text-sm font-bold tracking-widest text-text-secondary uppercase">Premium Deneyim</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-text-main tracking-tighter mb-6 relative z-10">
                        Sınırları <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">Zorlayın</span>
                    </h1>
                    
                    <p className="text-lg md:text-2xl text-text-secondary font-medium tracking-wide leading-relaxed max-w-3xl mx-auto opacity-90">
                        Türkiye&apos;nin en gelişmiş kelime platformunda, sadece oyun oynamaz, 
                        zihinsel potansiyelinizi tüm detaylarıyla deneyimlersiniz.
                    </p>
                </motion.div>
            </section>

            {/* Premium Cards Grid */}
            <section className="px-6 md:px-12 max-w-[1400px] mx-auto mt-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {features.map((feature, index) => (
                        <motion.div 
                            key={feature.id}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-50px" }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            whileHover={{ y: -8, scale: 1.02 }}
                            className={`group relative flex flex-col p-6 md:p-8 rounded-3xl glass-surface border border-[var(--theme-glass-border)] hover:${feature.borderColor} bg-surface-hover/30 hover:bg-surface-mid/50 transition-all duration-500 shadow-xl hover:shadow-2xl overflow-hidden`}
                        >
                            {/* Card Glow Effect */}
                            <div className={`absolute -inset-0 bg-gradient-to-br ${feature.bgLight} dark:${feature.bgDark} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
                            <div className={`absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-${feature.color.split('-')[1]}-400/20 to-transparent blur-3xl rounded-full group-hover:scale-150 transition-transform duration-700`}></div>

                            {/* Icon Container */}
                            <div className="relative z-10 mb-6">
                                <div className={`inline-flex items-center justify-center p-4 rounded-2xl ${feature.bgLight} dark:${feature.bgDark} ${feature.color} border border-black/5 dark:border-white/5 shadow-inner transition-transform duration-500 group-hover:rotate-6 group-hover:scale-110`}>
                                    {feature.icon}
                                </div>
                            </div>

                            {/* Text Content */}
                            <div className="relative z-10 flex-1 flex flex-col">
                                <h3 className="text-xl md:text-2xl font-black text-text-main tracking-tight mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-text-main group-hover:to-text-secondary transition-colors duration-300">
                                    {feature.title}
                                </h3>
                                <p className="text-text-secondary leading-relaxed font-medium text-sm md:text-base">
                                    {feature.description}
                                </p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>

            {/* CTA Section */}
            <section className="mt-32 px-6 pb-10">
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    className="max-w-5xl mx-auto rounded-[3rem] glass-surface p-10 md:p-20 text-center shadow-2xl border border-[var(--theme-glass-border)] relative overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
                    
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-text-main mb-6 tracking-tight relative z-10">
                        Hazır Mısınız?
                    </h2>
                    
                    <p className="text-text-secondary text-lg md:text-xl mb-12 max-w-2xl mx-auto font-medium relative z-10">
                        Zeka oyunlarına hemen başlayın, kelime haznelerini geliştiren yüz binlerce oyuncunun arasına katılın.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 relative z-10">
                        <Link href="/register" className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-primary text-bg font-black uppercase text-sm md:text-base tracking-[0.2em] shadow-xl shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-1 active:translate-y-0 transition-all">
                            ÜCRETSİZ BAŞLA
                        </Link>
                        <Link href="/" className="w-full sm:w-auto px-12 py-6 rounded-2xl bg-surface-hover text-text-main font-bold uppercase text-sm md:text-base tracking-[0.2em] border border-surface-mid hover:bg-surface-mid active:scale-95 transition-all">
                            OYUNLARA GÖZ AT
                        </Link>
                    </div>
                </motion.div>
            </section>
        </div>
    );
}
