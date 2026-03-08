import React from 'react';
import { cn } from "@/lib/utils";

interface OrnamentProps {
  variant?: "default" | "destructive";
  className?: string;
}

export const CornerOrnament = ({ variant = "default", className }: OrnamentProps) => (
  <svg 
    viewBox="0 0 100 100" 
    className={cn(
      "w-full h-full rotate-0",
      variant === "destructive" ? "text-red-500" : "text-orange-500",
      className
    )}
  >
    <circle cx="100" cy="0" r="40" fill="currentColor" />
    <circle cx="100" cy="0" r="60" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="100" cy="0" r="80" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="4 4" />
  </svg>
);

export const BottomOrnament = ({ variant = "default", className }: OrnamentProps) => (
  <svg 
    viewBox="0 0 100 100" 
    className={cn(
      "w-full h-full",
      variant === "destructive" ? "text-red-500" : "text-orange-500",
      className
    )}
  >
    <path d="M0 100 Q 20 80 40 100 T 80 100" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
    <path d="M0 80 Q 20 60 40 80 T 80 80" fill="none" stroke="currentColor" strokeWidth="1" />
  </svg>
);
