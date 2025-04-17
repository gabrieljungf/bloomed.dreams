"use client";

interface FeatureItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function FeatureItem({ icon, title, description }: FeatureItemProps) {
  return (
    <div className="group flex items-center gap-3">
      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center
        group-hover:bg-purple-500/20 transition-colors duration-300 flex-shrink-0">
        {icon}
      </div>
      <div className="space-y-1 py-0.5">
        <h4 className="text-sm font-medium text-purple-100">{title}</h4>
        <p className="text-xs leading-relaxed text-purple-200/60">
          {description}
        </p>
      </div>
    </div>
  );
}