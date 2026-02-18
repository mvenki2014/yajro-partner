import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { services } from "@/data/mock";
import { Calendar, MapPin, Clock, Phone, MessageSquare, Info } from "lucide-react";

const sampleBookings = [
  {
    id: "BK-882731",
    serviceId: "satyanarayana-vratam",
    date: "2026-02-10",
    slot: "08-12",
    status: "In Progress",
    address: "Plot 12, Lakshmi Nagar, Kondapur, Hyderabad, 500084",
    price: 2299,
    tierName: "Standard",
    bookingDate: "2026-02-08 14:30",
  },
  {
    id: "BK-771209",
    serviceId: "griha-pravesh",
    date: "2026-01-15",
    slot: "04-08",
    status: "Completed",
    address: "Flat 401, Sri Krishna Residency, Banjara Hills, Hyderabad",
    price: 4299,
    tierName: "Premium",
    bookingDate: "2026-01-12 10:15",
  },
  {
    id: "BK-665412",
    serviceId: "car-pooja",
    date: "2025-12-20",
    slot: "12-16",
    status: "Completed",
    address: "Kondapur, Hyderabad",
    price: 1199,
    tierName: "Basic",
    bookingDate: "2025-12-18 16:45",
  },
];

export function BookingDetail({
  bookingId,
  onBack,
  onTrack,
}: {
  bookingId: string;
  onBack: () => void;
  onTrack: (serviceId: string) => void;
}) {
  const booking = sampleBookings.find((b) => b.id === bookingId) || sampleBookings[0];
  const service = services.find((s) => s.id === booking.serviceId) ?? services[0];
  const isInProgress = booking.status === "In Progress";

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatSlot = (slot: string) => {
    const slots: Record<string, string> = {
      "00-04": "12 AM - 04 AM",
      "04-08": "04 AM - 08 AM",
      "08-12": "08 AM - 12 PM",
      "12-16": "12 PM - 04 PM",
      "16-20": "04 PM - 08 PM",
      "20-24": "08 PM - 12 AM",
    };
    return slots[slot] || slot;
  };

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={onBack}
            className="rounded-xl p-2 hover:bg-slate-900/5"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold text-slate-900">Booking Details</div>
            <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{booking.id}</div>
          </div>
          <Badge variant={isInProgress ? "success" : "neutral"}>
            {isInProgress && <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse mr-1.5" />}
            {booking.status}
          </Badge>
        </>
      }
    >
      <div className="space-y-4 pb-8">
        {/* Service Summary Card */}
        <Card className="p-4 bg-gradient-to-br from-white via-white to-orange-50/30 overflow-hidden relative">
          <div className="absolute right-0 top-0 h-16 w-16 bg-[#FF9933]/5 rounded-bl-full flex items-start justify-end p-3">
             <div className="h-2 w-2 rounded-full bg-[#FF9933]" />
          </div>
          
          <div className="flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl shadow-inner shrink-0">
              {booking.serviceId === 'car-pooja' ? '🚗' : booking.serviceId === 'griha-pravesh' ? '🏠' : '🙏'}
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">{service.title}</h1>
              <p className="text-xs text-slate-500 mt-0.5 font-medium">{booking.tierName} Package</p>
            </div>
          </div>
        </Card>

        {/* Schedule & Location */}
        <Card className="p-4 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Calendar className="h-3.5 w-3.5 text-[#FF9933]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Date</span>
              </div>
              <div className="text-sm font-bold text-slate-800">{formatDate(booking.date)}</div>
            </div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 text-slate-400">
                <Clock className="h-3.5 w-3.5 text-[#FF9933]" />
                <span className="text-[10px] font-bold uppercase tracking-wider">Time Slot</span>
              </div>
              <div className="text-sm font-bold text-slate-800">{formatSlot(booking.slot)}</div>
            </div>
          </div>

          <div className="h-px bg-slate-50" />

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-[#FF9933]" />
              <span className="text-[10px] font-bold uppercase tracking-wider">Service Location</span>
            </div>
            <div className="text-sm text-slate-700 leading-relaxed font-medium">
              {booking.address}
            </div>
            <div className="mt-3 relative h-28 w-full rounded-xl overflow-hidden bg-slate-100 ring-1 ring-slate-100 shadow-inner">
               <img src="/images/map_dummy.png" alt="Map" className="h-full w-full object-cover opacity-60" />
               <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 rounded-full bg-[#FF9933] flex items-center justify-center ring-4 ring-white shadow-lg">
                    <MapPin className="h-4 w-4 text-white" />
                  </div>
               </div>
            </div>
          </div>
        </Card>

        {/* Poojari Info (Conditional/Mock) */}
        {isInProgress ? (
          <Card className="p-4 border-l-4 border-l-[#FF9933]">
            <div className="flex items-center justify-between mb-3">
               <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Assigned Poojari</h3>
               <Badge variant="success">On Time</Badge>
            </div>
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-full bg-slate-100 flex items-center justify-center text-2xl shadow-sm border border-white">
                👳
              </div>
              <div className="flex-1">
                <div className="text-sm font-bold text-slate-900">Pandit Rajesh Sharma</div>
                <div className="text-[11px] text-slate-500 font-medium">15+ years experience • English, Hindi</div>
              </div>
              <div className="flex gap-2">
                <button className="h-9 w-9 rounded-xl bg-orange-50 text-[#B35300] flex items-center justify-center ring-1 ring-orange-100 transition-transform active:scale-95 shadow-sm">
                  <Phone className="h-4 w-4" />
                </button>
                <button className="h-9 w-9 rounded-xl bg-slate-50 text-slate-600 flex items-center justify-center ring-1 ring-slate-100 transition-transform active:scale-95 shadow-sm">
                  <MessageSquare className="h-4 w-4" />
                </button>
              </div>
            </div>
            <div className="mt-4">
              <Button onClick={() => onTrack(booking.serviceId)} className="w-full h-11 shadow-lg shadow-orange-100">
                Track Live Status
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="p-4 bg-slate-50/50 border-dashed border-slate-200">
            <div className="flex items-center gap-2 text-slate-500 italic">
               <Info className="h-4 w-4" />
               <span className="text-xs">This service has been completed and archived.</span>
            </div>
          </Card>
        )}

        {/* Payment Summary */}
        <Card className="p-4">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Payment Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Dakshina</span>
              <span className="text-slate-900 font-bold">₹{booking.price - 49}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 font-medium">Convenience Fee</span>
              <span className="text-slate-900 font-bold">₹49</span>
            </div>
            <div className="h-px bg-slate-100 my-1" />
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900">Total Paid</span>
              <div className="text-right">
                <div className="text-lg font-black text-[#B35300]">₹{booking.price}</div>
                <div className="text-[9px] font-bold text-emerald-600 uppercase">Paid via Wallet</div>
              </div>
            </div>
          </div>
        </Card>

        {/* Footer Meta */}
        <div className="text-center space-y-1">
          <p className="text-[10px] text-slate-400 font-medium italic">Booked on {booking.bookingDate}</p>
          <button className="text-[10px] font-bold text-[#B35300] hover:underline uppercase tracking-wider">
            Download Invoice
          </button>
        </div>
      </div>
    </MobileShell>
  );
}
