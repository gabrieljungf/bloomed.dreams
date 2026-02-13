"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/components/auth/auth-provider';

export function useUserStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    lunarPhase: 'Waxing Crescent',
    streak: 3,
    analysisCredits: 5
  });

  useEffect(() => {
    // TODO: Fetch real stats from API
    if (user) {
      // For now using placeholder data
      setStats({
        lunarPhase: 'Waxing Crescent',
        streak: 3,
        analysisCredits: 5
      });
    }
  }, [user]);

  return stats;
}
