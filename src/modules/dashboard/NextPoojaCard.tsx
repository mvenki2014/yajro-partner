import * as React from "react";
import { HiOutlineClock, HiOutlineUser, HiOutlinePhone, HiPhone, HiOutlineMapPin, HiMapPin } from "react-icons/hi2";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

interface NextPoojaCardProps {
  poojaName: string;
  time: string;
  customerName: string;
  address: string;
}

export function NextPoojaCard({ poojaName, time, customerName, address }: NextPoojaCardProps) {
  return (
    <Card className="mb-4 relative overflow-hidden p-3.5 pt-3 bg-gradient-to-br from-white to-[#FFF9F2] border-slate-200/60 shadow-md rounded-2xl">
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-[#FF9933]/5 blur-2xl" />
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">Next Pooja</p>
          <span className="flex h-2 w-2 relative">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full h-8 w-8 text-[#FF9933] border-orange-100 bg-white shadow-sm hover:bg-orange-50"
            aria-label="Navigate"
          >
          <HiMapPin className="h-4 w-4" />
          </Button>
          <Button
            size="icon-sm"
            variant="outline"
            className="rounded-full h-8 w-8 text-emerald-600 border-emerald-100 bg-white shadow-sm hover:bg-emerald-50"
            aria-label="Call"
          >
            <HiPhone className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <p className="text-lg font-bold text-slate-700 leading-tight mb-2">{poojaName}</p>
      
      <div className="space-y-2">
        <div className="flex items-center text-[13px] text-slate-600 font-medium">
          <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
            <HiOutlineClock className="h-3.5 w-3.5 text-orange-500" />
          </div>
          <span>{time}</span>
        </div>
        <div className="flex items-center text-[13px] text-slate-600 font-medium">
          <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
            <HiOutlineMapPin className="h-3.5 w-3.5 text-orange-500" />
          </div>
          <span className="line-clamp-1">{address}</span>
        </div>
        <div className="flex items-center text-[13px] text-slate-600 font-medium">
          <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
            <HiOutlineUser className="h-3.5 w-3.5 text-orange-500" />
          </div>
          <span>{customerName}</span>
        </div>
      </div>
    </Card>
  );
}
