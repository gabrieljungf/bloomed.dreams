// FILE: src/components/chat/chat-widget.tsx
"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo, ReactNode, HTMLAttributes } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from 'react-textarea-autosize';
import { Button } from "@/components/ui/button";
import { X, Send, Loader2, Moon, Sparkles, Copy, Heart } from "lucide-react";
import { toast } from "sonner";
import ReactMarkdown, { Components } from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { v4 as uuidv4 } from 'uuid';
import { useDreamStore } from "@/hooks/use-dream-store";
import { useAuth } from "@/components/auth/auth-provider";

interface Message {
  id: string;
  text: string;
  isUser: boolean; // Correctly cased here
  timestamp: Date;
}

interface N8NRawResponse {
  output?: string;
  error?: string;
}

interface CosmicDreamDecoderProps {
  isOpenProp: boolean;
  onClose: () => void;
  initialDream?: string | null;
}

const customMarkdownComponents: Components = {
  // Seus componentes existentes:
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

  // --- ADIÇÃO PARA ESTILIZAR LINKS ---
  a: ({node, href, ...props}) => (
    <a
      href={href} // É importante passar o href para o elemento <a>
      {...props} // Passa outras props como 'children' (o texto do link)
      className="text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
      target={href && (href.startsWith('http://') || href.startsWith('https://')) ? '_blank' : undefined}
      rel={href && (href.startsWith('http://') || href.startsWith('https://')) ? 'noopener noreferrer' : undefined}
    />
  ),
  // --- FIM DA ADIÇÃO PARA LINKS ---
};


