'use client';

import { useState } from 'react';

export function useGameModals() {
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [showStatsModal, setShowStatsModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);
    const [showResultModal, setShowResultModal] = useState(false);

    const isPaused = showInfoModal || showStatsModal || showSettingsModal || showResultModal;

    return {
        showInfoModal,
        setShowInfoModal,
        showStatsModal,
        setShowStatsModal,
        showSettingsModal,
        setShowSettingsModal,
        showResultModal,
        setShowResultModal,
        isPaused,
    };
}
