import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchLocation } from "@/store/slices/locationSlice";
import { MobileShell } from "@/components/layout/MobileShell";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationsDialog } from "@/components/home/NotificationsDialog";
import { OffersSection } from "@/components/home/OffersSection";
import { SeasonalSpecials } from "@/components/home/SeasonalSpecials";
import { PopularServices } from "@/components/home/PopularServices";
import { categories, services } from "@/data/mock";
import {
  DiyaIcon,
  KalashIcon,
  LotusIcon,
  StarsIcon,
  TempleIcon,
} from "@/components/icons/VedicIcons";

const iconMap = {
  kalash: KalashIcon,
  diya: DiyaIcon,
  lotus: LotusIcon,
  temple: TempleIcon,
  stars: StarsIcon,
} as const;

export function Home({
  onSelectService,
  onOpenBooking,
  onNavigate,
}: {
  onSelectService: (serviceId: string) => void;
  onOpenBooking: () => void;
  onNavigate?: (page: string, categoryId?: string) => void;
}) {
  const [query, setQuery] = React.useState("");
  const [hasUnread, setHasUnread] = React.useState(true);
  const [locationLabel] = React.useState<string | null>("Current Location");

  const dispatch = useDispatch<AppDispatch>();
  const { data: locationData, loading: isLocating, lastUpdated } = useSelector((state: RootState) => state.location);

  React.useEffect(() => {
    // Only fetch if we don't have data or it's older than 5 minutes
    const shouldFetch = !locationData || !lastUpdated || (Date.now() - lastUpdated > 5 * 60 * 1000);
    if (shouldFetch) {
      dispatch(fetchLocation());
    }
  }, [dispatch, locationData, lastUpdated]);

  const location = locationData?.address || "Location unavailable";

  const handleGetLocation = () => {
    dispatch(fetchLocation());
  };

  const muhurtham = {
    label: "Today’s Muhurtham",
    time: "07:24 AM – 08:10 AM",
    note: "Abhijit Muhurta",
  };

  const filtered = services.filter((s) =>
    (s.title + " " + s.subtitle).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  return (
    <>
      <MobileShell
        title={
          <>
            <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <div className="text-[#FF9933]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0Z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div className="flex items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity" onClick={handleGetLocation}>
                <span className="text-sm font-bold text-slate-900">{locationLabel || "Current Location"}</span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`text-slate-400 transition-transform ${isLocating ? 'animate-spin' : ''}`}>
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </div>
            </div>
            <div className={`mt-0.5 truncate text-[11px] font-medium text-slate-500 pl-5 transition-opacity ${isLocating ? 'opacity-50' : 'opacity-100'}`}>
              {location}
            </div>
          </div>
            <button
              type="button"
              onClick={() => {
                setHasUnread(false);
                setIsNotificationsOpen(true);
              }}
              className="relative rounded-full p-2 hover:bg-slate-100 transition"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-700">
                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {hasUnread && (
                <span className="absolute right-2.5 top-2.5 flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-red-500"></span>
                </span>
              )}
            </button>
        </>
      }
      bottomNav={<BottomNav activeTab="home" onTabChange={(tab) => onNavigate?.(tab)} />}
    >
      <div className="space-y-4">
        <div>
          <label className="text-base font-bold text-slate-900 mb-3 block">
            Search for a Pooja
          </label>
          <div className="relative">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search (e.g., Satyanarayana Vratam)"
              className="w-full rounded-2xl bg-white px-4 py-4 pr-12 text-sm ring-1 ring-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-[#FF9933]/45 transition-all"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
            </div>
          </div>
        </div>

        <Card className="overflow-hidden">
          <div className="px-4 py-3 bg-gradient-to-r from-[#FF9933]/15 via-amber-200/20 to-transparent">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-slate-700">{muhurtham.label}</div>
                <div className="text-sm font-bold text-slate-900">{muhurtham.time}</div>
              </div>
              <div className="flex gap-2">
                <Badge variant="success">Shubh</Badge>
              </div>
            </div>
            <div className="mt-1 text-xs text-slate-500">{muhurtham.note}</div>
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-emerald-500 bg-white shadow-sm">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-emerald-50 flex items-center justify-center text-xl shrink-0">
                🙏
              </div>
              <div className="min-w-0">
                <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider truncate">Active Booking</div>
                <div className="text-sm font-bold text-slate-900 truncate">Satyanarayana Swamy Vratam</div>
              </div>
            </div>
            <Button 
              size="xs" 
              variant="secondary" 
              className="text-[#B35300] font-bold h-7 ring-1 ring-orange-100 shrink-0"
              onClick={() => onNavigate?.("tracking")}
            >
              Track
            </Button>
          </div>
          <div className="mt-3 flex items-center gap-2 text-[11px] text-slate-500 font-medium bg-slate-50 p-2 rounded-lg">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Poojari assigned and preparing materials</span>
          </div>
        </Card>

        <div>
          <div className="flex items-end justify-between">
            <h2 className="text-lg font-semibold">Categories</h2>
            <button 
              onClick={() => onNavigate?.("services")}
              className="text-xs font-semibold text-[#B35300] hover:underline"
            >
              View all
            </button>
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3">
            {categories.slice(0, 6).map((c) => {
              const Icon = iconMap[c.icon as keyof typeof iconMap] || StarsIcon;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onNavigate?.("services", c.id)}
                  className="rounded-2xl bg-white ring-1 ring-slate-200/70 p-3 text-left shadow-sm hover:bg-slate-50"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FF9933]/10 text-[#B35300]">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="mt-2 text-xs font-semibold text-slate-900 leading-snug">
                    {c.name}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <OffersSection />

        <SeasonalSpecials onOpenBooking={onOpenBooking} />

        <PopularServices services={filtered} onSelectService={onSelectService} />
      </div>
      </MobileShell>

      <NotificationsDialog 
        open={isNotificationsOpen} 
        onOpenChange={setIsNotificationsOpen} 
      />
    </>
  );
}
