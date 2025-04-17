"use client";

import Link from 'next/link';
import { Briefcase, Sparkles, Target } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export function ProfileBanner() {
  return (
    <Link href="/dashboard/space" className="block h-full">
      <div className="dashboard-card p-6 hover:bg-purple-500/5 transition-colors h-full">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-light text-purple-100">Complete Your Profile</h3>
            <p className="text-sm text-purple-200/60">Get more personalized dream analysis</p>
          </div>
          <div className="text-sm text-purple-300">50%</div>
        </div>

        <Progress value={50} className="bg-purple-950/30 h-2 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-purple-400 h-full rounded-full" />
        </Progress>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Briefcase className="w-4 h-4 text-purple-300/70" />
              <span className="text-purple-200/70 text-sm">Add occupation</span>
            </div>
            <div className="w-24 h-1.5 bg-purple-950/30 rounded-full overflow-hidden">
              <div className="w-[10%] h-full bg-purple-500/40 rounded-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Sparkles className="w-4 h-4 text-purple-300/70" />
              <span className="text-purple-200/70 text-sm">Add spiritual background</span>
            </div>
            <div className="w-24 h-1.5 bg-purple-950/30 rounded-full overflow-hidden">
              <div className="w-[15%] h-full bg-purple-500/40 rounded-full" />
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 flex-1">
              <Target className="w-4 h-4 text-purple-300/70" />
              <span className="text-purple-200/70 text-sm">Set goals</span>
            </div>
            <div className="w-24 h-1.5 bg-purple-950/30 rounded-full overflow-hidden">
              <div className="w-[25%] h-full bg-purple-500/40 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}