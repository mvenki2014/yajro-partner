import * as React from "react";
import { ChevronLeft, Crown } from "lucide-react";

export function PageHeader({
  title,
  onBack,
  showPremium = true,
}: {
  title: string;
  onBack?: () => void;
  showPremium?: boolean;
}) {
  return (
    <div className="flex w-full items-center gap-2">
      {onBack ? (
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl p-2 text-slate-700 hover:bg-slate-900/5 transition-colors"
          aria-label="Back"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      ) : (
        <div className="w-9" />
      )}

      <div className="flex-1 text-left">
        <div className="truncate font-bold text-base text-slate-900">{title}</div>
      </div>

      {showPremium ? (
        <span className="inline-flex items-center gap-1 rounded-full transition-colors bg-amber-400/20 text-amber-900 ring-1 ring-amber-400/35 px-2 py-0.5 uppercase tracking-wider text-[9px] font-bold">
          <Crown className="h-2.5 w-2.5 mr-1 inline-block" />
          Premium
        </span>
      ) : (
        <div className="w-9" />
      )}
    </div>
  );
}
