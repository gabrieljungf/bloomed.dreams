// FILE: src/components/chat/chat-widget.tsx
"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo, ReactNode, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "@/components/ui/button";
import { X, Send, Loader2, Moon, Sparkles, Copy, Heart } from "lucide-react"; // Removido Mic, LinkIcon se não usados
import { toast } from "sonner";
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils'; // Importar cn
import { v4 as uuidv4 } from 'uuid';

// Interfaces
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface N8NRawResponse {
  output?: string;
  error?: string; // Certifique-se que seu /api/dream retorna isso em caso de erro do N8N
}

interface CosmicDreamDecoderProps {
  isOpenProp: boolean;
  onClose: () => void;
  initialDream?: string | null;
}

const customMarkdownComponents: Components = {
  p: ({node, ...props}) => <p className="mb-1 last:mb-0" {...props} />,
  ul: ({node, ...props}) => <ul className="my-1 pl-4 list-disc" {...props} />,
  ol: ({node, ...props}) => <ol className="my-1 pl-4 list-decimal" {...props} />,
  li: ({node, ...props}) => <li className="mb-1" {...props} />,
  code: ({
      node, inline, className, children, ...props
  } : {
      node?: any; inline?: boolean; className?: string; children?: ReactNode;
  } & HTMLAttributes<HTMLElement> ) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
          <pre className="my-1 rounded bg-black/20 p-0 overflow-x-auto">
              <code className={`block p-2 text-xs font-mono ${className || ''}`} {...props}>
                  {children}
              </code>
          </pre>
      ) : (
          <code className={`bg-[#9d6bff]/20 px-1 py-0.5 rounded text-xs font-mono ${className || ''}`} {...props}>
              {children}
          </code>
      );
  },
};

