"use client";

interface CardFooterProps {
  children: React.ReactNode;
  disclaimer?: string[];
}

export function CardFooter({ children, disclaimer }: CardFooterProps) {
  if (!children && !disclaimer) return null;
  
  return (
    <div className="space-y-3 pt-2">
      {children}
      
      {disclaimer && disclaimer.length > 0 && (
        <div className="flex items-center justify-center gap-2 text-xs text-purple-200/50">
          {disclaimer.map((text, index) => (
            <div key={`disclaimer-${index}`} className="flex items-center">
              {index > 0 && <span className="mx-2">•</span>}
              <span>{text}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}