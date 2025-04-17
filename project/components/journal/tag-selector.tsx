"use client";

import { Check, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onTagSelect: (tag: string) => void;
  onSelectAll: () => void;
  onClear: () => void;
}

export function TagSelector({
  availableTags,
  selectedTags,
  onTagSelect,
  onSelectAll,
  onClear
}: TagSelectorProps) {
  return (
    <div className="p-2 space-y-2" onClick={(e) => e.stopPropagation()}>
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onSelectAll}
          className="text-xs h-7 px-2"
        >
          <Check className="w-3 h-3 mr-1" />
          Select All
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs h-7 px-2"
        >
          <X className="w-3 h-3 mr-1" />
          Clear
        </Button>
      </div>
      
      <div className="space-y-1 max-h-[200px] overflow-y-auto custom-scrollbar">
        {availableTags.map(tag => (
          <div
            key={tag}
            onClick={() => onTagSelect(tag)}
            className="flex items-center gap-2 px-2 py-1.5 hover:bg-purple-500/20 rounded-sm cursor-pointer"
          >
            <div className={`w-2 h-2 rounded-full ${
              selectedTags.includes(tag) ? 'bg-purple-500' : 'bg-purple-500/20'
            }`} />
            <span className="capitalize text-xs text-purple-200/80">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
}