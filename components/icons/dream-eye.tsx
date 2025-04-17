"use client";

export function DreamEye() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Moon */}
      <path
        d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"
        className="stroke-current"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Subtle stars */}
      <circle cx="8" cy="9" r="1" className="fill-current animate-pulse" />
      <circle cx="15" cy="17" r="1" className="fill-current animate-pulse" />
      <circle cx="17" cy="11" r="1" className="fill-current animate-pulse" />
    </svg>
  );
}