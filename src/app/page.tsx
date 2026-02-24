'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GameCard } from '@/components/game/GameCard';
import { GameInstructions } from '@/components/game/GameInstructions';
import { motion, AnimatePresence } from 'framer-motion';
import { GAMES, Game } from '@/data/games';
import { X } from 'lucide-react';

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
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);

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
          <h1 className="text-4xl sm:text-5xl font-black text-text-main tracking-tight mb-3">
            <span className="text-primary">KELİME</span> oyunları<span className="text-primary">.</span>tr
          </h1>
          <p className="text-text-secondary text-lg">
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
          {GAMES.filter(game => !game.comingSoon).map((game) => (
            <motion.div key={game.id} variants={itemVariants} className="flex w-full h-full">
              <GameCard
                title={game.title}
                description={game.description}
                comingSoon={game.comingSoon}
                onClick={() => router.push(game.href)}
                onInfo={() => setSelectedGame(game)}
                thumbnail={game.thumbnail}
                playCount={game.playCount}
                likeCount={game.likeCount}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Nasıl Oynanır Modal */}
      <AnimatePresence>
        {selectedGame && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedGame(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-surface border border-surface-mid shadow-2xl rounded-2xl p-6 sm:p-8"
            >
              <button
                onClick={() => setSelectedGame(null)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-surface-mid/50 text-text-muted transition-colors"
                aria-label="Kapat"
              >
                <X size={20} />
              </button>

              <div className="mb-8">
                <h3 className="text-3xl font-black text-text-main mb-2">{selectedGame.title}</h3>
                <p className="text-text-secondary">{selectedGame.description}</p>
              </div>

              <GameInstructions
                instructions={selectedGame.instructions}
                title={selectedGame.title}
              />

              <div className="mt-8 pt-6 border-t border-surface-mid/50 flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => {
                    setSelectedGame(null);
                    router.push(selectedGame.href);
                  }}
                  disabled={selectedGame.comingSoon}
                  className="flex-1 bg-primary text-black font-bold py-3 px-6 rounded-xl hover:bg-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {selectedGame.comingSoon ? 'Yakında' : 'Şimdi Oyna'}
                </button>
                <button
                  onClick={() => setSelectedGame(null)}
                  className="flex-1 bg-surface-mid text-text-main font-bold py-3 px-6 rounded-xl hover:bg-surface-hover transition-colors"
                >
                  Kapat
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
