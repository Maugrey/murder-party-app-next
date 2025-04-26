import { create } from 'zustand';
import { persistenceProvider } from '../utils/persistence';

export interface GlobalState {
  isGameStarted: boolean;
  currentPhase: number;
  gameStartTime: number | null;
  phaseStartTime: number | null;
  conditions: Record<string, boolean>;
  cluesViewed: Record<string, boolean>;
  itemsTaken: Record<string, boolean>;
  memoriesShown: string[];
  setIsGameStarted: (started: boolean) => void;
  setCurrentPhase: (phase: number) => void;
  setGameStartTime: (time: number) => void;
  setPhaseStartTime: (time: number) => void;
  setConditions: (conditions: Record<string, boolean>) => void;
  setCluesViewed: (clues: Record<string, boolean>) => void;
  setItemsTaken: (items: Record<string, boolean>) => void;
  setMemoriesShown: (memories: string[]) => void;
}

const STORAGE_KEY = 'murderparty-global';

function loadInitialState(): GlobalState {
  // Ne pas utiliser localStorage côté serveur
  const isClient = typeof window !== 'undefined';
  const saved = isClient ? (persistenceProvider.getItem<Partial<GlobalState>>(STORAGE_KEY) || {}) : {};
  return {
    isGameStarted: saved.isGameStarted ?? false,
    currentPhase: saved.currentPhase ?? 0,
    gameStartTime: saved.gameStartTime ?? null,
    phaseStartTime: saved.phaseStartTime ?? null,
    conditions: saved.conditions ?? {},
    cluesViewed: saved.cluesViewed ?? {},
    itemsTaken: saved.itemsTaken ?? {},
    memoriesShown: saved.memoriesShown ?? [],
    setIsGameStarted: () => {},
    setCurrentPhase: () => {},
    setGameStartTime: () => {},
    setPhaseStartTime: () => {},
    setConditions: () => {},
    setCluesViewed: () => {},
    setItemsTaken: () => {},
    setMemoriesShown: () => {},
  };
}

export const useGlobalStore = create<GlobalState>((set) => ({
  ...loadInitialState(),
  setIsGameStarted: (isGameStarted) => {
    set({ isGameStarted });
    save();
  },
  setCurrentPhase: (currentPhase) => {
    set({ currentPhase });
    save();
  },
  setGameStartTime: (gameStartTime) => {
    set({ gameStartTime });
    save();
  },
  setPhaseStartTime: (phaseStartTime) => {
    set({ phaseStartTime });
    save();
  },
  setConditions: (conditions) => {
    set({ conditions });
    save();
  },
  setCluesViewed: (cluesViewed) => {
    set({ cluesViewed });
    save();
  },
  setItemsTaken: (itemsTaken) => {
    set({ itemsTaken });
    save();
  },
  setMemoriesShown: (memoriesShown) => {
    set({ memoriesShown });
    save();
  },
}));

function save() {
  // Ne pas utiliser localStorage côté serveur
  if (typeof window === 'undefined') return;
  const state = useGlobalStore.getState();
  persistenceProvider.setItem(STORAGE_KEY, {
    isGameStarted: state.isGameStarted,
    currentPhase: state.currentPhase,
    gameStartTime: state.gameStartTime,
    phaseStartTime: state.phaseStartTime,
    conditions: state.conditions,
    cluesViewed: state.cluesViewed,
    itemsTaken: state.itemsTaken,
    memoriesShown: state.memoriesShown,
  });
}
