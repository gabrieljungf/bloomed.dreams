"use client";

interface CardContainerProps {
  children: React.ReactNode;
  className?: string;
}

export function CardContainer({ children, className = "" }: CardContainerProps) {
  return (
    <div className={`rounded-2xl depth-card overflow-hidden ${className}`}>
      <div className="relative px-6 sm:px-8 lg:px-10 pt-6 pb-6 space-y-8">
        {children}
      </div>
    </div>
  );
}
