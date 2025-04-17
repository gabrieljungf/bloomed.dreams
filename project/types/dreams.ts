export type DreamMood = 'positive' | 'neutral' | 'negative';

export interface Symbol {
  name: string;
  category: string;
  relevance: number;
  occurrences: number;
  description: string;
}

export interface Connection {
  dreamId: number;
  date: string;
  commonSymbols: Symbol[];
  strength: number;
}

export interface Dream {
  id: number;
  date: string;
  content: string;
  analysis: string;
  mood: DreamMood;
  clarity: number;
  symbols: Symbol[];
  hasConnections: boolean;
  connections?: Connection[];
  lunarPhase: string;
  dayOfWeek: string;
  sleepQuality: number;
  insights: number;
  patterns: string[];
}