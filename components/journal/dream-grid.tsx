"use client";

import { DreamCard } from './dream-card';
import type { DateRange } from 'react-day-picker';

type Dream = {
  id: string;
  created_at: string;
  title: string | null;
  content: string;
  tags: string[] | null;
  mood: string | null;
  interpretation?: string | null;   // <- add
};

interface DreamGridProps {
  dreams: Dream[];
  searchQuery?: string;
  selectedDateRange?: DateRange;
  selectedTags?: string[];
  sortOrder?: 'newest' | 'oldest';
}

export function DreamGrid({
  dreams,
  searchQuery = '',
  selectedDateRange,
  selectedTags = [],
  sortOrder = 'newest'
}: DreamGridProps) {
  let filteredDreams = dreams;

  // Busca
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredDreams = filteredDreams.filter(dream =>
      (dream.title && dream.title.toLowerCase().includes(query)) ||
      dream.content.toLowerCase().includes(query) ||
      (dream.tags && dream.tags.some(tag => tag.toLowerCase().includes(query)))
    );
  }

  // Data (range)
  if (selectedDateRange?.from) {
    const from = selectedDateRange.from.getTime();
    const to = (selectedDateRange.to || selectedDateRange.from).getTime() + (24 * 60 * 60 * 1000 - 1);
    filteredDreams = filteredDreams.filter(dream => {
      const dreamDate = new Date(dream.created_at).getTime();
      return dreamDate >= from && dreamDate <= to;
    });
  }

  // Tags
  if (selectedTags.length > 0) {
    filteredDreams = filteredDreams.filter(dream =>
      dream.tags && selectedTags.some(tag => dream.tags!.includes(tag))
    );
  }

  // Ordenação
  filteredDreams = [...filteredDreams].sort((a, b) => {
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  if (filteredDreams.length === 0) {
    return (
      <div className="text-center py-10 text-purple-200/60">
        <p>No dreams match your current filters.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {filteredDreams.map((dream, index) => (
        <DreamCard
          key={dream.id}
          variant={index % 2 === 0 ? "default" : "alt"}
          dream={{
            id: dream.id,
            title: dream.title || 'Untitled Dream',
            created_at: dream.created_at,
            content: dream.content,
            tags: dream.tags || [],
            mood: dream.mood || 'neutral',
            interpretation: dream.interpretation ?? null, // <- add
          }}
        />
      ))}
    </div>
  );
}