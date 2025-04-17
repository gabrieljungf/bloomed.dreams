"use client";

import { DashboardStats } from '@/components/dashboard/stats';
import { WhatsAppConnect } from '@/components/dashboard/whatsapp-connect';
import { ProfileCompletion } from '@/components/dashboard/profile-completion';
import { RecentDreams } from '@/components/dashboard/recent-dreams';
import { motion } from 'framer-motion';

const dreamEntries = [
  {
    id: 1,
    date: 'Nov 24, 2024',
    content: 'Um oceano profundo com uma luz dourada emergindo das profundezas...',
    symbols: ['água', 'luz', 'profundidade'],
    hasConnections: true
  },
  {
    id: 2,
    date: 'Nov 23, 2024',
    content: 'Voando sobre uma floresta antiga, árvores milenares sussurrando segredos...',
    symbols: ['voo', 'natureza', 'sabedoria'],
    hasConnections: false
  }
];

export default function DashboardPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative z-10"
    >
      <div className="space-y-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h1 className="text-4xl font-display text-purple-100 tracking-tight">
            Welcome back, Test User
          </h1>
          <p className="text-sm text-purple-200/70 font-light mt-2">
            Your dreams are whispering... shall we listen?
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <DashboardStats />
        </motion.div>

        {/* WhatsApp and Profile Completion */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-6"
        >
          <WhatsAppConnect />
          <ProfileCompletion />
        </motion.div>

        {/* Recent Dreams */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <RecentDreams dreams={dreamEntries} />
        </motion.div>
      </div>
    </motion.div>
  );
}