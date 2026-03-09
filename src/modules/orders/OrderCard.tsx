import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PartnerBooking, PartnerBookingStatus, ORDER_STATUS } from "@/data/partner-mock";
import { 
  MapPin, 
  Calendar, 
  Phone, 
  Navigation, 
  ArrowRight,
  User,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";

interface OrderCardProps {
  order: PartnerBooking;
  onClick: () => void;
  onUpdateStatus: (id: string, status: PartnerBookingStatus) => void;
}

const PACKAGE_BADGE_CLASSES: Record<string, string> = {
  Basic: "bg-[#F8EFE6] text-[#9A3412] border-[#E2C7AF]",
  Standard: "bg-[#EEF6F0] text-[#166534] border-[#BFE3CC]",
  Premium: "bg-[#F7ECEF] text-[#9F1239] border-[#E3B8C2]",
};

export const OrderCard = React.memo(function OrderCard({
  order,
  onClick,
  onUpdateStatus,
}: OrderCardProps) {
  const [timeLeft, setTimeLeft] = React.useState<number>(300); // 5 mins in seconds

  React.useEffect(() => {
    if (order.status !== ORDER_STATUS.PENDING || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [order.status, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusIcon = (status: PartnerBookingStatus) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return <Clock className="h-3.5 w-3.5 animate-pulse" />;
      case ORDER_STATUS.ACCEPTED: return <CheckCircle2 className="h-3.5 w-3.5 text-blue-500" />;
      case ORDER_STATUS.IN_PROGRESS: return <div className="h-2 w-2 rounded-full bg-orange-500 animate-pulse" />;
      case ORDER_STATUS.COMPLETED: return <CheckCircle2 className="h-3.5 w-3.5 text-green-500" />;
      case ORDER_STATUS.CANCELLED: return <XCircle className="h-3.5 w-3.5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusVariant = (status: PartnerBookingStatus) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return "gold";
      case ORDER_STATUS.ACCEPTED: return "info";
      case ORDER_STATUS.IN_PROGRESS: return "warning";
      case ORDER_STATUS.COMPLETED: return "success";
      case ORDER_STATUS.CANCELLED: return "destructive";
      default: return "neutral";
    }
  };

  const handleCall = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(`tel:${order.customerPhone}`, "_self");
  };

  const handleNavigate = (e: React.MouseEvent) => {
    e.stopPropagation();
    const { lat, lng } = order.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  return (
    <Card 
      className="group relative p-0 overflow-hidden border-none shadow-md ring-1 ring-slate-200/60 active:scale-[0.98] transition-all cursor-pointer bg-gradient-to-br from-white to-[#FFF9F2] hover:shadow-lg hover:z-20"
      onClick={onClick}
    >
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-32 w-32 rounded-full bg-[#FF9933]/5 blur-2xl transition-transform group-hover:scale-110" />
      <div className="p-4 relative z-10">
        {/* Header: Service Type and Status */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900 leading-tight">{order.serviceType}</h3>
                {order.packageName && (
                  <span
                    className={`px-1.5 py-0.5 rounded-md border text-[9px] font-black uppercase tracking-tighter ${
                      PACKAGE_BADGE_CLASSES[order.packageName] ?? "bg-orange-100 text-[#FF9933] border-orange-200"
                    }`}
                  >
                    {order.packageName}
                  </span>
                )}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{order.id}</p>
            </div>
          </div>
          <Badge 
            variant={getStatusVariant(order.status) as any} 
            className="flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider"
          >
            {getStatusIcon(order.status)}
            {order.status}
          </Badge>
        </div>

        {/* Customer and Time */}
        <div className="space-y-2.5 mb-4">
          <div className="flex items-center gap-2 text-slate-600">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center shadow-sm">
              <User className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span className="text-sm font-semibold">{order.customerName}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center shadow-sm">
              <Calendar className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span className="text-sm">{order.dateTime}</span>
          </div>
          <div className="flex items-start gap-2 text-slate-500">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center shadow-sm flex-shrink-0 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span className="text-xs line-clamp-1">{order.address}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 pt-3 border-t border-slate-100/60">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-lg border-emerald-200 text-emerald-700 bg-emerald-50/30 hover:bg-emerald-50 font-bold gap-1.5 shadow-sm"
            onClick={handleCall}
          >
            <Phone className="h-3.5 w-3.5" />
            Call
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1 h-9 rounded-lg border-blue-200 text-blue-700 bg-blue-50/30 hover:bg-blue-50 font-bold gap-1.5 shadow-sm"
            onClick={handleNavigate}
          >
            <Navigation className="h-3.5 w-3.5" />
            Maps
          </Button>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-9 w-9 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/5"
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {/* Footer Banner for Pending */}
      {order.status === ORDER_STATUS.PENDING && (
        <div className="relative z-10 bg-orange-50/50 px-4 py-2.5 flex items-center justify-between border-t border-orange-100/40">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-500"></span>
            </span>
            <span className="text-[10px] font-extrabold text-orange-700 uppercase tracking-widest">New Request</span>
            <div className="ml-2 px-2 py-0.5 rounded bg-orange-100/50 flex items-center gap-1">
              <Clock className="h-3 w-3 text-orange-600" />
              <span className="text-[10px] font-black text-orange-600 font-mono">{formatTime(timeLeft)}</span>
            </div>
          </div>
          <div className="flex gap-2.5">
            <Button 
              size="xs"
              variant="outline"
              className="h-7 border-red-200 text-red-600 bg-white hover:bg-red-50 font-bold px-3 rounded-lg text-[10px] uppercase tracking-wider"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, ORDER_STATUS.CANCELLED);
              }}
            >
              Reject
            </Button>
            <Button 
              size="xs"
              className="h-7 bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4 rounded-lg text-[10px] uppercase tracking-wider shadow-sm shadow-emerald-200"
              onClick={(e) => {
                e.stopPropagation();
                onUpdateStatus(order.id, ORDER_STATUS.ACCEPTED);
              }}
            >
              Accept
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
});
