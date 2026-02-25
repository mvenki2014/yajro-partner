import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface ActiveBookingCardProps {
  onNavigate?: (page: string) => void;
}

export function ActiveBookingCard({ onNavigate }: ActiveBookingCardProps) {
  // In a real app, this would probably take booking data as props
  return (
    <Card className="p-2 border-l-4 border-l-emerald-500 bg-white shadow-lg">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
            🙏
          </div>
          <div className="min-w-0">
            <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Active Booking</div>
            <div className="text-sm font-bold text-slate-900 truncate">Satyanarayana Swamy Vratam pooja</div>
          </div>
        </div>


        <Badge variant="saffron"
          onClick={() => onNavigate?.("tracking")}
          className="px-3 py-1 text-[11px] font-bold shadow-sm hover:scale-105 transition-transform active:scale-95">
          Track
        </Badge>

      </div>
      <div className="flex items-center gap-2 text-[11px] text-slate-500 font-medium px-2 pt-1 rounded-lg">
        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <span>Poojari assigned and preparing materials</span>
      </div>
    </Card>
  );
}
