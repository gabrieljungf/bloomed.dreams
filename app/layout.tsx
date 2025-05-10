import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';
import { AuthProvider } from '@/components/auth-provider';
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from '@vercel/speed-insights/next';
import { cn } from '@/lib/utils';
import Script from 'next/script'; // <--- ADD THIS LINE
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Bloomed Dreams - Dream Interpretation and Analysis Platform',
  description: 'Unlock the mysteries of your dreams with AI-powered analysis',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.className, 'custom-scrollbar')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
        <script
        id="n8n-chat-options"
        dangerouslySetInnerHTML={{
          __html: `
            window.n8nChatOptions = {
              // IMPORTANT: Paste your Agent ID here!
              agentId: 'YOUR_N8N_AGENT_ID_HERE',

              // --- Optional Basic Theme Settings ---
              // theme: {
              //    primaryColor: '#9333ea', // Example: A purple color
              //    font: { family: 'inherit' }
              // }
              // --- End Optional Basic Theme ---
            };
          `,
        }}
      />
      <Script
        strategy="lazyOnload" // Loads the script after the page is interactive
        src="https://cdn.jsdelivr.net/npm/@n8n/chat/dist/esm/chat.mjs"
      />
      {/* END: n8n Chat Widget Code */}
      <SpeedInsights />
      <Analytics /> 
      </body>
    </html>
  );
}