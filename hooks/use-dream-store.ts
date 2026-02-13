// ARQUIVO FINAL E CORRIGIDO: hooks/use-dream-store.ts

"use client";

import { create } from 'zustand';

export type Dream = {
  id: string;
  user_id: string;
  created_at: string;
  title: string | null;
  content: string;
  mood: string | null;
  tags: string[] | null;
  interpretation: any | null;
};

interface DreamStoreState {
  dreams: Dream[];
  isLoading: boolean;
  fetchDreams: () => Promise<void>;
  addDream: (newDream: Dream) => void;
}

export const useDreamStore = create<DreamStoreState>((set, get) => ({ // Adicionado `get` aqui
  dreams: [],
  isLoading: true, // Começa como true, o que está correto para o primeiro carregamento
  
  fetchDreams: async () => {
    // ====================== A MUDANÇA CRÍTICA ESTÁ AQUI ======================
    // 1. Verificamos se já temos sonhos no estado.
    if (get().dreams.length > 0) {
      // Se já tivermos, garantimos que `isLoading` seja falso e paramos a execução.
      // Não há necessidade de buscar novamente.
      set({ isLoading: false });
      return; 
    }
    // =========================================================================

    // 2. Se não houver sonhos, o código continua como antes, fazendo o fetch inicial.
    try {
      set({ isLoading: true });
      const response = await fetch('/api/journal');
      if (!response.ok) throw new Error('Failed to fetch dreams');
      const data = await response.json();
      set({ dreams: data, isLoading: false });
    } catch (error) {
      console.error("Error fetching dreams:", error);
      set({ dreams: [], isLoading: false });
    }
  },
  
  addDream: (newDream) => {
    set((state) => ({
      dreams: [newDream, ...state.dreams]
    }));
  },
}));