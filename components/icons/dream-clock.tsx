"use client";

export function DreamClock() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Brain with subtle glow */}
      <path
        d="M12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6Z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 8C13.6569 8 15 9.34315 15 11C15 12.6569 13.6569 14 12 14C10.3431 14 9 12.6569 9 11C9 9.34315 10.3431 8 12 8Z"
        className="stroke-current fill-current opacity-10"
        strokeWidth="1.5"
      />
      
      {/* Subtle sparkles */}
      <circle cx="12" cy="4" r="1" className="fill-current animate-pulse" />
      <circle cx="20" cy="12" r="1" className="fill-current animate-pulse" />
      <circle cx="12" cy="20" r="1" className="fill-current animate-pulse" />
      <circle cx="4" cy="12" r="1" className="fill-current animate-pulse" />
    </svg>
  );
}