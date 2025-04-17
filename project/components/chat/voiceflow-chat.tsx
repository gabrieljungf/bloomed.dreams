"use client";

import { useEffect } from 'react';
import Script from 'next/script';

declare global {
  interface Window {
    voiceflow: {
      chat: {
        load: (config: any) => void;
        open: () => void;
        close: () => void;
        hide: () => void;
        show: () => void;
        interact: (action: any) => void;
        proactive: {
          push: (...messages: any[]) => void;
          clear: () => void;
        };
      };
    };
  }
}

export function VoiceflowChat() {
  useEffect(() => {
    // Initialize chat when component mounts
    const initChat = () => {
      if (window.voiceflow?.chat) {
        window.voiceflow.chat.load({
          verify: { 
            projectID: process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID 
          },
          url: process.env.NEXT_PUBLIC_VOICEFLOW_RUNTIME_URL || 'https://general-runtime.voiceflow.com',
          versionID: process.env.NEXT_PUBLIC_VOICEFLOW_VERSION_ID || 'development',
          assistant: {
            title: 'Dream Guide',
            description: 'Your personal dream interpretation assistant',
            color: '#8B5CF6',
          }
        });
      }
    };

    // Try to initialize immediately if script is already loaded
    initChat();

    return () => {
      // Hide chat when component unmounts
      window.voiceflow?.chat?.hide();
    };
  }, []);

  return (
    <Script
      src="https://cdn.voiceflow.com/widget/bundle.mjs"
      strategy="afterInteractive"
      onLoad={() => {
        window.voiceflow?.chat?.load({
          verify: { 
            projectID: process.env.NEXT_PUBLIC_VOICEFLOW_PROJECT_ID 
          }
        });
      }}
    />
  );
}