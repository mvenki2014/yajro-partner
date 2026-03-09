import * as React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSetShell } from "@/context/ShellContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { DialogBackground } from "@/components/layout/DialogBackground";
import { partnerBookings, type PartnerBookingStatus, ORDER_STATUS } from "@/data/partner-mock";
import { motion } from "framer-motion";
import { HiChevronLeft } from "react-icons/hi";

import {
  Phone,
  MapPin,
  Calendar,
  Clock,
  Navigation,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Package,
  User,
  IndianRupee
} from "lucide-react";

const PACKAGE_BADGE_CLASSES: Record<string, string> = {
  Basic: "bg-[#F8EFE6] text-[#9A3412] border-[#E2C7AF]",
  Standard: "bg-[#EEF6F0] text-[#166534] border-[#BFE3CC]",
  Premium: "bg-[#F7ECEF] text-[#9F1239] border-[#E3B8C2]",
};

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0 }
};

function getStatusVariant(status: PartnerBookingStatus) {
  switch (status) {
    case ORDER_STATUS.PENDING:
      return "gold" as const;
    case ORDER_STATUS.ACCEPTED:
      return "info" as const;
    case ORDER_STATUS.IN_PROGRESS:
      return "warning" as const;
    case ORDER_STATUS.COMPLETED:
      return "success" as const;
    case ORDER_STATUS.CANCELLED:
      return "destructive" as const;
    default:
      return "neutral" as const;
  }
}

