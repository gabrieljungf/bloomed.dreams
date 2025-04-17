"use client";

import { useAuth } from '@/components/auth-provider';
import { DashboardNav } from './dashboard-nav';
import { StarField } from '@/components/star-field';
import { DashboardSidebar } from './dashboard-sidebar';
import { VoiceflowChat } from '@/components/chat/voiceflow-chat';
import { useState } from 'react';

export function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#030014] relative">
      <StarField />
      <div className="flex flex-col h-screen">
        <DashboardNav onMenuClick={() => setSidebarOpen(true)} />
        <div className="flex flex-1 overflow-hidden">
          <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 ml-0 lg:ml-64 overflow-y-auto custom-scrollbar">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-10">
              {children}
            </div>
          </main>
        </div>
      </div>
      <VoiceflowChat />
    </div>
  );
}