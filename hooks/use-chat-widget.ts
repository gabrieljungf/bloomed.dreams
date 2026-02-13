"use client";

import { create } from 'zustand';

interface ChatWidgetState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
}

// Usando Zustand para um gerenciamento de estado global, limpo e eficiente.
// Se você ainda não instalou: npm install zustand
export const useChatWidget = create<ChatWidgetState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));