import * as React from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchLocation } from "@/store/slices/locationSlice";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { NotificationsDialog } from "@/components/home/NotificationsDialog";
import { OffersSection } from "@/components/home/OffersSection";
import { SeasonalSpecials } from "@/components/home/SeasonalSpecials";
import { PopularServices } from "@/components/home/PopularServices";
import { SearchSection } from "@/components/home/SearchSection";
import { MuhurthamCard } from "@/components/home/MuhurthamCard";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { ActiveBookingCard } from "@/components/home/ActiveBookingCard";
import { HomeHeader } from "@/components/home/HomeHeader";
import { categories, services } from "@/data/mock";

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
    // Only fetch if we don't have data, or it's older than 5 minutes
    const shouldFetch = !locationData || !lastUpdated || (Date.now() - lastUpdated > 5 * 60 * 1000);
    if (shouldFetch) {
      dispatch(fetchLocation());
    }
  }, [dispatch, locationData, lastUpdated]);

  const location = React.useMemo(() => {
    if (!locationData) return "Location unavailable";
    
    // If we have a neighborhood / suburb and city, and they are different
    if (locationData.neighbourhood && locationData.city && locationData.neighbourhood !== locationData.city) {
      return `${locationData.neighbourhood}, ${locationData.city}`;
    }
    
    // Fallback to the city or neighborhood or whatever address we have
    return locationData.city || locationData.neighbourhood || locationData.address || "Location unavailable";
  }, [locationData]);

  const handleGetLocation = () => {
    dispatch(fetchLocation());
  };

  const muhurtham = {
    time: "07:24 AM – 08:10 AM",
    note: "Abhijit Muhurta",
  };

  const filtered = services.filter((s) =>
    (s.title + " " + s.subtitle).toLowerCase().includes(query.toLowerCase())
  ).slice(0, 4);

  const [isNotificationsOpen, setIsNotificationsOpen] = React.useState(false);

  const title = React.useMemo(() => (
    <HomeHeader 
      location={location}
      isLocating={isLocating}
      hasUnread={hasUnread}
      onGetLocation={handleGetLocation}
      onOpenNotifications={() => {
        setHasUnread(false);
        setIsNotificationsOpen(true);
      }}
    />
  ), [handleGetLocation, isLocating, location, hasUnread]);

  const bottomNav = React.useMemo(() => (
    <BottomNav activeTab="home" onTabChange={(tab) => onNavigate?.(tab)} />
  ), [onNavigate]);

  useSetShell({
    title,
    bottomNav,
  });

  return (
    <>
      <div className="space-y-4">
        <SearchSection query={query} setQuery={setQuery} />

        <MuhurthamCard muhurtham={muhurtham} />

        <ActiveBookingCard onNavigate={onNavigate} />

        <CategoryGrid categories={categories} onNavigate={onNavigate} />

        <SeasonalSpecials onOpenBooking={onOpenBooking} />

        <OffersSection />

        <PopularServices services={filtered} onSelectService={onSelectService} />
      </div>

      <NotificationsDialog 
        open={isNotificationsOpen} 
        onOpenChange={setIsNotificationsOpen} 
      />
    </>
  );
}
