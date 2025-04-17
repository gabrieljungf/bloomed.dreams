"use client";

interface CardContainerProps {
  children: React.ReactNode;
}

export function CardContainer({ children }: CardContainerProps) {
  return (
    <div className="dashboard-card h-full">
      <div className="relative px-6 sm:px-8 lg:px-10 pt-6 pb-6 space-y-8">
        {children}
      </div>
    </div>
  );
}