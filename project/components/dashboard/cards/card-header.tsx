"use client";

interface CardHeaderProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

export function CardHeader({ icon, title, description }: CardHeaderProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-purple-500/20 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <h3 className="text-xl font-semibold tracking-wide text-white/90">
            {title}
          </h3>
          <p className="text-sm font-light text-purple-200/60">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}