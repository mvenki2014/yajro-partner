import { HiPower } from "react-icons/hi2";
import type { IconType } from "react-icons";

interface StatusToggleProps {
  isOnline: boolean;
  onToggle: () => void;
  activeLabel?: string;
  inactiveLabel?: string;
  activeLabelClassName?: string;
  inactiveLabelClassName?: string;
  activeIconClassName?: string;
  inactiveIconClassName?: string;
  activeDotClassName?: string;
  inactiveDotClassName?: string;
  activeIcon?: IconType;
  inactiveIcon?: IconType;
}

export function StatusToggle({
  isOnline,
  onToggle,
  activeLabel = "ONLINE",
  inactiveLabel = "OFFLINE",
  activeLabelClassName = "text-emerald-600",
  inactiveLabelClassName = "text-slate-400",
  activeIconClassName = "text-white shadow-[inset_0_1.5px_3px_rgba(255,255,255,0.4),0_4px_10px_rgba(16,185,129,0.3)]",
  inactiveIconClassName = "text-slate-400 shadow-inner grayscale-[0.5]",
  activeDotClassName = "bg-emerald-500",
  inactiveDotClassName = "bg-slate-300",
  activeIcon = HiPower,
  inactiveIcon = HiPower,
}: StatusToggleProps) {
  const CurrentIcon = isOnline ? activeIcon : inactiveIcon;

  return (
    <div className={`flex items-center gap-2 rounded-full ring-1 pl-1 pr-2.5 py-1 transition-all duration-500 ${
      isOnline 
        ? "bg-emerald-50/50 ring-emerald-200/60 shadow-sm" 
        : "bg-slate-50/80 ring-slate-200 shadow-inner"
    }`}>
      <button
        type="button"
        onClick={onToggle}
        className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-500 focus:outline-none ${
          isOnline
            ? `bg-emerald-500 ${activeIconClassName}`
            : `bg-slate-200 ${inactiveIconClassName}`
        } hover:scale-105 active:scale-95`}
        aria-label={isOnline ? "Switch Offline" : "Switch Online"}
      >
        <CurrentIcon className={`h-4 w-4 ${isOnline ? "drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "opacity-60"}`} />
      </button>
      <div className="flex items-center gap-1.5 ml-0.5">
        <div className="relative flex h-2 w-2">
          {isOnline && (
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
          )}
          <div className={`relative h-2 w-2 rounded-full transition-colors duration-500 ${isOnline ? activeDotClassName : inactiveDotClassName}`} />
        </div>
        <span className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isOnline ? activeLabelClassName : inactiveLabelClassName}`}>
          {isOnline ? activeLabel : inactiveLabel}
        </span>
      </div>
    </div>
  );
}
