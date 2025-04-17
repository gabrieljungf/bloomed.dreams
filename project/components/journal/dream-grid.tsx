"use client";

import { DreamCard } from './dream-card';
import { useState } from 'react';

const initialDreams = [
  {
    id: 1,
    title: "Flying Over Ancient Forests",
    date: "2024-02-28T08:30:00",
    content: "Soaring above ancient trees, their branches reaching up like fingers trying to touch the sky. The wind carried whispers of forgotten wisdom. As I flew higher, the forest below transformed into a tapestry of emerald and gold, each leaf holding a memory of times long past. The air was crisp and filled with the scent of pine and morning dew.",
    tags: ["flying", "nature", "wisdom"],
    mood: "positive"
  },
  {
    id: 2,
    title: "Ocean's Depths",
    date: "2024-02-27T23:15:00",
    content: "Descending into the deep blue, surrounded by bioluminescent creatures. A golden light emerged from the depths, calling. The water felt warm and welcoming, like being embraced by liquid silk. Schools of ethereal fish swam past, their scales reflecting rainbow patterns that danced through the water.",
    tags: ["water", "light", "mystery"],
    mood: "neutral"
  },
  {
    id: 3,
    title: "The Crystal Cave",
    date: "2024-02-26T03:45:00",
    content: "Walking through a cave filled with crystals of every color. Each one seemed to hold a different memory, a different story. The crystals hummed with an ancient energy, their facets reflecting not just light, but glimpses of other worlds and possibilities. The air was thick with possibility and wonder.",
    tags: ["crystals", "memories", "exploration"],
    mood: "positive"
  }
];

interface DreamGridProps {
  searchQuery?: string;
  selectedDate?: Date;
  selectedTags?: string[];
  sortOrder?: 'newest' | 'oldest';
}

export function DreamGrid({ 
  searchQuery = '', 
  selectedDate,
  selectedTags = [],
  sortOrder = 'newest'
}: DreamGridProps) {
  const [dreams, setDreams] = useState(initialDreams);

  const handleUpdate = (id: number, updatedDream: any) => {
    setDreams(prev => prev.map(dream => 
      dream.id === id ? { ...dream, ...updatedDream } : dream
    ));
  };

  const handleDelete = (id: number) => {
    setDreams(prev => prev.filter(dream => dream.id !== id));
  };

  let filteredDreams = dreams;

  // Apply search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredDreams = filteredDreams.filter(dream =>
      dream.title.toLowerCase().includes(query) ||
      dream.content.toLowerCase().includes(query) ||
      dream.tags.some(tag => tag.toLowerCase().includes(query))
    );
  }

  // Apply date filter
  if (selectedDate) {
    const selectedDateStr = selectedDate.toDateString();
    filteredDreams = filteredDreams.filter(dream =>
      new Date(dream.date).toDateString() === selectedDateStr
    );
  }

  // Apply tags filter
  if (selectedTags.length > 0) {
    filteredDreams = filteredDreams.filter(dream =>
      selectedTags.some(tag => dream.tags.includes(tag))
    );
  }

  // Apply sorting
  filteredDreams = [...filteredDreams].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  return (
    <div className="space-y-4">
      {filteredDreams.map((dream) => (
        <DreamCard 
          key={dream.id} 
          dream={dream}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      ))}
    </div>
  );
}