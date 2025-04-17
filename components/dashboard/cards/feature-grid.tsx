"use client";

interface FeatureGridProps {
  features: {
    icon: React.ReactNode;
    title: string;
    description: string;
    percentage?: string;
  }[];
  showPercentage?: boolean;
}

export function FeatureGrid({ features, showPercentage = false }: FeatureGridProps) {
  return (
    <div className={`grid grid-cols-1 ${showPercentage ? 'gap-4' : 'sm:grid-cols-2 gap-6'}`}>
      {features.map((feature, index) => (
        <div key={`feature-${index}`} className={showPercentage ? 'flex items-center' : undefined}>
          <div className="group flex items-center gap-3 flex-1">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center
              group-hover:bg-purple-500/20 transition-colors duration-300 flex-shrink-0">
              {feature.icon}
            </div>
            <div className="space-y-1 py-0.5">
              <h4 className="text-sm font-medium text-purple-100">{feature.title}</h4>
              <p className="text-xs leading-relaxed text-purple-200/60">
                {feature.description}
              </p>
            </div>
          </div>
          {showPercentage && feature.percentage && (
            <span className="text-sm text-purple-300/90 ml-auto">{feature.percentage}</span>
          )}
        </div>
      ))}
    </div>
  );
}