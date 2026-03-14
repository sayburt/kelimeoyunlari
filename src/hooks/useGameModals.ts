'use client';

import { useState } from 'react';

export function useGameModals() {
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    const isPaused = showStatsModal || showSettingsModal || showResultModal;

    return {
        showStatsModal,
        setShowStatsModal,
        showSettingsModal,
        setShowSettingsModal,
        showResultModal,
        setShowResultModal,
        isPaused,
    };
}
