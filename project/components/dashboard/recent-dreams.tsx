"use client";

import { ArrowRight, BookOpen, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CardContainer, CardHeader, CardFooter } from './cards';

interface Dream {
  id: number;
  date: string;
  content: string;
  symbols: string[];
  hasConnections: boolean;
}

interface RecentDreamsProps {
  dreams: Dream[];
}

export function RecentDreams({ dreams }: RecentDreamsProps) {
  return (
    <CardContainer>
      <CardHeader
        icon={<BookOpen className="w-5 h-5 text-purple-300" />}
        title="Recent Dreams"
        description="Your latest dream explorations"
      />

      <div className="space-y-6">
        {dreams.map((dream) => (
          <div
            key={dream.id}
            className="group space-y-4 pb-6 border-b border-purple-500/10 last:pb-0 last:border-0"
          >
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <span className="text-sm text-purple-200/80">{dream.date}</span>
                <p className="text-purple-100/90 leading-relaxed">{dream.content}</p>
              </div>
              {dream.hasConnections && (
                <div className="flex items-center gap-1 text-purple-300/60">
                  <Star className="w-4 h-4" />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                {dream.symbols.map((symbol) => (
                  <span
                    key={`${dream.id}-${symbol}`}
                    className="text-xs px-2 py-1 rounded-full bg-purple-500/10 text-purple-200/70
                      border border-purple-500/5"
                  >
                    {symbol}
                  </span>
                ))}
              </div>

              <Button
                variant="link"
                className="text-sm text-purple-300 hover:text-purple-200 flex items-center gap-1"
              >
                Explore
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <CardFooter disclaimer={["Explore your dream patterns", "Uncover hidden meanings"]}>
        <Button
          className="w-full bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
            hover:from-purple-500/90 hover:to-indigo-500/90
            text-white font-medium px-6 py-2
            rounded-full shadow-lg shadow-purple-500/20
            hover:shadow-purple-500/30
            transition-all duration-300 border border-white/10
            hover:border-white/20 flex items-center justify-center gap-2"
          size="lg"
        >
          <BookOpen className="w-4 h-4" />
          View All Dreams
        </Button>
      </CardFooter>
    </CardContainer>
  );
}