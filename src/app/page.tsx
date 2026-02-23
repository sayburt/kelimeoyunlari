'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GameCard } from '@/components/game/GameCard';
import { motion } from 'framer-motion';
import { PenLine, Shuffle, BookA, Brain } from 'lucide-react';

const GAMES = [
  {
    id: 'wordle',
    title: 'Wordle',
    description: '5 harfli gizli kelimeyi 6 denemede bul!',
    icon: <PenLine size={32} />,
    href: '/games/wordle',
    comingSoon: false,
  },
  {
    id: 'anagram',
    title: 'Anagram',
    description: 'Karışık harflerden anlamlı kelime oluştur.',
    icon: <Shuffle size={32} />,
    href: '/games/anagram',
    comingSoon: true,
  },
  {
    id: 'hangman',
    title: 'Adam Asmaca',
    description: 'Harfleri tahmin ederek kelimeyi kurtarabilir misin?',
    icon: <BookA size={32} />,
    href: '/games/hangman',
    comingSoon: true,
  },
  {
    id: 'quiz',
    title: 'Kelime Bilgi',
    description: 'Anlamından kelimeyi tahmin et.',
    icon: <Brain size={32} />,
    href: '/games/quiz',
    comingSoon: true,
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
    <div className="min-h-screen bg-bg px-4 py-12 sm:py-20">
      <div className="max-w-3xl mx-auto">
        {/* Başlık */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-black text-gray-100 tracking-tight mb-3">
            Oyunlar
          </h1>
          <p className="text-slate-400 text-lg">
            Türkçe kelime oyunlarıyla eğlenerek öğren!
          </p>
        </motion.div>

        {/* Oyun Kartları */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6"
        >
          {GAMES.map((game) => (
            <motion.div key={game.id} variants={itemVariants}>
              <GameCard
                title={game.title}
                description={game.description}
                icon={game.icon}
                comingSoon={game.comingSoon}
                onClick={() => router.push(game.href)}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
