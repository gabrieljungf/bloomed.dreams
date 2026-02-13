"use client";

import { Button } from "@/components/ui/button";
import { MoonStar, Plus } from "lucide-react";
import { useChatWidget } from "@/hooks/use-chat-widget"; // 1. IMPORTA o hook

export function EmptyState() {
  const { onOpen } = useChatWidget(); // 2. OBTÉM a função para abrir o chat

  return (
    <div className="text-center py-16 sm:py-24 px-4 flex flex-col items-center">
      <div className="p-4 bg-purple-500/10 rounded-full border border-purple-500/20 mb-6">
        <MoonStar className="w-10 h-10 text-purple-300" />
      </div>
      <h2 className="text-2xl sm:text-3xl font-display-marcellus text-purple-100 tracking-tight">
        Your Dream Journal Awaits
      </h2>
      <p className="mt-3 max-w-md mx-auto text-sm text-purple-200/70 font-light leading-relaxed">
        Every dream is a conversation with yourself. Start capturing those whispers
        to uncover hidden patterns and begin your journey of self-discovery.
      </p>
      <div className="mt-8">
        <Button
          onClick={onOpen} // 3. CONECTA a função ao clique do botão
          size="lg"
          className="bg-gradient-to-r from-purple-500/90 to-indigo-500/90
            hover:from-purple-500 hover:to-indigo-500
            text-white font-medium px-6 py-3 text-base
            rounded-full shadow-lg shadow-purple-500/25
            hover:shadow-purple-500/40
            transition-all duration-300 border border-white/10
            hover:border-white/20 flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Write last night’s dream
        </Button>
      </div>
    </div>
  );
}