export function PartnerOrderDetails() {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = React.useState(() =>
    partnerBookings.find(b => b.id === orderId)
  );

  const [timeLeft, setTimeLeft] = React.useState<number>(300); // 5 mins in seconds

  React.useEffect(() => {
    if (order?.status !== ORDER_STATUS.PENDING || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [order?.status, timeLeft]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const getStatusColor = (status: PartnerBookingStatus) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return "gold";
      case ORDER_STATUS.ACCEPTED: return "info";
      case ORDER_STATUS.IN_PROGRESS: return "warning";
      case ORDER_STATUS.COMPLETED: return "success";
      case ORDER_STATUS.CANCELLED: return "destructive";
      default: return "neutral";
    }
  };

  const getStatusIcon = (status: PartnerBookingStatus) => {
    switch (status) {
      case ORDER_STATUS.PENDING: return <Clock className="h-3 w-3 animate-pulse" />;
      case ORDER_STATUS.ACCEPTED: return <CheckCircle2 className="h-3 w-3" />;
      case ORDER_STATUS.IN_PROGRESS: return <div className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />;
      case ORDER_STATUS.COMPLETED: return <CheckCircle2 className="h-3 w-3" />;
      case ORDER_STATUS.CANCELLED: return <XCircle className="h-3 w-3" />;
      default: return null;
    }
  };


  useSetShell({
    title: (
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => navigate("/orders")}
          className="rounded-xl p-2 hover:bg-slate-900/5 transition-colors"
          aria-label="Back"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900">Order Details</div>
          <div className="text-xs text-slate-500 truncate">{order ? `#${order.id.toUpperCase()}` : ""}</div>
        </div>
        {order ? (
          <div className="flex items-center gap-1.5">
            {order.status === ORDER_STATUS.PENDING && (
              <div className={`rounded-lg px-2 py-1 border ${timeLeft <= 60 ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
                <div className="flex items-center gap-1">
                  <Clock className={`h-3 w-3 ${timeLeft <= 60 ? "text-red-600" : "text-orange-600"}`} />
                  <span className={`text-[10px] font-black font-mono ${timeLeft <= 60 ? "text-red-600" : "text-orange-600"}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
              </div>
            )}
            <Badge variant={getStatusVariant(order.status)} className="px-2.5 py-1 text-[10px] gap-1.5">
              {getStatusIcon(order.status)}
              {order.status}
            </Badge>
          </div>
        ) : null}
      </div>
    ),
    bottomNav: null,
  });


  if (!order) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <Package className="h-12 w-12 text-slate-300 mb-4" />
        <h3 className="text-lg font-semibold text-slate-900">Order not found</h3>
        <p className="text-slate-500 mt-1">The order you're looking for doesn't exist or has been removed.</p>
        <Button className="mt-6" onClick={() => navigate("/orders")}>
          Back to Orders
        </Button>
      </div>
    );
  }

  const openInMaps = () => {
    const { lat, lng } = order.location;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
    window.open(url, "_blank");
  };

  const handleCall = () => {
    window.open(`tel:${order.customerPhone}`, "_self");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="pb-16 space-y-3"
    >
      {/* Service Details */}
      <motion.div variants={FADE_UP_VARIANTS} transition={{ delay: 0.1 }}>
        <Card className="group relative overflow-hidden border-none shadow-lg ring-1 ring-slate-200/60 bg-gradient-to-br from-white to-[#FFF9F2]">
          <DialogBackground />
          <div className="relative z-10">
            <div className="px-3.5 py-2 pr-2 border-b border-slate-100/60 bg-white/30 backdrop-blur-sm flex justify-between items-center">
              <h3 className="text-xs font-black text-orange-500 uppercase tracking-[0.15em] flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-orange-500" />
                Service Details
              </h3>
              <div className="flex gap-2">
                <Button size="icon" variant="outline" className="rounded-xl h-9 w-9 border-emerald-100 bg-white hover:bg-emerald-50 shadow-sm transition-all active:scale-95" onClick={handleCall}>
                  <Phone className="h-3.5 w-3.5 text-emerald-600" />
                </Button>
                <Button size="icon" variant="outline" className="rounded-xl h-9 w-9 border-blue-100 bg-white hover:bg-blue-50 shadow-sm transition-all active:scale-95">
                  <MessageSquare className="h-3.5 w-3.5 text-blue-600" />
                </Button>
              </div>
            </div>
            <div className="p-3.5 space-y-4 pt-2">
              {/* Service Type Row */}
              <div className="flex gap-3.5">
                {order.serviceImage ? (
                  <div className="relative group/img shrink-0">
                    <img src={order.serviceImage} alt={order.serviceType} className="h-10 w-10 rounded-2xl object-cover ring-2 ring-slate-900/10 shadow-lg" />
                  </div>
                ) : (
                  <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm border border-orange-100/50">
                    <Package className="h-5 w-5 text-orange-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Service Type</p>
                  <h4 className="text-sm font-black text-slate-900 leading-tight truncate">{order.serviceType}</h4>
                  {order.packageName && (
                    <div
                      className={`w-fit mt-1 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-wider ${
                        PACKAGE_BADGE_CLASSES[order.packageName] ?? "bg-orange-100 text-[#FF9933] border-orange-200"
                      }`}
                    >
                      {order.packageName} Package
                    </div>
                  )}
                </div>
              </div>

              {/* Price Row */}
              <div className="flex gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-emerald-50 flex items-center justify-center shadow-sm border border-emerald-100/50">
                  <IndianRupee className="h-5 w-5 text-emerald-600" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Payment Details</p>
                  <div className="flex items-center gap-2">
                    <span className="text-base font-extrabold text-emerald-700 tracking-tight">₹{order.amount.toLocaleString("en-IN")}</span>
                    <div className="px-2 py-0.5 rounded-lg bg-emerald-100/50 text-emerald-600 text-[8px] font-extrabold tracking-widest uppercase border border-emerald-200/50">PAID</div>
                  </div>
                </div>
              </div>

              {/* Customer Row */}
              <div className="flex items-start gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center border border-orange-100/50 shadow-sm">
                  <User className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Customer Name</p>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight truncate">{order.customerName}</h4>
                  <p className="text-[12px] text-slate-500 font-bold opacity-80 mt-0.5">{order.customerPhone}</p>
                </div>
              </div>

              {/* Date Row */}
              <div className="flex gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm border border-orange-100/50">
                  <Calendar className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Service Date</p>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight truncate">{order.dateTime.split("•")[0]}</h4>
                </div>
              </div>

              {/* Time Slot Row */}
              <div className="flex gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-orange-50 flex items-center justify-center shadow-sm border border-orange-100/50">
                  <Clock className="h-5 w-5 text-orange-500" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-0.5">Time Slot</p>
                  <h4 className="text-sm font-extrabold text-slate-900 leading-tight truncate">{order.dateTime.split("•")[1]}</h4>
                </div>
              </div>

              {/* Location Row */}
              <div className="flex gap-3.5">
                <div className="h-10 w-10 shrink-0 rounded-2xl bg-blue-50 flex items-center justify-center shadow-sm border border-blue-100/50">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0 pt-0.5">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">Service Location</p>
                  <p className="text-[12px] text-slate-700 font-bold leading-relaxed mb-3">
                    {order.address}
                  </p>
                  <Button
                    variant="outline"
                    className="w-full h-10 rounded-2xl border-blue-100 bg-blue-50/50 text-blue-700 text-[9px] font-extrabold flex items-center justify-center gap-2 hover:bg-blue-100 hover:border-blue-200 transition-all shadow-md active:scale-[0.98]"
                    onClick={openInMaps}
                  >
                    <Navigation className="h-3 w-3" />
                    GET DIRECTIONS ON MAPS
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Service Details */}
      <motion.div variants={FADE_UP_VARIANTS} transition={{ delay: 0.2 }}>
        <Card className="group relative overflow-hidden border-none shadow-lg ring-1 ring-slate-200/60 bg-gradient-to-br from-white to-[#FFF9F2]">
          <DialogBackground />
          <div className="relative z-10">
            <div className="p-3.5 border-b border-slate-100/60 bg-white/30 backdrop-blur-sm">
              <h3 className="text-xs font-extrabold text-slate-400 uppercase tracking-[0.15em] flex items-center gap-2">
                <Package className="h-3.5 w-3.5 text-orange-500" />
                Service Breakdown
              </h3>
            </div>
            <div className="p-3.5 pb-3 space-y-4">
              {order.itemsRequested && order.itemsRequested.length > 0 && (
                <div className="">
                  <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-widest mb-2">Checklist for Partner</p>
                  <div className="grid grid-cols-2 gap-2">
                    {order.itemsRequested.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 px-2.5 py-2 bg-white/50 rounded-xl ring-1 ring-slate-100 shadow-sm group/item">
                        <div className="h-1.5 w-1.5 rounded-full bg-orange-400 group-hover/item:scale-125 transition-transform" />
                        <span className="text-[10px] font-extrabold text-slate-700 tracking-tight">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="p-3.5 bg-orange-50/40 rounded-2xl border border-orange-100/40 relative overflow-hidden">
                  <p className="text-[9px] font-extrabold text-orange-400 uppercase tracking-widest mb-1.5 opacity-80">Customer Request</p>
                  <p className="text-[12px] text-slate-700 font-bold italic relative z-10 leading-relaxed">
                    "{order.notes}"
                  </p>
                  <div className="absolute -bottom-2 -right-2 text-orange-100/40 opacity-20">
                    <MessageSquare className="h-10 w-10 rotate-12" />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 z-50 mx-auto flex max-w-md gap-3 border-t border-slate-100 bg-white/90 p-4 backdrop-blur-md">
        {order.status === ORDER_STATUS.PENDING ? (
          <>
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl border-red-200 text-red-600 hover:bg-red-50 font-bold"
              onClick={() => setOrder((prev) => (prev ? { ...prev, status: ORDER_STATUS.CANCELLED } : prev))}
            >
              Reject
            </Button>
            <Button
              className="h-12 flex-[2] min-w-[140px] rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm font-bold"
              onClick={() => setOrder((prev) => (prev ? { ...prev, status: ORDER_STATUS.ACCEPTED } : prev))}
            >
              Accept Request
            </Button>
          </>
        ) : order.status === ORDER_STATUS.ACCEPTED ? (
          <>
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl border-blue-100 bg-white text-blue-600 font-bold flex items-center justify-center gap-2 hover:bg-blue-50 transition-all active:scale-95"
              onClick={openInMaps}
            >
              <Navigation className="h-4 w-4" />
              Route
            </Button>
            <Button
              className="h-12 flex-[2] rounded-xl font-bold bg-orange-600 text-white hover:bg-orange-700 shadow-sm active:scale-95 transition-all"
              onClick={() => setOrder(prev => prev ? {...prev, status: ORDER_STATUS.IN_PROGRESS} : prev)}
            >
              Start Service
            </Button>
          </>
        ) : order.status === ORDER_STATUS.IN_PROGRESS ? (
          <>
            <Button
              variant="outline"
              className="h-12 flex-1 rounded-xl border-emerald-100 bg-white text-emerald-600 font-bold flex items-center justify-center gap-2 hover:bg-emerald-50 transition-all active:scale-95"
              onClick={handleCall}
            >
              <Phone className="h-4 w-4" />
              Call
            </Button>
            <Button
              className="h-12 flex-[2] rounded-xl font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm active:scale-95 transition-all"
              onClick={() => setOrder(prev => prev ? {...prev, status: ORDER_STATUS.COMPLETED} : prev)}
            >
              Complete Service
            </Button>
          </>
        ) : (
          <Button
            variant="outline"
            className="w-full h-12 rounded-xl font-bold border-slate-200 text-slate-600 bg-slate-50 hover:bg-slate-100 transition-all active:scale-[0.98]"
            onClick={() => navigate("/orders")}
          >
            Return to Orders
          </Button>
        )}
      </div>
    </motion.div>
  );
}
