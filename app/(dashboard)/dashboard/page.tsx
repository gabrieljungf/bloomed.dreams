// app/(dashboard)/dashboard/page.tsx (DEPOIS - SIMPLES E CORRETO)

"use client";

import { DreamJournal } from '@/components/journal/dream-journal';
import { motion } from 'framer-motion';

export default function DashboardPage() {
  // A página volta a ter uma única responsabilidade:
  // mostrar a área de conteúdo principal, que é o Journal.
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <DreamJournal />
    </motion.div>
  );
}