export function ChatWidget({
  isOpenProp,
  onClose,
  initialDream
}: CosmicDreamDecoderProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [copyTooltip, setCopyTooltip] = useState<string | null>(null);
  const [likedMessages, setLikedMessages] = useState<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [processedInitialDream, setProcessedInitialDream] = useState<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  // A URL do N8N não é mais lida diretamente do process.env aqui
  // const n8nWebhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL; // REMOVIDO

  useEffect(() => {
    if (isOpenProp && !sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      console.log("Generated new sessionId:", newSessionId);
    }
  }, [isOpenProp, sessionId]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyTooltip(id);
      setTimeout(() => setCopyTooltip(null), 1500);
    }).catch(err => {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy message');
    });
  };

  const handleLikeToggle = (id: string) => {
    setLikedMessages(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const sendDreamToAPI = useCallback(async (dreamText: string, userMessageId: string) => {
    const apiEndpoint = '/api/dream'; // Chamar nosso backend Next.js

    if (!sessionId) {
      toast.error("Session ID is missing. Please try reopening the chat.");
      setIsLoading(false);
      return;
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, { // Usar apiEndpoint
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          dreamText,
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        }),
        signal: abortControllerRef.current.signal,
      });

      if (!response.ok) {
        let errorMsg = `API Error: ${response.status}`;
        try {
            const errorData = await response.json(); // Tenta ler o corpo do erro como JSON
            errorMsg = errorData.error || errorData.message || `Request Failed (${response.status})`;
        } catch { /* Ignora erro de parse, usa a mensagem com status */ }
        throw new Error(errorMsg);
      }

      // A resposta do nosso /api/dream deve ter o mesmo formato que o N8N retornava
      const rawText = await response.text();
      let parsedData: N8NRawResponse | null = null;
      try {
        parsedData = JSON.parse(rawText);
      } catch (parseError) {
        console.error("Failed to parse API response:", parseError, "\nRaw Text:", rawText);
        throw new Error("Received an invalid response format from the API.");
      }

      if (parsedData?.error) {
        throw new Error(parsedData.error);
      }

      const interpretation = parsedData?.output;
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${userMessageId}`,
          text: interpretation || "Hmm, I received a response, but couldn't extract a clear interpretation. Could you try phrasing your dream differently?",
          isUser: false,
          timestamp: new Date(),
        },
      ]);

    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
        return;
      }
      console.error("Dream interpretation error (via API route):", error);
      const errorText = error instanceof Error ? error.message : "An unknown error occurred.";
      // A mensagem de erro do toast agora pode vir do nosso backend ou do N8N
      toast.error(`Interpretation failed: ${errorText}`);
      setMessages((prev) => [
        ...prev,
        {
          id: `error-api-${userMessageId}`,
          text: `Sorry, I couldn't decode the dream right now. Please try again later.`,
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } finally {
      if (abortControllerRef.current && !abortControllerRef.current.signal.aborted) {
         setIsLoading(false);
         abortControllerRef.current = null;
      }
    }
  }, [sessionId]); // Removido n8nWebhookUrl das dependências

  useEffect(() => {
    if (isOpenProp && messages.length === 0 && !initialDream && !processedInitialDream) {
      setMessages([
        {
          id: "welcome",
          text: "Welcome to the **Dream Decoder**! ✨ Share your dream, and let's explore its hidden depths together.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setProcessedInitialDream(null);
      setLikedMessages(new Set());
    }
  }, [isOpenProp, initialDream, messages.length, processedInitialDream]);

  useEffect(() => {
    if (isOpenProp && initialDream && initialDream !== processedInitialDream && sessionId) {
      const userMessageId = `user-initial-${Date.now()}`;
      const newUserMessage: Message = {
        id: userMessageId, text: initialDream, isUser: true, timestamp: new Date()
      };
      setMessages(prev => {
         const filtered = prev.filter(msg => msg.id !== 'welcome');
         return [...filtered, newUserMessage];
      });
      setProcessedInitialDream(initialDream);
      setMessage("");
      sendDreamToAPI(initialDream, userMessageId);
    }
  }, [isOpenProp, initialDream, processedInitialDream, sendDreamToAPI, sessionId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort();
    };
  }, []);

  const handleClose = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsLoading(false);
    onClose();
  }, [onClose]);

  const handleChatSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) {
      if (!trimmedMessage) toast.info("Please describe your dream first.");
      return;
    }
    if (!sessionId) {
      toast.error("Session ID is missing. Cannot send message.");
      return;
    }
    const userMessageId = `user-${Date.now()}`;
    const newMessage: Message = {
      id: userMessageId, text: trimmedMessage, isUser: true, timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessage]);
    setMessage("");
    await sendDreamToAPI(trimmedMessage, userMessageId);
  }, [message, isLoading, sendDreamToAPI, sessionId]);

  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      key: i, style: { top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${Math.random() * 1.5 + 0.5}px`, height: `${Math.random() * 1.5 + 0.5}px`, animationDelay: `${Math.random() * 5}s`, animationDuration:`${Math.random() * 5 + 5}s`}
    }));
  }, []);

  return (
    <AnimatePresence>
      {isOpenProp && (
        <motion.div /* ... motion props ... */
          className="fixed right-2 bottom-2 sm:right-6 sm:bottom-6 z-[100] w-[90vw] sm:w-[21rem] h-[85vh] sm:h-[550px] max-h-[calc(100vh-3rem)] rounded-2xl border border-[#9d6bff]/20 overflow-hidden flex flex-col bg-gradient-to-br from-[#1e1133] to-[#2a1a46]/95 shadow-[#9d6bff]/30 shadow-2xl backdrop-blur-lg"
        >
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {stars.map(({ key, style }) => ( <div key={key} className="absolute rounded-full bg-white/70 animate-twinkle" style={style} /> ))}
          </div>
          <div className="relative flex items-center justify-between px-3 py-2 sm:px-4 sm:py-3 border-b border-[#9d6bff]/20 z-10 flex-shrink-0 bg-gradient-to-b from-[#2a1a46]/80 to-[#2a1a46]/50 backdrop-blur-sm">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 bg-gradient-to-br from-[#9d6bff]/30 to-[#c4a8ff]/20 rounded-full shadow-inner">
                <Moon className="w-4 h-4 text-[#e0d1ff]" />
              </div>
              <h3 className="text-base font-medium text-[#e0d1ff]">Dream Decoder</h3>
            </div>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-9 w-9 sm:h-8 sm:w-8 text-[#c4a8ff] hover:text-white hover:bg-[#9d6bff]/30 rounded-full focus-visible:ring-2 focus-visible:ring-[#c4a8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a46]" aria-label="Close Chat">
              <X className="w-4 h-4" />
            </Button>
          </div>
          <div className="relative flex-grow overflow-y-auto p-4 space-y-4 z-10 scrollbar-thin scrollbar-thumb-[#9d6bff]/40 hover:scrollbar-thumb-[#9d6bff]/60 scrollbar-track-transparent">
            {messages.map((msg) => (
              <motion.div key={msg.id} layout="position" initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
                <div id={msg.id} className={`group relative max-w-[85%] px-3 py-2 rounded-3xl text-xs leading-relaxed shadow-md ${msg.isUser ? "bg-gradient-to-br from-[#a87aff] to-[#8a5ae0] text-white rounded-tr-none" : "bg-[#351d5e] border border-[#9d6bff]/20 text-[#e0d1ff] rounded-tl-none"} ${msg.id.startsWith('error-') ? 'border-red-500/40' : '' }`} style={{ boxShadow: msg.isUser ? "0 3px 10px rgba(157, 107, 255, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.2)", overflowWrap: 'break-word' }}>
                  <div className={`prose prose-sm prose-invert max-w-none ${msg.id.startsWith('error-') ? 'prose-p:text-red-300/90' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customMarkdownComponents}>{msg.text}</ReactMarkdown>
                  </div>
                  {!msg.isUser && (
                    <div className={`mt-2 pt-1.5 border-t ${msg.id.startsWith('error-') ? 'border-red-500/20' : 'border-[#9d6bff]/20'} flex justify-between items-center text-[9px] text-[#c4a8ff]/70`}>
                      <span>{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                      {!msg.id.startsWith('error-') && (
                        <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button onClick={() => handleCopy(msg.text, msg.id)} className="p-1 hover:text-[#e0d1ff] relative rounded-full hover:bg-[#9d6bff]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c4a8ff]" aria-label="Copy interpretation">
                            <Copy className="w-3 h-3" />
                            {copyTooltip === msg.id && ( <motion.span initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="absolute -top-7 left-1/2 transform -translate-x-1/2 bg-[#1e1133] px-2 py-1 rounded text-[9px] whitespace-nowrap shadow-lg border border-[#9d6bff]/20">Copied!</motion.span> )}
                          </button>
                          <button onClick={() => handleLikeToggle(msg.id)} className={`p-1 rounded-full hover:bg-[#9d6bff]/20 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#c4a8ff] ${likedMessages.has(msg.id) ? 'text-[#ff8f8f]' : 'hover:text-[#ffc7c7]'}`} aria-label={likedMessages.has(msg.id) ? "Unlike interpretation" : "Like interpretation"}>
                            <Heart className={`w-3 h-3 transition-colors ${likedMessages.has(msg.id) ? 'fill-current' : ''}`} />
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                  {msg.isUser && ( <p className="text-[9px] text-white/60 mt-1.5 text-right">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p> )}
                </div>
              </motion.div>
            ))}
            {isLoading && (
              <motion.div layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex justify-start">
                <div className="flex items-center space-x-2 p-3 rounded-lg bg-[#2a1a46]/70 border border-[#9d6bff]/10 backdrop-blur-sm shadow-md">
                  <motion.div className="w-1.5 h-1.5 bg-[#c4a8ff] rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut" }} />
                  <motion.div className="w-1.5 h-1.5 bg-[#c4a8ff] rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.2 }} />
                  <motion.div className="w-1.5 h-1.5 bg-[#c4a8ff] rounded-full" animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 0.8, repeat: Infinity, ease: "easeInOut", delay: 0.4 }} />
                  <span className="text-xs text-[#c4a8ff]/90 pl-1">Decoding...</span>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} className="h-1" />
          </div>
          <form onSubmit={handleChatSubmit} className="sticky bottom-0 z-10 border-t border-[#9d6bff]/20 bg-gradient-to-t from-[#2a1a46]/80 to-[#2a1a46]/50 backdrop-blur-sm">
            <div className="p-4 flex items-end gap-3">
              <TextareaAutosize
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your dream..."
                className={cn( // Aplicando cn para facilitar a leitura e adição de classes
                  "flex-grow resize-none shadow-inner scrollbar-thin scrollbar-thumb-[#9d6bff]/30 scrollbar-track-transparent transition-colors duration-200",
                  "bg-[#1e1133]/60 border border-[#9d6bff]/30 text-[#e0d1ff] placeholder-[#c4a8ff]/50",
                  "focus:ring-2 focus:ring-[#9d6bff]/50 focus:border-[#9d6bff]/50 focus:outline-none",
                  "py-2.5 px-4 rounded-3xl",
                  // --- AJUSTE DE TAMANHO DE FONTE RESPONSIVO ---
                  "text-base", // Base para mobile (16px para evitar zoom)
                  "sm:text-sm"  // Em telas 'sm' e maiores, text-sm (14px)
                                // Considere sm:text-xs se quiser ainda menor em desktop
                )}
                minRows={1}
                maxRows={5}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleChatSubmit(e as unknown as React.FormEvent);
                  }
                }}
                aria-label="Enter your dream description"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !message.trim()} className="h-9 w-9 p-0 flex-shrink-0 bg-gradient-to-br from-[#8a5ae0] to-[#9d6bff] hover:from-[#7f4fe0] hover:to-[#8f5ae0] text-white disabled:bg-gradient-to-br disabled:from-[#5c4b8e]/70 disabled:to-[#5c4b8e]/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 rounded-3xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-[#9d6bff]/30 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-[#c4a8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a46]" aria-label="Send dream">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </form>
          <style jsx global>{` /* ... seus estilos globais ... */ `}</style>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ChatToggleButton({ onClick }: { onClick: () => void }) {
  // ... (código do botão de toggle)
  return (
    <motion.button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-[90] text-[#e0d1ff] p-3.5 rounded-full shadow-xl hover:shadow-[#9d6bff]/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c4a8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#1e1133]"
      style={{
        background: "linear-gradient(135deg, #2a1a46 0%, #3a1a66 100%)",
        boxShadow: "0 10px 25px rgba(157, 107, 255, 0.3)",
      }}
      whileHover={{ scale: 1.08, rotate: 8, transition: { type: 'spring', stiffness: 300, damping: 15 } }}
      whileTap={{ scale: 0.95 }}
      initial={{ opacity: 0, scale: 0.5, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0, transition: { delay: 0.2, duration: 0.3, ease: "easeOut" } }}
      aria-label="Open Dream Decoder"
    >
      <Sparkles className="w-5 h-5" />
    </motion.button>
  );
}