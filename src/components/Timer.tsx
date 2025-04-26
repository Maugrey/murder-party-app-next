"use client";

import { useEffect, useState } from 'react';
import { useGlobalStore } from '../stores/globalStore';
import { useTranslation } from 'react-i18next';

function formatTime(ms: number) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

const Timer = () => {
  const { t } = useTranslation();
  // Tous les hooks Zustand/React AVANT le guard
  const currentPhase = useGlobalStore((s) => s.currentPhase);
  const gameStartTime = useGlobalStore((s) => s.gameStartTime);
  const phaseStartTime = useGlobalStore((s) => s.phaseStartTime);
  const [now, setNow] = useState(Date.now());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  if (!hydrated) return null;

  const elapsedGame = gameStartTime ? now - gameStartTime : 0;
  const elapsedPhase = phaseStartTime ? now - phaseStartTime : 0;

  return (
    <div className="flex flex-row gap-1 md:gap-4 items-center text-xs md:text-sm">
      <span className="font-semibold">{t('Timer.phase', { phase: currentPhase })}</span>
      <span>{t('Timer.totalTime', { time: formatTime(elapsedGame) })}</span>
      <span>{t('Timer.phaseTime', { time: formatTime(elapsedPhase) })}</span>
    </div>
  );
};

export default Timer;
