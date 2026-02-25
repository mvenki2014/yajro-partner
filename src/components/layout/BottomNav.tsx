import * as React from "react";
import { Tab } from "@/types";

export function BottomNav({
  activeTab = "dashboard",
  onTabChange,
}: {
  activeTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}) {
  const tabs: Array<{ id: Tab; label: string; icon: React.ReactNode }> = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="9" rx="1" />
          <rect x="14" y="3" width="7" height="5" rx="1" />
          <rect x="14" y="12" width="7" height="9" rx="1" />
          <rect x="3" y="16" width="7" height="5" rx="1" />
        </svg>
      ),
    },
    {
      id: "services",
      label: "Services",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 2v6" />
          <path d="M9 5h6" />
          <path d="M4 12h16" />
          <path d="M6 12v8h12v-8" />
        </svg>
      ),
    },
    {
      id: "orders",
      label: "Orders",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18" />
          <path d="M7 12h10" />
          <path d="M9 18h6" />
          <rect x="3" y="3" width="18" height="18" rx="2" />
        </svg>
      ),
    },
    {
      id: "earnings",
      label: "Earnings",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="9" />
          <path d="M15 9.5c0-1.4-1.3-2.5-3-2.5s-3 1.1-3 2.5 1 2 3 2.5 3 1.1 3 2.5-1.3 2.5-3 2.5-3-1.1-3-2.5" />
        </svg>
      ),
    },
    {
      id: "profile",
      label: "Profile",
      icon: (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex w-full items-center justify-between px-2 py-2 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className={`flex flex-col items-center justify-center w-full gap-1 py-1 transition-colors ${
              isActive ? "text-[#FF9933]" : "text-slate-400 hover:text-slate-600"
            }`}
          >
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200 ${
                isActive ? "bg-[#FF9933]/10" : "bg-transparent"
              } ${isActive ? "stroke-[2.5px] [&>svg]:stroke-[2.5px]" : ""}`}
            >
              {tab.icon}
            </div>
            <span
              className={`text-[10px] font-medium transition-all duration-200 ${
                isActive ? "text-[#B35300] font-bold" : ""
              }`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
