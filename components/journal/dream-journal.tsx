"use client";

import { Search, Calendar, Tags, SortDesc } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { DreamGrid } from './dream-grid';
import { BackgroundEffects } from '@/components/background-effects';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { TagSelector } from './tag-selector';

export function DreamJournal() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const availableTags = ['flying', 'nature', 'wisdom', 'water', 'light', 'mystery', 'crystals', 'memories', 'exploration'];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleDateSelect = (dates: Date[] | undefined) => {
    setSelectedDates(dates || []);
  };

  const handleTagSelect = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleSelectAllTags = () => {
    setSelectedTags(availableTags);
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  return (
    <>
      <BackgroundEffects />
      <div className="space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="flex flex-col items-center space-y-3"
        >
          <h1 className="text-4xl font-display text-purple-100 tracking-tight">
            Dream Journal
          </h1>
          <p className="text-sm text-purple-200/70 font-light">
            Your personal dream library
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="flex items-center gap-4"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-300/50" />
            <Input 
              placeholder="Search your dreams..."
              className="pl-10 bg-black/40 border-purple-500/20 text-purple-100 h-8 placeholder:text-xs"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-black/40 border-purple-500/20 text-purple-200 hover:bg-purple-500/10 h-8 font-light text-xs"
              >
                <Calendar className="w-3 h-3 mr-2" />
                Date
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 border-purple-500/20 p-4 w-auto">
              <DateRangePicker
                selected={selectedDates}
                onSelect={handleDateSelect}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-black/40 border-purple-500/20 text-purple-200 hover:bg-purple-500/10 h-8 font-light text-xs"
              >
                <Tags className="w-3 h-3 mr-2" />
                Tags {selectedTags.length > 0 && `(${selectedTags.length})`}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent 
              className="bg-black/95 border-purple-500/20"
              onCloseAutoFocus={(e) => e.preventDefault()}
            >
              <TagSelector
                availableTags={availableTags}
                selectedTags={selectedTags}
                onTagSelect={handleTagSelect}
                onSelectAll={handleSelectAllTags}
                onClear={handleClearTags}
              />
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                className="bg-black/40 border-purple-500/20 text-purple-200 hover:bg-purple-500/10 h-8 font-light text-xs"
              >
                <SortDesc className="w-3 h-3 mr-2" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/95 border-purple-500/20">
              <DropdownMenuItem 
                onClick={() => setSortOrder('newest')}
                className="text-xs"
              >
                Newest First
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setSortOrder('oldest')}
                className="text-xs"
              >
                Oldest First
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <DreamGrid
            searchQuery={searchQuery}
            selectedDate={selectedDates[0]}
            selectedTags={selectedTags}
            sortOrder={sortOrder}
          />
        </motion.div>
      </div>
    </>
  );
}