import * as React from "react";
import { Card } from "@/components/ui/Card";

interface MuhurthamCardProps {
  muhurtham: {
    time: string;
    note: string;
  };
}

export function MuhurthamCard({ muhurtham }: MuhurthamCardProps) {
  return (
    <Card className="overflow-hidden rounded-xl shadow-md">
      <div className="px-4 py-3 bg-gradient-to-r from-[#FF9933]/15 via-amber-200/20 to-transparent">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#b35300c2" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 4H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
                <path d="M16 18h.01" />
              </svg>
            </div>
            <div className="text-xs font-semibold text-slate-700">{muhurtham.note}</div>
          </div>
          <div className="flex gap-2">
            <div className={`px-2.5 py-1 text-xs font-bold text-emerald-700 rounded-sm bg-emerald-500/10`}>
              {muhurtham.time}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
