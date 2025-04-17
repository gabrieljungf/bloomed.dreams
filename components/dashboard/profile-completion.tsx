"use client";

import { User, Briefcase, Sparkles, Target, ArrowRight } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { CardContainer } from './cards/card-container';
import { CardHeader } from './cards/card-header';
import { CardFooter } from './cards/card-footer';
import { FeatureGrid } from './cards/feature-grid';

const features = [
  {
    icon: <Briefcase className="w-4 h-4 text-purple-300/90" />,
    title: "Add occupation",
    description: "Help us understand your daily context",
    percentage: "+10%"
  },
  {
    icon: <Sparkles className="w-4 h-4 text-purple-300/90" />,
    title: "Add spiritual background",
    description: "Connect with your beliefs",
    percentage: "+15%"
  },
  {
    icon: <Target className="w-4 h-4 text-purple-300/90" />,
    title: "Set goals",
    description: "Define your dream journey objectives",
    percentage: "+25%"
  }
];

export function ProfileCompletion() {
  return (
    <div className="h-full">
      <CardContainer>
        <CardHeader
          icon={<User className="w-5 h-5 text-purple-300" />}
          title="Awaken Your Dreams"
          description="Complete your profile to unlock deeper insights"
        />

        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-purple-200/70">50% Complete</span>
              <span className="text-sm font-medium text-purple-300">3 steps left</span>
            </div>
            <div className="h-2 rounded-full bg-purple-900/40">
              <div 
                className="h-full rounded-full bg-gradient-to-r from-purple-500 to-purple-400 
                transition-all duration-700"
                style={{ width: '50%' }}
              />
            </div>
          </div>

          <FeatureGrid features={features} showPercentage />
        </div>

        <CardFooter disclaimer={["Each detail makes your dream interpretations uniquely yours"]}>
          <Link href="/dashboard/space" className="w-full">
            <Button
              className="w-full bg-gradient-to-r from-purple-500/80 to-indigo-500/80 
                hover:from-purple-500/90 hover:to-indigo-500/90
                text-white font-medium px-6 py-2
                rounded-full shadow-lg shadow-purple-500/20
                hover:shadow-purple-500/30
                transition-all duration-300 border border-white/10
                hover:border-white/20 flex items-center justify-center gap-2"
              size="lg"
            >
              <ArrowRight className="w-4 h-4" />
              Go to Bloom Space
            </Button>
          </Link>
        </CardFooter>
      </CardContainer>
    </div>
  );
}