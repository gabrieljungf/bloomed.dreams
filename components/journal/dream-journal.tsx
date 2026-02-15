// ARQUIVO FINAL E CORRIGIDO (MUDANÇA MÍNIMA): components/journal/dream-journal.tsx

"use client";

import { useState, useEffect } from 'react';
import { Search, Calendar, Tags, SortDesc } from 'lucide-react';
import { DreamGrid } from './dream-grid';
import { motion } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TagSelector } from './tag-selector';
import type { DateRange } from 'react-day-picker';
import type { SelectRangeEventHandler } from 'react-day-picker';
import { EmptyState } from '@/components/dashboard/empty-state';
import { useDreamStore } from '@/hooks/use-dream-store';
import { useAuth } from '@/components/auth/auth-provider';

const MOCK_AVAILABLE_TAGS = ['flying', 'nature', 'wisdom', 'water', 'light', 'mystery', 'crystals', 'memories', 'exploration'];

export function DreamJournal() {
  const { user } = useAuth();
  const { dreams, isLoading, fetchDreams, removeDream } = useDreamStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateRange, setSelectedDateRange] = useState<DateRange | undefined>(undefined);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  useEffect(() => {
    // FIX: Adicionado 'user' à lista de dependências para re-fetch ao logar/deslogar.
    if (user) {
      fetchDreams();
    }
  }, [fetchDreams, user]);

  const handleDateRangeSelect: SelectRangeEventHandler = (range) => {
    setSelectedDateRange(range);
  };
  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const handleDeleteDream = async (dreamId: string) => {
    const response = await fetch('/api/journal', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: dreamId }),
    });

    if (!response.ok) {
      throw new Error('Failed to delete dream');
    }

    removeDream(dreamId);
  };

  if (isLoading) {
    return <div className="text-center p-10 text-purple-200/50">Loading your journal...</div>;
  }
  
  if (!isLoading && dreams.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-8 relative z-10">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center space-y-3"
      >
        <h1 className="text-[28px] sm:text-[44px] font-display-cormorant text-purple-100 text-center">
          The home for your dreams.
        </h1>
        <p className="text-xs sm:text-sm text-purple-200/75 font-extralight text-center">Keep every dream safe, searchable, and yours.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28, ease: [0.2, 0.6, 0.2, 1] }}
        className="flex flex-col sm:flex-row items-center gap-3"
      >
        {/* SEARCH PILL - MUDANÇA AQUI */}
        <div className="flex items-center w-full sm:flex-1 px-4 h-11 rounded-full search-pill-bordered">
          <Search className="w-4 h-4 text-purple-300/80" />
          <input
            type="text"
            placeholder="Search in title, content, or tags..."
            className="input-reset ml-3 text-xs text-purple-100 placeholder:text-purple-200/50 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* BUTTONS - MUDANÇA AQUI */}
        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 w-full sm:w-auto">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`pill-btn-bordered flex items-center gap-2 text-2xs text-purple-200/80 ${selectedDateRange ? 'active-filter' : ''}`}>
                <Calendar className="w-3 h-3" />
                Date
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-purple-500/20 p-4 w-auto max-w-[90vw]">
              <DateRangePicker selectedRange={selectedDateRange} onRangeSelect={handleDateRangeSelect} />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`pill-btn-bordered flex items-center gap-2 text-2xs text-purple-200/80 ${selectedTags.length > 0 ? 'active-filter' : ''}`}>
                <Tags className="w-3 h-3" />
                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-purple-500/20 w-auto max-w-[90vw]" onCloseAutoFocus={(e) => e.preventDefault()}>
              <TagSelector
                availableTags={MOCK_AVAILABLE_TAGS}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onSelectAll={() => setSelectedTags(MOCK_AVAILABLE_TAGS)}
                onClear={() => setSelectedTags([])}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className={`pill-btn-bordered flex items-center gap-2 text-2xs text-purple-200/80 ${sortOrder !== 'newest' ? 'active-filter' : ''}`}>
                <SortDesc className="w-3 h-3" />
                Sort
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-purple-500/20">
              <DropdownMenuItem onClick={() => setSortOrder('newest')} className="text-xs">Newest First</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSortOrder('oldest')} className="text-xs">Oldest First</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {(searchQuery || selectedDateRange || selectedTags.length > 0) && (
            <button
              className="pill-btn-bordered flex items-center gap-2 text-2xs text-purple-200/80"
              onClick={() => {
                setSearchQuery('');
                setSelectedDateRange(undefined);
                setSelectedTags([]);
                setSortOrder('newest');
              }}
            >
              Clear All
            </button>
          )}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      >
        <DreamGrid
          dreams={dreams}
          searchQuery={searchQuery}
          selectedDateRange={selectedDateRange}
          selectedTags={selectedTags}
          sortOrder={sortOrder}
          onDelete={handleDeleteDream}
        />
      </motion.div>
    </div>
  );
}
