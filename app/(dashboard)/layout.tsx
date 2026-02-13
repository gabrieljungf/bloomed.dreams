// ARQUIVO FINAL E CORRIGIDO: app/(dashboard)/layout.tsx

"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/auth/auth-provider';
import { DashboardLayout } from '@/components/layouts/dashboard-layout';
// 1. Importar AMBOS os componentes do chat: o widget e o botão flutuante
import { ChatWidget, ChatToggleButton } from '@/components/chat/chat-widget'; 
import { useChatWidget } from '@/hooks/use-chat-widget';

export default function DashboardRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  // 2. Obter 'isOpen' e 'onOpen' para controlar a visibilidade de ambos os componentes
  const { isOpen, onOpen, onClose } = useChatWidget();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return null;
  }

  return (
    <DashboardLayout>
      {children}

      {/* O widget principal do chat (a janela), que fica escondido até 'isOpen' ser true */}
      <ChatWidget
        isOpenProp={isOpen}
        onClose={onClose}
      />

      {/* 
        3. A LÓGICA ADICIONADA:
        Renderiza o botão flutuante SOMENTE se a janela do chat NÃO estiver aberta.
        Quando clicado, ele chama a função 'onOpen' para abrir o widget.
      */}
      {!isOpen && (
        <ChatToggleButton onClick={onOpen} />
      )}
    </DashboardLayout>
  );
}