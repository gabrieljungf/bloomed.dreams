'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PageBackground } from '@/components/page-background';
import { Logo } from '@/components/brand/logo';
import { motion } from 'framer-motion';

export default function Home() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleInterpret() {
    setLoading(true);
    setError(null);
    setInterpretation(null);
    try {
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream }),
      });
      if (!response.ok) {
        throw new Error('Failed to get interpretation');
      }
      const data = await response.json();
      setInterpretation(data.interpretation);
    } catch (err: any) {
      setError(err.message || 'Unknown error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageBackground>
      {/* Login link */}
      <div className="absolute top-6 right-6 z-20">
        <Link
          href="/login"
          className="text-purple-300/80 hover:text-purple-300 text-sm font-light transition-colors"
        >
          Already have an account? Sign in
        </Link>
      </div>

      {/* Main content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 flex flex-col h-screen justify-center items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-6 flex flex-col items-center"
        >
          <Logo />
          {/* Apenas uma vez a tagline */}
          <p className="mt-2 text-sm text-purple-300/70 tracking-widest font-light"> </p>
        </motion.div>

        <div className="w-full max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mb-10"
          >
            {/* Formato original restaurado */}
            <h2 className="text-[42px] leading-tight tracking-wide text-gray-200/90 font-light font-display">
              Your dreams are encrypted messages.
              <br />
              We help you decode them.
            </h2>
          </motion.div>

          {/* Input e botão */}
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
              className="w-full rounded-md border text-xs border-purple-600/40 bg-purple-900/15 p-4 text-white placeholder-purple-300/85 focus:outline-none focus:ring-2 focus:ring-purple-500/60 focus:border-transparent"
            />
            
            {/* Ajuste o espaçamento entre a caixa e o botão (mt-6 para mais espaço) */}
            <div className="mt-16">
              <Button
                onClick={handleInterpret}
                disabled={loading || dream.trim() === ''}
                // Botão com glow místico (sem usar cn)
                className="w-full bg-purple-700 hover:bg-purple-700 py-3 font-medium transition-all duration-300 shadow-[0_0_15px_rgba(168,85,247,0.5)] hover:shadow-[0_0_25px_rgba(168,85,247,0.7)] bg-purple-900/50 disabled:text-purple-300/50 disabled:shadow-none"
              >
                {loading ? 'Interpreting...' : 'Decode my Dream'}
              </Button>
            </div>

            <div className="text-center space-y-1">
              <p className="text-center text-2xs text-purple-300/80 mt-5">AI + Jungian Psychology</p>
              <p className="text-center text-2xs text-purple-300/80">No login. No tracking. Just meaning.</p>
            </div>

            {error && (
              <p className="text-red-500 text-sm font-medium">{error}</p>
            )}

            {interpretation && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-6 rounded-md border border-purple-600/40 bg-purple-900/30 p-5 text-left text-white"
              >
                <h3 className="mb-3 text-lg font-semibold">Interpretation</h3>
                <p className="text-base leading-relaxed">{interpretation}</p>
                <div className="mt-5 flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(interpretation);
                    }}
                    className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
                  >
                    Copy
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      alert('Share or subscribe feature coming soon!');
                    }}
                    className="border-purple-500/30 text-purple-200 hover:bg-purple-800/30"
                  >
                    Share
                  </Button>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Script para ajuste de altura em telas pequenas */}
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