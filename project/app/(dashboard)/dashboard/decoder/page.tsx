"use client";

import { BackgroundEffects } from '@/components/background-effects';

export default function DecoderPage() {
  return (
    <>
      <BackgroundEffects />
      <div className="space-y-8 relative z-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-violet-200 to-purple-200">
            Dream Decoder
          </h1>
          <p className="text-lg text-violet-200/80">
            Uncover patterns and insights from your dreams
          </p>
        </div>

        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 p-8">
          <div className="text-center">
            <p className="text-purple-200/60">
              Your dream analysis insights will appear here
            </p>
          </div>
        </div>
      </div>
    </>
  );
}