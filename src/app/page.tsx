'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GameCard } from '@/components/game/GameCard';
import { motion } from 'framer-motion';

const GAMES = [
  {
    id: 'wordle',
    title: 'Wordle',
    description: '5 harfli gizli kelimeyi 6 denemede bul!',
    href: '/games/wordle',
    comingSoon: false,
    thumbnail: '/games/wordle/card.webp',
    playCount: 15420,
    likeCount: 4200,
  },
  {
    id: 'anagram',
    title: 'Anagram',
    description: 'Karışık harflerden anlamlı kelime oluştur.',
    href: '/games/anagram',
    comingSoon: true,
    playCount: 0,
    likeCount: 0,
  },
  {
    id: 'hangman',
    title: 'Adam Asmaca',
    description: 'Harfleri tahmin ederek kelimeyi kurtarabilir misin?',
    href: '/games/hangman',
    comingSoon: true,
    playCount: 0,
    likeCount: 0,
  },
  {
    id: 'quiz',
    title: 'Kelime Bilgi',
    description: 'Anlamından kelimeyi tahmin et.',
    href: '/games/quiz',
    comingSoon: true,
    playCount: 0,
    likeCount: 0,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-bg px-4 py-12 sm:py-20 flex flex-col">
      <div className="max-w-5xl mx-auto w-full flex-grow">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-100 tracking-tight mb-3">
            Kelime Oyunları<span className="text-primary">.</span>tr
          </h1>
          <p className="text-slate-400 text-lg">
            Türkçe kelime oyunlarının en eğlenceli adresi.
          </p>
        </motion.div>

        {/* Oyun Kartları */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch"
        >
          {GAMES.map((game) => (
            <motion.div key={game.id} variants={itemVariants} className="flex w-full h-full">
              <GameCard
                title={game.title}
                description={game.description}
                comingSoon={game.comingSoon}
                onClick={() => router.push(game.href)}
                thumbnail={game.thumbnail}
                playCount={game.playCount}
                likeCount={game.likeCount}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
