// FILE: src/app/page.tsx (Or wherever your Home component is)
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/page-background';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChatWidget, ChatToggleButton } from '@/components/chat/chat-widget'; // Adjust path if needed

export default function Home() {
  const [dream, setDream] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [dreamToPass, setDreamToPass] = useState<string | null>(null);

  // --- Modified function for the main "Decode my Dream" button ---
  async function handleInterpret() {
    const trimmedDream = dream.trim();
    if (!trimmedDream) return; // Don't do anything if empty

    console.log('Passing dream to chat widget:', trimmedDream);
    setDreamToPass(trimmedDream); // Set the dream text to pass
    setIsChatOpen(true);        // Open the chat widget
    setDream('');              // Clear the main textarea
    // No API call here anymore
  }

  // Effect to clear dreamToPass after chat opens to prevent re-triggering on simple reopen
  // Optional: depends if you want re-submission on reopen without new main button click
  useEffect(() => {
      if (isChatOpen && dreamToPass) {
          // Clear it shortly after opening so it doesn't re-process if user closes/reopens chat
          const timer = setTimeout(() => setDreamToPass(null), 100);
          return () => clearTimeout(timer);
      }
  }, [isChatOpen, dreamToPass])

  const handleToggleClick = () => {
      setDreamToPass(null); // Garante que não passe sonho se aberto pelo botão
      setIsChatOpen(true);
  }

  const handleCloseChat = () => {
      console.log('handleCloseChat function called'); // Added this log
      console.log('Closing chat, setting isChatOpen to false');
      setIsChatOpen(false);
  }


  return (
    <PageBackground>

      {/* Main content */}
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
              // --- Classes de Tamanho Responsivas ---
              "text-[20px]",         // Mobile: font-size: 24px
              "sm:text-3xl",      // SM: font-size: 30px
              "md:text-4xl",      // MD: font-size: 36px
              "lg:text-[42px]",   // LG: font-size: 42px

              // --- Classes de Line Height Responsivas ---
              // Para mobile e SM, um line-height um pouco mais generoso pode ser bom
              "leading-snug",     // Base (24px * 1.375 = 33px) (30px * 1.375 = 41.25px)
              // Para MD e LG, queremos replicar o 'leading-tight' que você tinha com 42px
              "md:leading-tight", // MD: (36px * 1.25 = 45px) LG: (42px * 1.25 = 52.5px)

              // --- Outros Estilos Visuais ---
              "tracking-wide text-gray-200/90 font-light font-display"
            )}>
              Your dreams are encrypted messages.
              <br />
              We help you decode them.
            </h2>
          </motion.div>

          {/* Input and button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="w-full max-w-md mx-auto space-y-4"
          >
            <textarea
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              placeholder="Type your dream here..."
              rows={5}
              className="w-full rounded-md border text-xs font-light border-purple-600/40 bg-purple-900/15 p-4 text-white placeholder-purple-300/85 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
              // Optional: Add Enter key submission to trigger handleInterpret
              onKeyDown={(e) => {
                 if (e.key === 'Enter' && !e.shiftKey) {
                     e.preventDefault();
                     handleInterpret();
                 }
               }}
            />

            {/* Main Decode Button */}
            <div className="mt-6"> {/* Adjusted margin */}
              <Button
                onClick={handleInterpret}
                disabled={dream.trim() === ''} // Disable only based on dream input
                className="w-full bg-purple-700 hover:bg-purple-700 py-3 font-medium transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] bg-purple-900/50 disabled:bg-purple-900/30 disabled:text-purple-300/50 disabled:shadow-none disabled:cursor-not-allowed" // Adjusted disabled style
              >
                {/* Button text is now static */}
                Decode my Dream
              </Button>
            </div>

            <div className="text-center space-y-1 pt-4"> {/* Added padding-top */}
              <p className="text-center text-2xs text-purple-300/80">AI + Jungian Psychology</p>
              <p className="text-center text-2xs text-purple-300/80">No login. No tracking. Just meaning.</p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Render the Chat Toggle Button */}
      {!isChatOpen && ( // Only show toggle button if chat is closed
           <ChatToggleButton onClick={() => {
               console.log('Chat toggle button clicked, setting isChatOpen to true');
               setDreamToPass(null); // Ensure no dream is passed if opened via button
               setIsChatOpen(true);
           }} />
      )}


      {/* Render the Chat Widget, controlled by state */}
      {/* It will render itself based on isOpenProp */}
      <ChatWidget
        isOpenProp={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialDream={dreamToPass}
      />

      {/* Viewport height script (Keep as is) */}
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
