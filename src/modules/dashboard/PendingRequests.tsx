import * as React from "react";
import { HiOutlineMapPin, HiOutlineClock, HiOutlineChevronRight } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

interface BookingRequest {
  id: string;
  serviceName: string;
  dateTime: string;
  location: string;
  price: number;
}

interface PendingRequestsProps {
  requests: BookingRequest[];
  onViewAll: () => void;
}

export function PendingRequests({ requests, onViewAll }: PendingRequestsProps) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Pending Requests ({requests.length})
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewAll}
          className="text-slate-400 text-xs flex items-center gap-1 font-medium px-0"
        >
          View All
          <HiOutlineChevronRight className="h-3 w-3 stroke-[3px]" />
        </Button>
      </div>
      <div className="space-y-2">
        {requests.map((request) => (
          <div
            key={request.id}
            className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#FFF9F2] p-4 shadow-md ring-1 ring-slate-200/60 transition-all hover:shadow-lg border-l-4 border-l-orange-500/60"
          >
            <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#FF9933]/5 blur-2xl transition-transform group-hover:scale-110" />
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-1">
                <p className="text-md font-bold text-slate-700 truncate">
                  {request.serviceName}
                </p>
                <div className="space-y-2 mt-2">
                  <div className="flex items-center text-[13px] text-slate-600 font-medium">
                    <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
                      <HiOutlineClock className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <span className="truncate">{request.dateTime}</span>
                  </div>
                  <div className="flex items-center text-[13px] text-slate-600 font-medium">
                    <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
                      <HiOutlineMapPin className="h-3.5 w-3.5 text-orange-500" />
                    </div>
                    <span className="truncate text-pretty line-clamp-1">{request.location}</span>
                  </div>
                </div>
              </div>
              <span className="text-lg font-bold text-emerald-600">
                ₹{request.price?.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between gap-3">
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 border-red-300/60 text-red-600 bg-transparent bg-red-50 font-bold rounded-xl text-sm"
              >
                Reject
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-9 border-emerald-600/30 text-emerald-600 bg-transparent bg-emerald-50 font-bold rounded-xl text-sm"
              >
                Accept
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
