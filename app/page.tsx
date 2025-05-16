// FILE: src/app/page.tsx (Or wherever your Home component is)
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/page-background';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatWidget, ChatToggleButton } from '@/components/chat/chat-widget';

export default function Home() {
  const [dream, setDream] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dreamToPass, setDreamToPass] = useState<string | null>(null);

  async function handleInterpret() {
    const trimmedDream = dream.trim();
    if (!trimmedDream) return;

    console.log('Home: Passing dream to chat widget:', trimmedDream);
    setDreamToPass(trimmedDream);
    setIsChatOpen(true);
    setDream('');
  }

  // Effect to clear dreamToPass after chat opens and it's been "sent"
  useEffect(() => {
    if (isChatOpen && dreamToPass) {
      // Clear it shortly after opening so ChatWidget can pick it up,
      // but it doesn't re-process if user closes/reopens chat without a new main button click.
      const timer = setTimeout(() => {
        console.log('Home: Clearing dreamToPass via timer (after chat open)');
        setDreamToPass(null);
      }, 150); // Give a moment for ChatWidget to consume it
      return () => clearTimeout(timer);
    }
  }, [isChatOpen, dreamToPass]);

  // Effect to ensure dreamToPass is cleared if the chat is closed
  useEffect(() => {
    if (!isChatOpen) {
      if (dreamToPass !== null) { // Only update if necessary
        console.log('Home: Chat is closed, ensuring dreamToPass is null.');
        setDreamToPass(null);
      }
    }
  }, [isChatOpen, dreamToPass]); // Include dreamToPass in case it's set by other means while chat is closed (unlikely here but good practice)


  const handleToggleClick = () => {
      console.log('Home: Chat toggle button clicked (main page one, not used)');
      setDreamToPass(null);
      setIsChatOpen(true);
  };

  const handleCloseChat = useCallback(() => {
      console.log('Home: EXECUTANDO handleCloseChat no page.tsx, setting isChatOpen to false');
      setIsChatOpen(false);
      // setDreamToPass(null); // Also ensure it's cleared here for immediate effect. Covered by above useEffect too.
  }, []);


  return (
    <PageBackground>
      {/* Main content ... (no changes here, keeping it short) */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col min-h-screen pt-6 pb-28 items-center text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12 flex flex-col items-center"
        >
          <Logo />
        </motion.div>

        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10"
          >
            <h2 className={cn(
              "text-[26px]", "sm:text-3xl", "md:text-4xl", "lg:text-[42px]",
              "leading-snug", "md:leading-tight",
              "tracking-wide text-gray-200/90 font-extralight font-display"
            )}>
              Your dreams are encrypted messages.
              <br />
              We help you decode them.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mx-auto space-y-4"
          >
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Describe your dream here..."
              rows={5}
              className={cn(
                "w-full rounded-md border p-4 text-white placeholder-purple-300/85",
                "focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent",
                "bg-purple-900/15 border-purple-600/40",
                "text-base sm:text-xs font-light"
              )}
              onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleInterpret();
                 }
               }}
            />
            <div className="mt-6">
              <Button
                onClick={handleInterpret}
                disabled={dream.trim() === ''}
                className="w-full bg-purple-700 hover:bg-purple-700 py-3 font-medium transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] bg-purple-900/50 disabled:bg-purple-900/30 disabled:text-purple-300/50 disabled:shadow-none disabled:cursor-not-allowed"
              >
                Decode my Dream
              </Button>
            </div>
            <div className="text-center space-y-1 pt-4">
              <p className="text-center text-2xs text-purple-300/80">AI + Jungian Psychology</p>
              <p className="text-center text-2xs text-purple-300/80">No login. No tracking. Just meaning.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {!isChatOpen && (
           <ChatToggleButton onClick={() => {
               console.log('Home: Chat toggle button clicked, setting isChatOpen to true, ensuring dreamToPass is null.');
               setDreamToPass(null); // Explicitly nullify here for this open path
               setIsChatOpen(true);
           }} />
      )}

      <ChatWidget
        isOpenProp={isChatOpen}
        onClose={handleCloseChat}
        initialDream={dreamToPass}
      />

       <script dangerouslySetInnerHTML={{
        __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const adjustViewport = () => {
              const vh = window.innerHeight * 0.01;
              document.documentElement.style.setProperty('--vh', \`\${vh}px\`);
            };
            window.addEventListener('resize', adjustViewport);
            adjustViewport();
          });
        `
      }} />
    </PageBackground>
  );
}