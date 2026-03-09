import { HiOutlineMapPin, HiOutlineClock, HiOutlineChevronRight } from "react-icons/hi2";
import { Button } from "@/components/ui/Button";
import * as React from "react";

interface BookingRequest {
  id: string;
  serviceName: string;
  dateTime: string;
  location: string;
  price: number;
  packageName?: string;
}

interface PendingRequestsProps {
  requests: BookingRequest[];
  onViewAll: () => void;
}

export function PendingRequests({ requests, onViewAll }: PendingRequestsProps) {
  return (
    <section>
      <div className="mb-2.5 flex items-center justify-between px-1">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Pending Requests ({requests.length})
        </h2>
        <Button
          size="sm"
          variant="ghost"
          onClick={onViewAll}
          className="text-primary text-xs flex items-center gap-1 font-bold px-0 hover:bg-transparent"
        >
          View All
          <HiOutlineChevronRight className="h-3 w-3 stroke-[3px]" />
        </Button>
      </div>
      <div className="space-y-3">
        {requests.map((request) => (
          <RequestCard key={request.id} request={request} />
        ))}
      </div>
    </section>
  );
}

function RequestCard({ request }: { request: BookingRequest }) {
  const [timeLeft, setTimeLeft] = React.useState<number>(300); // 5 mins

  React.useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div
      className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-white to-[#FFF9F2] p-4 shadow-md ring-1 ring-slate-200/60 transition-all hover:shadow-lg"
    >
      <div className="pointer-events-none absolute -right-8 -bottom-8 h-32 w-32 rounded-full bg-[#FF9933]/5 blur-2xl transition-transform group-hover:scale-110" />
      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0 space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-bold text-slate-900 truncate tracking-tight">
                {request.serviceName}
              </p>
              {request.packageName && (
                <div className="px-2 py-0.5 rounded-full bg-orange-100 text-[#FF9933] text-[10px] font-black uppercase tracking-tight">
                  {request.packageName}
                </div>
              )}
              <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-orange-100/50 border border-orange-200/30">
                <HiOutlineClock className="h-2.5 w-2.5 text-orange-600" />
                <span className="text-[10px] font-black text-orange-600 font-mono">{formatTime(timeLeft)}</span>
              </div>
            </div>
            <div className="space-y-1.5 mt-2">
              <div className="flex items-center text-[13px] text-slate-500 font-medium">
                <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
                  <HiOutlineClock className="h-3.5 w-3.5 text-orange-500" />
                </div>
                <span className="truncate">{request.dateTime}</span>
              </div>
              <div className="flex items-center text-[13px] text-slate-500 font-medium">
                <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
                  <HiOutlineMapPin className="h-3.5 w-3.5 text-orange-500" />
                </div>
                <span className="truncate text-pretty line-clamp-1">{request.location}</span>
              </div>
            </div>
          </div>
          <span className="text-lg font-black text-emerald-600 bg-emerald-50/50 px-2 py-1 rounded-lg">
            ₹{request.price?.toLocaleString("en-IN")}
          </span>
        </div>
        <div className="mt-4 flex items-center justify-between gap-3">
          <Button
            variant="outline"
            className="h-12 flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
          >
            Reject
          </Button>
          <Button
            className="h-12 flex-[2] min-w-[140px] rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-bold"
          >
            Accept Request
          </Button>
        </div>
      </div>
    </div>
  );
}
