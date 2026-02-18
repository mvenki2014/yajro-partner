import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { Calendar, ChevronRight } from "lucide-react";
import { services } from "@/data/mock";
import { formatSlotLabel } from "@/lib/api";

interface BookingCardProps {
  booking: {
    id: string;
    serviceId: string;
    date: string;
    slot: string;
    status: string;
    address: string;
    price: number;
  };
  onViewDetail: (bookingId: string) => void;
  onTrackService: (serviceId: string) => void;
}

export function BookingCard({
  booking,
  onViewDetail,
  onTrackService,
}: BookingCardProps) {
  const getService = (id: string) => services.find((s) => s.id === id) ?? services[0];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const formatSlot = (slot: string) => {
    return formatSlotLabel(slot);
  };

  const service = getService(booking.serviceId);
  const isInProgress = booking.status === "In Progress";

  return (
    <Card
      key={booking.id}
      onClick={() => onViewDetail(booking.id)}
      className={cn(
        "px-4 pt-3 pb-2 relative overflow-hidden group border-slate-100 shadow-sm hover:shadow-md transition-all bg-gradient-to-br from-white via-white to-orange-50/50 cursor-pointer",
        isInProgress && "border-l-4 border-l-emerald-500"
      )}
    >
      <div className="flex justify-between items-start mb-3 gap-3">
        <div
          className="flex items-center gap-3 min-w-0"
        >
          <div className="h-12 w-12 rounded-2xl bg-orange-50 flex items-center justify-center text-2xl shrink-0 shadow-inner">
            {booking.serviceId === "car-pooja"
              ? "🚗"
              : booking.serviceId === "griha-pravesh"
              ? "🏠"
              : "🙏"}
          </div>
          <div className="min-w-0">
            <div className="text-base font-bold text-slate-700 truncate leading-tight">
              {service.title}
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <Calendar className="h-3 w-3 text-[#B35300]" />
              <span className="text-[11px] font-bold text-slate-500">
                {formatDate(booking.date)} - {formatSlot(booking.slot)}
              </span>
            </div>
          </div>
        </div>
        {isInProgress ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              onTrackService(booking.serviceId);
            }}
            variant="outline"
            size="xs"
            className="text-[10px] px-3 font-bold shadow-none uppercase tracking-wider shrink-0 border-[#B35300] text-[#B35300] hover:bg-orange-50"
          >
            Live Track
          </Button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#B35300] group-hover:text-[#FF9933] transition-colors shrink-0 pt-1">
            <ChevronRight className="h-4 w-4" />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-4 mt-1">
        <div className="flex flex-col">
          <span className="text-[9px] font-bold text-slate-400 uppercase">
            Amount Paid
          </span>
          <div className="text-lg font-bold text-[#B35300]">
            ₹{booking.price}
          </div>
        </div>
        <div
          className={cn(
            "shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide flex items-center rounded-full",
            isInProgress 
              ? "text-emerald-600"
              : "text-[#B35300]"
          )}
        >
          {isInProgress && (
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />
          )}
          {booking.status}
        </div>
      </div>
    </Card>
  );
}
