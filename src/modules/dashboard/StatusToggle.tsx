import * as React from "react";
import { HiPower } from "react-icons/hi2";

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: () => void;
}

export function StatusToggle({ isOnline, onToggle }: StatusToggleProps) {
  return (
    <div className={`flex items-center gap-2 rounded-full ring-1 pl-1 pr-2.5 py-1 shadow-sm transition-all duration-500 ${
      isOnline 
        ? "bg-emerald-50/50 ring-emerald-200/60" 
        : "bg-red-50/50 ring-red-200/60"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 focus:outline-none ${
          isOnline
            ? "bg-emerald-500 text-white shadow-emerald-200/50 shadow-lg"
            : "bg-white text-red-500 ring-1 ring-red-200 shadow-sm"
        } hover:scale-105 active:scale-95`}
        aria-label={isOnline ? "Switch Offline" : "Switch Online"}
      >
        <HiPower className={`h-4 w-4 ${isOnline ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : ""}`} />
      </button>
      <div className="flex items-center gap-1.5 ml-0.5">
        <div className="relative flex h-2 w-2">
          {isOnline && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          {!isOnline && (
            <span className="absolute inline-flex h-full w-full animate-pulse rounded-full bg-red-400 opacity-75" />
          )}
          <div className={`relative h-2 w-2 rounded-full transition-colors duration-500 ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
        </div>
        <span className={`text-[10px] font-bold tracking-tight transition-colors duration-500 ${isOnline ? "text-emerald-600" : "text-red-600"}`}>
          {isOnline ? "ONLINE" : "OFFLINE"}
        </span>
      </div>
    </div>
  );
}
