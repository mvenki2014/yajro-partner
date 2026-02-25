import * as React from "react";

interface HomeHeaderProps {
  location: string;
  isLocating: boolean;
  hasUnread: boolean;
  onGetLocation: () => void;
  onOpenNotifications: () => void;
}

export function HomeHeader({
  location,
  isLocating,
  hasUnread,
  onGetLocation,
  onOpenNotifications,
}: HomeHeaderProps) {
  return (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <div 
            className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={onGetLocation}
          >
            <span className="text-sm font-bold text-[#B35300]">Namaste, Venkatesh Medisetti</span>
          </div>
        </div>
        <div className="text-[#FF9933]">
          <div className="flex items-center gap-1.5">
            <div className="text-[#FF9933]">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
            </div>
            <div 
              className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" 
              onClick={onGetLocation}
            >
              <span className={`text-[11px] text-slate-600 ${isLocating ? 'opacity-50' : 'opacity-100'}`}>
                {location || "Location permission missing"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button
        type="button"
        onClick={onOpenNotifications}
        className="relative rounded-full p-2 hover:bg-slate-100 transition"
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
          <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
          <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
        </svg>
        {hasUnread && (
          <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
          </span>
        )}
      </button>
    </>
  );
}
