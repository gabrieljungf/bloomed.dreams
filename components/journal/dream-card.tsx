// components/journal/dream-card.tsx
"use client";

import { X, Pencil, Trash2, Zap, Brain, Link as LinkIcon, Star, Moon } from "lucide-react";
import { CardContainer } from "../dashboard/cards/card-container";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "../ui/dialog";
import { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

// 💫 separador mais etéreo e leve
const DreamscapeSeparator = ({ className }: { className?: string }) => (
  <div
    className={cn(
      "h-px w-full my-5",
      "bg-gradient-to-r from-transparent via-purple-400/20 to-transparent",
      "blur-[0.4px]",
      className
    )}
  />
);

interface DreamCardProps {
  dream: {
    id: string;
    title: string;
    created_at: string;
    content: string;
    tags: string[] | null;
    mood: string | null;
    interpretation?: string | null;
  };
  variant?: "default" | "alt";
  onUpdate?: (id: string, data: any) => void;
  onDelete?: (id: string) => void;
}

// 🌙 linguagem mais simbólica
const moodLabels: Record<string, { label: string; emoji: string }> = {
  serene: { label: "Still Waters", emoji: "🌙" },
  luminous: { label: "Radiant Vision", emoji: "🌕" },
  melancholic: { label: "Fading Echoes", emoji: "🌫️" },
  turbulent: { label: "Restless Tide", emoji: "🌊" },
  uncanny: { label: "Strange Mirror", emoji: "🪞" },
  exhilarating: { label: "Wild Ascent", emoji: "⚡" },
  ominous: { label: "Dark Whisper", emoji: "🌑" },
  introspective: { label: "Inner Journey", emoji: "🕯️" },
};

function fmtCard(d: Date) {
  return `${d.toLocaleDateString("en-US", { month: "short", day: "numeric" })} • ${d.toLocaleTimeString(
    "en-US",
    { hour: "2-digit", minute: "2-digit" }
  )}`;
}
function fmtHeader(d: Date) {
  return d.toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function DreamCard({ dream, variant = "default", onUpdate, onDelete }: DreamCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const moodKey = dream.mood || "serene";
  const mood = moodLabels[moodKey] ?? { label: moodKey, emoji: "✨" };

  const date = new Date(dream.created_at);
  const metaCard = fmtCard(date);
  const metaHeader = fmtHeader(date);

  const preview =
    dream.content.length > 140 ? `${dream.content.slice(0, 140)}…` : dream.content;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}
    >
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        {/* CARD */}
        <div onClick={() => setIsOpen(true)} className="cursor-pointer group">
          <CardContainer
            className={cn(
              "w-full dream-surface relative overflow-hidden",
              "transition-all duration-500 group-hover:scale-[1.01] group-hover:shadow-[0_0_32px_-8px_rgba(180,120,255,0.15)]"
            )}
          >
            <div className="flex items-center justify-between gap-4 min-h-[84px] py-2">
              <div className="flex flex-col justify-center min-w-0 flex-1">
                <p className="text-[11px] text-purple-200/60 uppercase tracking-wider font-medium">
                  {metaCard}
                </p>
                <h3 className="mt-1 text-lg font-display-marcellus text-purple-100 truncate">
                  {dream.title || "Untitled Dream"}
                </h3>
                <p className="mt-1 text-sm text-purple-200/75 leading-relaxed line-clamp-2">
                  {preview}
                </p>
              </div>

              <div className="flex items-center justify-center shrink-0">
                <span
                  className={cn(
                    "glass-pill text-xs px-3 py-1.5 rounded-full",
                    "text-purple-100/90 border border-purple-500/20 bg-purple-500/10"
                  )}
                >
                  {mood.emoji} {mood.label}
                </span>
              </div>
            </div>

            {!!dream.tags?.length && (
              <div className="flex flex-wrap gap-2 pt-3">
                {dream.tags.map((tag, i) => (
                  <span
                    key={i}
                    className="glass-pill text-[11px] px-2.5 py-1 text-purple-200/70 border border-purple-500/10 rounded-full bg-purple-900/20"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </CardContainer>
        </div>

        {/* MODAL */}
        <DialogContent
          className={cn(
            "!rounded-2xl overflow-hidden",
            "bg-gradient-to-b from-[#181025] via-[#130f22] to-[#0e0a17]",
            "border border-purple-500/20 shadow-[0_0_64px_-10px_rgba(150,80,255,0.25)]",
            "p-0 max-w-4xl w-[95vw] h-[90vh] flex flex-col"
          )}
        >
          <DialogHeader
            className={cn(
              "sticky top-0 z-10 rounded-t-2xl flex-row items-center justify-between",
              "p-5 border-b border-purple-500/10",
              "bg-[#181025]/80 backdrop-blur-md"
            )}
          >
            <div className="text-left">
              <DialogTitle className="text-2xl font-display-marcellus text-purple-100 tracking-wide">
                {dream.title || "Untitled Dream"}
              </DialogTitle>
              <DialogDescription className="text-[11px] text-purple-300/60">
                {metaHeader}
              </DialogDescription>
            </div>
            <div className="flex items-center gap-1.5">
              <Button variant="ghost" size="icon" className="h-9 w-9 text-purple-300/80 hover:text-purple-100">
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="h-9 w-9 text-red-400/80 hover:text-red-300">
                <Trash2 className="w-4 h-4" />
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" size="icon" className="h-9 w-9 text-purple-300/70 hover:text-purple-100">
                  <X className="w-4 h-4" />
                </Button>
              </DialogClose>
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-2">
            {/* Left column */}
            <div className="p-6 flex flex-col gap-6 md:overflow-y-auto custom-scrollbar">
              <section>
                <h3 className="flex items-center gap-2 font-display-marcellus text-purple-200/80 mb-3 text-[18px] tracking-wide">
                  <Moon className="w-4 h-4" /> Your Dream
                </h3>
                <p className="text-purple-100/90 whitespace-pre-wrap leading-relaxed text-[13px] font-light">
                  {dream.content}
                </p>
              </section>

              <DreamscapeSeparator />

              <section>
                <h4 className="flex items-center gap-2 font-display-marcellus text-purple-200/80 mb-3 text-[18px] tracking-wide">
                  <Star className="w-4 h-4" /> Key Symbols & Feelings
                </h4>
                <div className="space-y-4">
                  <div>
                    <p className="text-xs text-purple-300/60 mb-2">Primary Mood</p>
                    <span className="inline-flex items-center gap-2 text-2xs px-2 py-1.5 rounded-full border border-purple-500/10 bg-purple-900/30 text-purple-100/90">
                      {mood.emoji} {mood.label}
                    </span>
                  </div>
                  {!!dream.tags?.length && (
                    <div>
                      <p className="text-xs text-purple-300/60 mb-2">Symbols Detected</p>
                      <div className="flex flex-wrap gap-2">
                        {dream.tags.map((tag, i) => (
                          <span key={i} className="inline-flex items-center text-2xs px-2 py-1 rounded-full border border-purple-500/10 bg-purple-900/30 text-purple-100/90">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </section>
              <DreamscapeSeparator className="md:hidden" />
            </div>

            {/* Right column */}
            <div className="p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 md:border-l md:border-purple-500/10 md:pl-6">
              <section>
                <h3 className="flex items-center gap-2 font-display-marcellus text-purple-200/80 mb-3 text-[18px] tracking-wide">
                  <Zap className="w-4 h-4" /> Interpretation
                </h3>
                <div
                  className={cn(
                    "text-[13px] leading-6 text-purple-100/85 font-light",
                    "[&_p]:mb-3 [&_p:last-child]:mb-0 [&_a]:underline [&_a]:underline-offset-2"
                  )}
                >
                  {dream.interpretation ? (
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {dream.interpretation}
                    </ReactMarkdown>
                  ) : (
                    <p className="italic opacity-70">No interpretation available yet.</p>
                  )}
                </div>
              </section>

              <DreamscapeSeparator />

              <section>
                <h3 className="flex items-center gap-2 font-display-marcellus text-purple-200/80 mb-3 text-[18px] tracking-wide">
                  <Brain className="w-4 h-4" /> Potential Themes
                </h3>
                <p className="text-[12px] text-purple-300/55 italic">
                  Pattern recognition coming soon.
                </p>
              </section>

              <DreamscapeSeparator />

              <section>
                <h3 className="flex items-center gap-2 font-display-marcellus text-purple-200/80 mb-3 text-[18px] tracking-wide">
                  <LinkIcon className="w-4 h-4" /> Dream Connections
                </h3>
                <p className="text-[12px] text-purple-300/55 italic">
                  Soon you’ll see echoes between your dreams.
                </p>
              </section>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
