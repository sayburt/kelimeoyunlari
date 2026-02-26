'use client';

import { motion } from 'framer-motion';

export function LoadingSpinner() {
    return (
        <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1 }}
            className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
    );
}
