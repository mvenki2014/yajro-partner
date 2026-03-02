import * as React from "react";
import { HiArrowTrendingUp, HiOutlineBanknotes } from "react-icons/hi2";
import { Card } from "@/components/ui/Card";

export type EarningsTab = "total" | "weekly" | "monthly";

interface EarningsCardProps {
  currentTab: EarningsTab;
  onTabChange: (tab: EarningsTab) => void;
  earningsValue: number;
}

export function EarningsCard({ currentTab, onTabChange, earningsValue }: EarningsCardProps) {
  const formatINR = (value: number) => `₹${value.toLocaleString("en-IN")}`;

  return (
    <Card className="relative overflow-hidden p-3.5 bg-gradient-to-br from-white to-[#FFF6EA] border-slate-200/80 rounded-2xl transition-all shadow-md">
      {/* Decorative background element */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-orange-400">
            <HiOutlineBanknotes className="h-5 w-5" />
          </div>
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">Earnings</h2>
        </div>
        
        <div className="inline-flex rounded-xl bg-[#f49c42]/10 p-1 ring-1 ring-slate-200/20">
          {([
            ["total", "Total"],
            ["weekly", "Weekly"],
            ["monthly", "Monthly"],
          ] as Array<[EarningsTab, string]>).map(([tab, label]) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`rounded-lg px-3 py-1.5 text-[11px] font-bold transition-all ${
                currentTab === tab 
                  ? "bg-white text-orange-400 shadow-sm ring-1 ring-slate-200/50" 
                  : "text-slate-600/80"
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-baseline gap-2.5">
        <p className="text-3xl font-bold text-slate-700 tracking-tight leading-none">
          {formatINR(earningsValue)}
        </p>
        <div className="flex items-center gap-1 text-sm font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
          <HiArrowTrendingUp className="h-3 w-3" />
          <span>12%</span>
        </div>
      </div>
      
      <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-1.5">
        <p className="text-xs text-slate-500 font-medium">Payout expected on Monday</p>
        <button className="text-xs font-bold  text-[#B35300] opacity-80 hover:underline">View Details</button>
      </div>
    </Card>
  );
}
