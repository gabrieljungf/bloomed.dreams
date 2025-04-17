"use client";
import { History, Star, Trophy } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

export function DashboardStats() {
  const stats = [
    {
      icon: History,
      title: "Dreams Recorded",
      value: "7 dreams",
      subtitle: "3 this week"
    },
    {
      icon: Trophy,
      title: "Latest Achievement",
      value: "Explorer of the Infinite Realm of Lucid Dreaming",
      subtitle: "Check your Blooming Path"
    },
    {
      icon: Star,
      title: "Daily Streak",
      value: "3 days in a row",
      subtitle: "Keep it going!"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {stats.map((stat, index) => (
        <div 
          key={index} 
          className="dashboard-card p-3 relative group flex items-start min-h-[10px] hover:bg-purple-500/5 transition-colors"
        >
          <div className="flex flex-col w-full justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <stat.icon className="w-3 h-3 text-purple-300/90" />
              </div>
              <p className="text-xs text-purple-200/70">{stat.title}</p>
            </div>
            
            <div className="flex flex-col items-center space-y-1 mt-1">
  {stat.icon === Trophy ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <p className="text-lg text-purple-100 truncate w-full text-center px-2">
            {stat.value}
          </p>
        </TooltipTrigger>
        <TooltipContent side="top" className="border-0 bg-black/90 max-w-[200px]" sideOffset={5}>
          <p className="text-xs text-center">{stat.value}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <p className="text-lg text-purple-100 truncate w-full text-center px-2">
      {stat.value}
    </p>
  )}
  <p className="text-2xs tracking-wider text-purple-300/50 text-center max-w-[160px]">
    {stat.subtitle}
  </p>
</div>
          </div>
        </div>
      ))}
    </div>
  );
}