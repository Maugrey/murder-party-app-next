import { create } from 'zustand';

interface GameState {
  playerName: string;
  setPlayerName: (name: string) => void;
}

export const useGameStore = create<GameState>((set) => ({
  playerName: '',
  setPlayerName: (name) => set({ playerName: name }),
}));