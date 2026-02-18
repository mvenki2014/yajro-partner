import { MobileShell } from "@/components/layout/MobileShell";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";
import { Tab } from "@/types";
import { BookingCard } from "@/components/bookings/BookingCard";

export function Bookings({
                           onNavigate,
                           onTrackService,
                           onViewDetail,
                         }: {
  onNavigate: (tab: Tab) => void;
  onTrackService: (serviceId: string) => void;
  onViewDetail: (bookingId: string) => void;
}) {
  const sampleBookings = [
    {
      id: "BK-882731",
      serviceId: "satyanarayana-vratam",
      date: "2026-02-10",
      slot: "08-12",
      status: "In Progress",
      address: "Plot 12, Lakshmi Nagar, Hyderabad",
      price: 2299,
    },
    {
      id: "BK-771209",
      serviceId: "griha-pravesh",
      date: "2026-01-15",
      slot: "04-08",
      status: "Completed",
      address: "Flat 401, Sri Krishna Residency, Banjara Hills",
      price: 4299,
    },
    {
      id: "BK-665412",
      serviceId: "car-pooja",
      date: "2025-12-20",
      slot: "12-16",
      status: "Completed",
      address: "Kondapur, Hyderabad",
      price: 1199,
    },
  ];

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={() => onNavigate("home")}
            className="rounded-xl p-2 hover:bg-slate-900/5"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">My Bookings</div>
            <div className="text-xs text-slate-500 truncate">History of your spiritual services</div>
          </div>
          <Badge variant="saffron">{sampleBookings.length} Bookings</Badge>
        </>
      }
      bottomNav={<BottomNav activeTab="bookings" onTabChange={onNavigate} />}
    >
      <div className="space-y-3 pb-4">
        {sampleBookings.map((booking) => (
          <BookingCard
            key={booking.id}
            booking={booking}
            onViewDetail={onViewDetail}
            onTrackService={onTrackService}
          />
        ))}

        {sampleBookings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-20 w-20 rounded-full bg-orange-50 flex items-center justify-center text-4xl mb-4">
              📔
            </div>
            <h3 className="text-lg font-bold text-slate-900">No bookings yet</h3>
            <p className="text-sm text-slate-500 mt-1 max-w-[200px]">Your spiritual journey starts here. Book your first pooja today!</p>
            <Button className="mt-6" onClick={() => onNavigate('home')}>Explore Services</Button>
          </div>
        )}
      </div>
    </MobileShell>
  );
}
