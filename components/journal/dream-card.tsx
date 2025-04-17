"use client";

import { Pencil, Trash2 } from 'lucide-react';
import { CardContainer } from '../dashboard/cards/card-container';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useState } from 'react';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface DreamCardProps {
  dream: {
    id: number;
    title: string;
    date: string;
    content: string;
    tags: string[];
    mood: string;
  };
  onUpdate?: (id: number, data: any) => void;
  onDelete?: (id: number) => void;
}

export function DreamCard({ dream, onUpdate, onDelete }: DreamCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(dream.content);
  const [editedTags, setEditedTags] = useState(dream.tags.join(', '));
  const [isOpen, setIsOpen] = useState(false);

  const handleSave = () => {
    const updatedDream = {
      ...dream,
      content: editedContent,
      tags: editedTags.split(',').map(tag => tag.trim()).filter(Boolean)
    };
    onUpdate?.(dream.id, updatedDream);
    setIsEditing(false);
  };

  const handleDelete = () => {
    onDelete?.(dream.id);
    setIsOpen(false);
  };

  const truncatedContent = dream.content.split('.')[0] + '...';
  const formattedDate = new Date(dream.date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <div className="cursor-pointer" onClick={() => setIsOpen(true)}>
          <CardContainer>
            <div className="space-y-4">
              {/* Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <h3 className="text-lg font-medium text-purple-100">{dream.title}</h3>
                  <p className="text-xs text-purple-200/60">{formattedDate}</p>
                </div>
                <span className="text-xs text-purple-200/80 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20">
                  {dream.mood}
                </span>
              </div>

              {/* Content */}
              <p className="text-sm text-purple-200/80">
                {truncatedContent}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {dream.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="text-xs px-2 py-1 rounded-full 
                      bg-purple-500/10 text-purple-200/70
                      border border-purple-500/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </CardContainer>
        </div>

        <DialogContent className="bg-gradient-to-b from-black/95 via-purple-900/20 to-black/95 backdrop-blur-xl border-purple-500/20">
          <DialogHeader>
            <DialogTitle className="text-2xl font-display">{dream.title}</DialogTitle>
            <div className="text-xs text-purple-200/60">{formattedDate}</div>
          </DialogHeader>

          <div className="space-y-6 py-4">
            {isEditing ? (
              <div className="space-y-4">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[200px] bg-black/40 border-purple-500/20"
                />
                <div className="space-y-2">
                  <label className="text-sm text-purple-200/80">Tags (comma-separated)</label>
                  <Input
                    value={editedTags}
                    onChange={(e) => setEditedTags(e.target.value)}
                    className="bg-black/40 border-purple-500/20"
                    placeholder="nature, flying, wisdom"
                  />
                </div>
              </div>
            ) : (
              <p className="text-purple-200/80 whitespace-pre-wrap">{dream.content}</p>
            )}

            <div className="flex flex-wrap gap-2">
              {dream.tags.map((tag, index) => (
                <span
                  key={index}
                  className="text-xs px-2 py-1 rounded-full 
                    bg-purple-500/10 text-purple-200/70
                    border border-purple-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>

            <div className="flex justify-end gap-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    className="border-purple-500/20"
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSave}>Save Changes</Button>
                </>
              ) : (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="border-purple-500/20"
                  >
                    <Pencil className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleDelete}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}