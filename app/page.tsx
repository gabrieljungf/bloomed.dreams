// FILE: src/app/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/page-background';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatWidget, ChatToggleButton } from '@/components/chat/chat-widget';
import { useAuth } from '@/components/auth/auth-provider';
import { ArrowRight, MoonStar, User } from 'lucide-react';
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import TextareaAutosize from 'react-textarea-autosize';

export default function Home() {
  const { user, loading } = useAuth();
  const [dream, setDream] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dreamToPass, setDreamToPass] = useState<string | null>(null);
  
  const observerRef = useRef<MutationObserver | null>(null);

  // ===== A SOLUÇÃO FINAL COM MutationObserver =====
  useEffect(() => {
    // Seleciona os elementos "flutuantes" que precisam ser sincronizados.
    const chatToggle = document.querySelector('.chat-toggle') as HTMLElement | null;
    const portalButton = document.getElementById('portal-button-container');

    // A função que será chamada sempre que o 'style' do body mudar.
    const handleMutation = () => {
      // Lê o padding que a 'vaul' aplicou. Se não houver, será uma string vazia.
      const bodyPaddingRight = document.body.style.paddingRight;
      
      // Aplica o MESMO padding como uma margem ou padding aos elementos flutuantes.
      if (chatToggle) {
        chatToggle.style.marginRight = bodyPaddingRight;
      }
      if (portalButton) {
        portalButton.style.paddingRight = bodyPaddingRight;
      }
    };

    // Cria o observador que chama nossa função quando o atributo 'style' do body muda.
    const observer = new MutationObserver(handleMutation);
    observerRef.current = observer;

    // Começa a observar.
    observer.observe(document.body, {
      attributes: true, // Queremos saber sobre mudanças de atributos
      attributeFilter: ['style'], // Especificamente o atributo 'style'
    });

    // Função de limpeza: para de observar quando o componente é desmontado.
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []); // O array vazio [] garante que este efeito rode apenas uma vez.

  async function handleInterpret() {
    const trimmedDream = dream.trim();
    if (!trimmedDream) return;
    setDreamToPass(trimmedDream);
    setIsChatOpen(true);
    setDream('');
  }

  useEffect(() => { if (isChatOpen && dreamToPass) { const timer = setTimeout(() => setDreamToPass(null), 150); return () => clearTimeout(timer); } }, [isChatOpen, dreamToPass]);
  useEffect(() => { if (!isChatOpen && dreamToPass !== null) { setDreamToPass(null); } }, [isChatOpen, dreamToPass]);
  const handleCloseChat = useCallback(() => setIsChatOpen(false), []);

  const portalButtonBaseClasses = "bg-purple-500/10 border border-purple-500/20 text-purple-200 hover:bg-purple-500/20 rounded-full flex items-center justify-center transition-all duration-300";

  return (
    <PageBackground>
      
      {/* Adicionamos um ID para que nosso useEffect possa encontrá-lo */}
      <div id="portal-button-container" className="absolute top-0 right-0 p-4 sm:p-6 z-20">
        <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: 0.2 }}>
          {!loading && (
            user ? (
              <Link href="/dashboard">
                <Button className={cn(portalButtonBaseClasses, "px-3 sm:px-4 py-2")}>
                  <User className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline text-xs">Dashboard</span>
                </Button>
              </Link>
            ) : (
              // O Drawer agora controla seu próprio estado interno.
              <Drawer>
                <DrawerTrigger asChild>
                  <Button className={cn(portalButtonBaseClasses, "px-3 sm:px-4 py-2")}>
                    <User className="h-4 w-4 sm:mr-2" />
                    <span className="hidden sm:inline text-xs">Login / Sign Up</span>
                  </Button>
                </DrawerTrigger>
                <DrawerContent className="bg-[#080b1d]/90 backdrop-blur-md border-purple-500/20">
                  <DrawerHeader className="sr-only">
                    <DrawerTitle>Where dreams begin to bloom.</DrawerTitle>
                    <DrawerDescription>Create an account or log in to access your dream journal.</DrawerDescription>
                  </DrawerHeader>
                  <div className="mx-auto w-full max-w-sm text-center py-8 px-4">
                    <div className="flex flex-col items-center gap-5"> 
                      <MoonStar className="w-10 h-10 text-purple-300" />
                      <div className="space-y-3">
                        <h2 className="text-2xl font-medium text-purple-100 font-display-marcellus">
                          Where dreams begin to bloom.
                        </h2>
                        <p className="text-sm text-purple-300/80 leading-relaxed font-sans font-light px-2">
                          More than a dream journal.
                          <br />
                          A personal guide that learns your unique dream language.
                          <br />
                          Self-knowledge begins here.
                        </p>
                      </div>
                      <div className="w-full space-y-3 pt-4">
                        <Link href="/signup" className="w-full">
                          {/* ===== BOTÃO PRINCIPAL REFINADO ===== */}
                          <Button className="w-full bg-purple-600 hover:bg-purple-500 transform hover:scale-[1.03] transition-all duration-500 shadow-lg hover:shadow-purple-500/25 rounded-full">
                            Begin My Journey
                          </Button>
                        </Link>
                        <Link href="/login" className="w-full">
                          {/* ===== BOTÃO SECUNDÁRIO REFINADO ===== */}
                          <Button 
                            variant="ghost" 
                            className="w-full text-purple-300 hover:text-purple-100 hover:bg-purple-500/10 rounded-full transition-all duration-500 hover:scale-[1.03]"
                          >
                            Returning Dreamer? Log In
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </DrawerContent>
              </Drawer>
            )
          )}
        </motion.div>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col min-h-screen pt-6 pb-28 items-center text-center justify-center">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="mb-12 flex flex-col items-center">
          <Logo />
        </motion.div>

        <div className="w-full max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} className="mb-10">
            <h2 className={cn("text-[26px] sm:text-3xl md:text-4xl lg:text-[42px]", "leading-snug md:leading-tight", "tracking-wide text-gray-200/90 font-light font-display")}>
              Your dreams are encrypted messages.<br />We help you decode them.
            </h2>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.5 }} className="w-full max-w-md mx-auto space-y-4">
            <TextareaAutosize
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream here, in any language..."
              minRows={5}
              className={cn(
              "w-full resize-none rounded-2xl p-4 sm:p-5 text-white placeholder:text-purple-200/60",
              "bg-purple-950/20 backdrop-blur-sm border border-purple-400/20 shadow-lg shadow-purple-500/10",
              "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-400/70 focus:border-transparent focus:bg-purple-950/40 focus:shadow-purple-500/20",
              "text-sm font-light leading-relaxed")} onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleInterpret(); } }} />
            <div className="mt-6">
              <Button onClick={handleInterpret} disabled={dream.trim() === ''} className="w-full bg-purple-700 hover:bg-purple-700 py-3 font-medium transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] bg-purple-900/50 disabled:bg-purple-900/30 disabled:text-purple-300/50 disabled:shadow-none disabled:cursor-not-allowed">
                Decode my Dream
              </Button>
            </div>
            <div className="text-center space-y-1 pt-4">
              <p className="text-center text-2xs text-purple-300/80">AI + Jungian Psychology</p>
              <p className="text-center text-2xs text-purple-300/80">No login required. No tracking. Just meaning.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {!isChatOpen && (<ChatToggleButton onClick={() => { setDreamToPass(null); setIsChatOpen(true); }} />)}
      <ChatWidget isOpenProp={isChatOpen} onClose={handleCloseChat} initialDream={dreamToPass} />
      <script dangerouslySetInnerHTML={{ __html: ` document.addEventListener('DOMContentLoaded', function() { const adjustViewport = () => { const vh = window.innerHeight * 0.01; document.documentElement.style.setProperty('--vh', \`\${vh}px\`); }; window.addEventListener('resize', adjustViewport); adjustViewport(); }); ` }} />
    </PageBackground>
  );
}