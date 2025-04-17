"use client";

export function DreamGrowth() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Flower */}
      <path
        d="M12 3C12 3 14 7 14 12C14 17 12 21 12 21"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      
      {/* Petals */}
      <path
        d="M12 12C12 12 8 10 6 7M12 12C12 12 16 10 18 7M12 12C12 12 8 14 6 17M12 12C12 12 16 14 18 17"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Moon */}
      <path
        d="M16 5.79A3 3 0 1 1 13.21 3 2.5 2.5 0 0 0 16 5.79z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}