"use client";

import { useState } from 'react';
import { BackgroundEffects } from '@/components/background-effects';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export default function DecoderPage() {
  const [dream, setDream] = useState('');
  const [interpretation, setInterpretation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleDecodeDream = async () => {
    if (!dream.trim()) {
      toast({
        title: 'Input Missing',
        description: 'Please enter your dream before decoding.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    setInterpretation(null); // Clear previous interpretation

    try {
      const response = await fetch('/api/interpret-dream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ dream }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to decode dream');
      }

      const data = await response.json();
      setInterpretation(data.interpretation);

    } catch (error: any) {
      toast({
        title: 'Decoding Failed',
        description: error.message,
        variant: 'destructive',
      });
      setInterpretation(`Error: ${error.message}`); // Display error in interpretation area
    } finally {
      setLoading(false);
    }
  };

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

        <div className="bg-black/40 backdrop-blur-sm rounded-lg border border-white/5 p-8 space-y-4">
          <div>
            <Textarea
              placeholder="Enter your dream here..."
              value={dream}
              onChange={(e) => setDream(e.target.value)}
              rows={8}
              className="bg-white/5 border-white/10 text-violet-100 placeholder:text-violet-200/50 focus:border-purple-500"
            />
          </div>
          <Button
            onClick={handleDecodeDream}
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white"
          >
            {loading ? 'Decoding...' : 'Decode My Dream'}
          </Button>

          <div className="mt-4">
            <h2 className="text-xl font-semibold text-violet-200 mb-2">Interpretation:</h2>
            <div className="bg-white/5 border border-white/10 rounded-md p-4 text-violet-100 min-h-[100px] whitespace-pre-wrap">
              {loading ? (
                <p className="text-purple-200/60">Getting interpretation...</p>
              ) : interpretation ? (
                interpretation
              ) : (
                <p className="text-purple-200/60">Your dream analysis insights will appear here</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
