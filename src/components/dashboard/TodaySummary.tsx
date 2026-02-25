import * as React from "react";
import { Card } from "@/components/ui/Card";

interface SummaryNumberProps {
  label: string;
  value: string;
}

function SummaryNumber({ label, value }: SummaryNumberProps) {
  return (
    <div className="rounded-xl bg-white/80 backdrop-blur-sm px-1 py-3 text-center shadow-sm ring-1 ring-orange-200/40">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 text-[20px] leading-tight font-extrabold text-slate-700 tracking-tight">{value}</p>
    </div>
  );
}

export function TodaySummary() {
  return (
    <Card className="relative overflow-hidden p-3.5 bg-[#FFF8ED] border-orange-100/50 shadow-sm rounded-2xl">
      <div className="pointer-events-none absolute -right-10 -bottom-12 h-40 w-40 rounded-full bg-[#FF9933]/5 blur-2xl" />
      <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#B35300] opacity-80 mb-2.5">Today's Summary</p>
      <div className="grid grid-cols-3 gap-2">
        <SummaryNumber label="Earnings" value="₹18,300" />
        <SummaryNumber label="Booking" value="1" />
        <SummaryNumber label="Pending" value="1" />
      </div>
    </Card>
  );
}