export function ChatWidget({ // This component is exported
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
  const { addDream } = useDreamStore();
  const { user } = useAuth();


  useEffect(() => {
    if (isOpenProp && !sessionId) {
      const newSessionId = uuidv4();
      setSessionId(newSessionId);
      console.log("ChatWidget: Generated new sessionId:", newSessionId);
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
      console.error('ChatWidget: Failed to copy text: ', err);
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
    console.log(`ChatWidget: sendDreamToAPI called for userMessageId: ${userMessageId}. Current isLoading: ${isLoading}`);
    const apiEndpoint = '/api/dream';

    if (!sessionId) {
      toast.error("Session ID is missing. Please try reopening the chat.");
      setIsLoading(false);
      console.log("ChatWidget: sendDreamToAPI bailing - no sessionId. isLoading set to false.");
      return;
    }

    if (abortControllerRef.current) {
      console.log("ChatWidget: sendDreamToAPI - Aborting previous request.");
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;
    console.log("ChatWidget: sendDreamToAPI - New AbortController created and assigned.");

    setIsLoading(true);
    console.log("ChatWidget: sendDreamToAPI - isLoading set to true.");

    try {
      console.log("ChatWidget: sendDreamToAPI - Fetching API...");
      const response = await fetch(apiEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          dreamText,
          timestamp: new Date().toISOString(),
          sessionId: sessionId,
        }),
        signal: controller.signal,
      });

      if (controller.signal.aborted) {
        console.log(`ChatWidget: sendDreamToAPI - Request aborted during fetch for userMessageId: ${userMessageId}.`);
        return;
      }
      console.log(`ChatWidget: sendDreamToAPI - API response status: ${response.status}`);

      if (!response.ok) {
        let errorMsg = `API Error: ${response.status}`;
        let responseDataForError: any = null;
        try {
            responseDataForError = await response.json();
            errorMsg = responseDataForError?.error || responseDataForError?.message || `Request Failed (${response.status})`;
        } catch (e) {
            // Se o corpo do erro não for JSON, errorMsg já contém o status.
            console.warn("ChatWidget: Could not parse error response as JSON for !response.ok.", e);
        }

        // --- TRATAMENTO ESPECÍFICO PARA RATE LIMIT (429) ---
        if (response.status === 429) {
          const scope = responseDataForError?.scope || '';
          const fallback = responseDataForError?.error || "You've reached your usage limit.";

          let userFriendlyMessage = fallback;

          if (scope === 'hourly') {
            userFriendlyMessage = "You’ve reached the hourly dream limit (5 per hour). Try again in a few minutes — your credits refill gradually.";
          } else if (scope === 'daily') {
            userFriendlyMessage = "You’ve reached the daily dream limit (10 per day). Come back tomorrow to continue exploring. ✨";
          }

          const messageWithLinkInChat = `${userFriendlyMessage} Want unlimited interpretations, a place to save your dreams, and a guide that’s always by your side? [Click here to join our waitlist!](/waitlist)`;

          toast.error(userFriendlyMessage);

          setMessages((prev) => [
            ...prev,
            {
              id: `error-rate-limit-${userMessageId}`,
              text: messageWithLinkInChat,
              isUser: false,
              timestamp: new Date(),
            },
          ]);

          return;
        }
        // --- FIM DO TRATAMENTO DE RATE LIMIT ---

        // Se não for 429, mas ainda !response.ok, lance o erro para ser pego pelo catch principal
        throw new Error(errorMsg);
      }

      const responseData = await response.json();
      const { interpretation, savedDream } = responseData;

      if (user && savedDream) {
        addDream(savedDream);
        console.log("Dream added to the global store, triggering UI update.");
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${userMessageId}`,
          text: interpretation || "Your dream has been saved to your journal.",
          isUser: false,
          timestamp: new Date(),
        },
      ]);

    } catch (error: any) {
      if (controller.signal.aborted) {
        console.log(`ChatWidget: sendDreamToAPI - Request aborted (caught in catch block) for userMessageId: ${userMessageId}.`);
      } else {
        console.error("ChatWidget: Dream interpretation error (via API route):", error);
        const errorText = error instanceof Error ? error.message : "An unknown error occurred.";
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
      }
    } finally {
      console.log(`ChatWidget: sendDreamToAPI - Finally block. Current controller is ${abortControllerRef.current === controller ? 'SAME' : 'DIFFERENT/NULL'}. This request's controller signal aborted: ${controller.signal.aborted}`);
      if (abortControllerRef.current === controller) {
         setIsLoading(false);
         abortControllerRef.current = null;
         console.log("ChatWidget: sendDreamToAPI - Finally: isLoading set to false, current abortController cleared.");
      } else {
         console.log("ChatWidget: sendDreamToAPI - Finally: Active controller was different; not changing isLoading or abortControllerRef for this old/aborted request.");
      }
    }
  }, [sessionId, addDream, user]);

  useEffect(() => {
    console.log(`ChatWidget: useEffect[isOpenProp] changed. isOpenProp: ${isOpenProp}. Current isLoading: ${isLoading}, processedInitialDream: "${processedInitialDream}", messages.length: ${messages.length}, initialDream: "${initialDream}"`);
    if (!isOpenProp) {
      console.log("ChatWidget: useEffect[isOpenProp] - Closing. AbortController was:", abortControllerRef.current ? "active" : "null");
    } else {
      if (messages.length === 0 && !initialDream && !processedInitialDream) {
        console.log("ChatWidget: useEffect[isOpenProp] - Opening, displaying welcome message.");
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
      if (initialDream && initialDream !== processedInitialDream && sessionId) {
        console.log(`ChatWidget: useEffect[isOpenProp] - Opening, processing initialDream: "${initialDream}".`);
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
      } else if (initialDream && initialDream === processedInitialDream) {
          console.log(`ChatWidget: useEffect[isOpenProp] - Opening, initialDream ("${initialDream}") is same as processedInitialDream. Not re-processing.`);
      }
    }
  }, [isOpenProp, initialDream, processedInitialDream, sessionId, messages.length, sendDreamToAPI, isLoading]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        console.log("ChatWidget: Unmounting, aborting active request.");
        abortControllerRef.current.abort();
        abortControllerRef.current = null;
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    console.log(`ChatWidget: handleClose called. Current isLoading: ${isLoading}. AbortController active: ${!!abortControllerRef.current}`);
    if (abortControllerRef.current) {
      console.log("ChatWidget: Aborting active request via handleClose.");
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setIsLoading(false);
    console.log("ChatWidget: isLoading set to false by handleClose.");
    if (initialDream && processedInitialDream === initialDream) {
        console.log("ChatWidget: handleClose - initialDream was the one being processed. Current value of initialDream prop: ", initialDream);
    }
    onClose();
    console.log("ChatWidget: onClose prop has been called by handleClose.");
  }, [onClose, isLoading, initialDream, processedInitialDream]);

  const handleChatSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`ChatWidget: handleChatSubmit. isLoading: ${isLoading}, message: "${message.trim()}"`);
    const trimmedMessage = message.trim();

    if (isLoading) {
        console.log("ChatWidget: handleChatSubmit - bailing, isLoading is true.");
        toast.info("Please wait, previous request is processing.");
        return;
    }
    if (!trimmedMessage) {
      toast.info("Please describe your dream first.");
      return;
    }
    if (!sessionId) {
      toast.error("Session ID is missing. Cannot send message.");
      console.log("ChatWidget: handleChatSubmit - bailing, no sessionId.");
      return;
    }

    const userMessageId = `user-${Date.now()}`;
    const newMessageInstance: Message = {
      id: userMessageId, text: trimmedMessage, isUser: true, timestamp: new Date()
    };
    setMessages((prev) => [...prev, newMessageInstance]);
    setMessage("");
    await sendDreamToAPI(trimmedMessage, userMessageId);
  }, [message, isLoading, sendDreamToAPI, sessionId]);

  const stars = useMemo(() => {
    return [...Array(80)].map((_, i) => ({
      key: i, style: { top: `${Math.random() * 100}%`, left: `${Math.random() * 100}%`, width: `${Math.random() * 1.5 + 0.5}px`, height: `${Math.random() * 1.5 + 0.5}px`, animationDelay: `${Math.random() * 5}s`, animationDuration:`${Math.random() * 5 + 5}s`}
    }));
  }, []);

  useEffect(() => {
    console.log(`ChatWidget: isLoading state changed to: ${isLoading}`);
  }, [isLoading]);

  // This log is fine as it's outside the JSX return
  console.log("ChatWidget RENDER: isLoading =", isLoading, "message =", message, "isOpenProp =", isOpenProp, "initialDream =", initialDream, "processedInitialDream=", processedInitialDream);

  // Helper for JSX logging - returns null so it's a valid ReactNode
  const jsxLog = (logMessage: string, ...args: any[]): null => {
    console.log(logMessage, ...args);
    return null;
  };

  return (
    <AnimatePresence>
      {isOpenProp && (
        <motion.div
          key="chatWidgetRoot"
          className="fixed right-2 bottom-2 sm:right-6 sm:bottom-6 z-[100] w-[90vw] sm:w-[21rem] h-[85vh] sm:h-[550px] max-h-[calc(100vh-3rem)] rounded-2xl border border-[#9d6bff]/20 overflow-hidden flex flex-col bg-gradient-to-br from-[#1e1133] to-[#2a1a46]/95 shadow-[#9d6bff]/30 shadow-2xl backdrop-blur-lg"
          /* ---------- ENTRADA ---------- */
          initial={{ opacity: 0, y: 50, scale: 0.9, display: 'flex' }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            display: 'flex',         // garante que volta a aparecer
            pointerEvents: 'auto',   // ← *** volta a aceitar cliques ***
          }}
          /* ---------- SAÍDA ---------- */
          exit={{
            opacity: 0,
            y: 50,
            scale: 0.9,
            transition: { duration: 0.25 },
            transitionEnd: {
              pointerEvents: 'none', // bloqueia cliques só DEPOIS da animação
              display: 'none',       // remove do fluxo
            },
          }}
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

          <div className="relative flex-grow overflow-y-auto p-4 space-y-4 z-10 scrollbar-thin scrollbar-thumb-[#9d6bff]/40 hover:scrollbar-thumb-[#9d6bff]/60 scrollbar-track-transparent overscroll-behavior-contain">
            {messages.map((msg) => (
              <motion.div key={msg.id} layout="position" initial={{ opacity: 0, y: 15, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 260, damping: 20 } }} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}> {/* CORRECTED: msg.isUser */}
                <div id={msg.id} className={`group relative max-w-[85%] px-3 py-2 rounded-3xl text-xs leading-relaxed shadow-md ${msg.isUser ? "bg-gradient-to-br from-[#a87aff] to-[#8a5ae0] text-white rounded-tr-none" : "bg-[#351d5e] border border-[#9d6bff]/20 text-[#e0d1ff] rounded-tl-none"} ${msg.id.startsWith('error-') ? 'border-red-500/40' : '' }`} style={{ boxShadow: msg.isUser ? "0 3px 10px rgba(157, 107, 255, 0.3)" : "0 2px 8px rgba(0, 0, 0, 0.2)", overflowWrap: 'break-word' }}> {/* CORRECTED: msg.isUser */}
                  <div className={`prose prose-sm prose-invert max-w-none ${msg.id.startsWith('error-') ? 'prose-p:text-red-300/90' : ''}`}>
                      <ReactMarkdown remarkPlugins={[remarkGfm]} components={customMarkdownComponents}>{msg.text}</ReactMarkdown>
                  </div>
                  {!msg.isUser && ( /* CORRECTED: !msg.isUser */
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
                  {msg.isUser && ( <p className="text-[9px] text-white/60 mt-1.5 text-right">{msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p> )} {/* CORRECTED: msg.isUser */}
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
          
          {/* CORRECTED JSX LOGGING APPROACH */}
          {jsxLog("ChatWidget FORM RENDER: isLoading =", isLoading, "message empty =", !message.trim())}
          <form onSubmit={handleChatSubmit} className="sticky bottom-0 z-10 border-t border-[#9d6bff]/20 bg-gradient-to-t from-[#2a1a46]/80 to-[#2a1a46]/50 backdrop-blur-sm">
            <div className="p-4 flex items-end gap-3">
              {jsxLog("ChatWidget TEXTAREA RENDER: isLoading =", isLoading)}
              <TextareaAutosize
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Describe your dream..."
                className={cn(
                  "flex-grow resize-none shadow-inner scrollbar-thin scrollbar-thumb-[#9d6bff]/30 scrollbar-track-transparent transition-colors duration-200",
                  "bg-[#1e1133]/60 border border-[#9d6bff]/30 text-[#e0d1ff] placeholder-[#c4a8ff]/50",
                  "focus:ring-2 focus:ring-[#9d6bff]/50 focus:border-[#9d6bff]/50 focus:outline-none",
                  "py-2.5 px-4 rounded-3xl text-base sm:text-sm"
                )}
                minRows={1} maxRows={5}
                onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleChatSubmit(e as unknown as React.FormEvent); }}}
                aria-label="Enter your dream description"
                disabled={isLoading}
              />
              {jsxLog("ChatWidget BUTTON RENDER: isLoading =", isLoading, "message empty =", !message.trim())}
              <Button type="submit" disabled={isLoading || !message.trim()} className="h-9 w-9 p-0 flex-shrink-0 bg-gradient-to-br from-[#8a5ae0] to-[#9d6bff] hover:from-[#7f4fe0] hover:to-[#8f5ae0] text-white disabled:bg-gradient-to-br disabled:from-[#5c4b8e]/70 disabled:to-[#5c4b8e]/70 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 rounded-3xl flex items-center justify-center shadow-md hover:shadow-lg hover:shadow-[#9d6bff]/30 disabled:shadow-none focus-visible:ring-2 focus-visible:ring-[#c4a8ff] focus-visible:ring-offset-2 focus-visible:ring-offset-[#2a1a46]" aria-label="Send dream">
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </Button>
            </div>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// ChatToggleButton was missing from the previous full file, adding it back.
export function ChatToggleButton({ onClick }: { onClick: () => void }) {
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
      <Moon className="w-5 h-5" />
    </motion.button>
  );
}