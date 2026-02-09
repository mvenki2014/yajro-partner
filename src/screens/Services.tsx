import * as React from "react";
import { MobileShell } from "@/components/layout/MobileShell";
import { ServiceCard } from "@/components/ui/ServiceCard";
import { BottomNav } from "@/components/layout/BottomNav";
import { allCategories, services } from "@/data/mock";

interface ServicesProps {
  onSelectService: (serviceId: string) => void;
  onNavigate: (page: string, categoryId?: string) => void;
  initialCategory?: string;
}

export function Services({ onSelectService, onNavigate, initialCategory }: ServicesProps) {
  const [selectedCategory, setSelectedCategory] = React.useState(initialCategory || "all");
  const [searchQuery, setSearchQuery] = React.useState("");

  const filteredServices = React.useMemo(() => {
    let list = [...services];

    // Filter by category
    if (selectedCategory !== "all") {
      list = list.filter((s) => s.categoryId === selectedCategory);
    }

    // Filter by search
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.title.toLowerCase().includes(query) ||
          s.subtitle.toLowerCase().includes(query)
      );
    }

    return list;
  }, [selectedCategory, searchQuery]);

  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 20);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MobileShell
      title={
        <>
          <button
            type="button"
            onClick={() => onNavigate?.("home")}
            className="rounded-xl p-2 hover:bg-slate-900/5"
            aria-label="Back"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <div className="min-w-0 flex-1">
            <div className="truncate font-semibold">Services</div>
            <div className="text-xs text-slate-500 truncate">
              {filteredServices.length} {filteredServices.length === 1 ? 'service' : 'services'} found
            </div>
          </div>
        </>
      }
    >
      <div className="flex flex-col h-[calc(100vh-140px)] -mx-4">
        {/* Sticky Search and Categories */}
        <div className={`z-30 pb-4 transition-shadow duration-300 px-4 ${isScrolled ? 'shadow-md shadow-slate-200/50' : ''}`}>
          <div className="space-y-4">
            {/* Search Bar - Matches Home Page Style */}
            <div className="relative">
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for ceremonies, poojas..."
                className="w-full rounded-2xl bg-white px-4 py-4 pr-12 text-sm ring-1 ring-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-[#FF9933]/45 transition-all"
              />
              <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="7" />
                  <path d="M21 21l-4.3-4.3" />
                </svg>
              </div>
            </div>

            {/* Category Pills */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
              <div className="flex gap-2.5">
                {allCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`h-[34px] px-4 rounded-full text-[13px] font-medium whitespace-nowrap transition-all duration-200 active:scale-95 ${
                      selectedCategory === cat.id
                        ? "bg-[#FF9933]/15 ring-[#FF9933]/35 text-[#B35300]"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Scrollable Services List */}
        <div 
          ref={scrollContainerRef}
          className="flex-1 overflow-y-auto px-4 pt-2 scroll-smooth"
        >
          {filteredServices.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="text-6xl mb-4">🙏</span>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">No services found</h3>
              <p className="text-sm text-gray-500">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="space-y-3 services-list-section pb-8">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  id={service.id}
                  name={service.title}
                  description={service.subtitle}
                  price={service.baseFromPrice}
                  duration={`${Math.floor(service.durationMins / 60)}h ${service.durationMins % 60}m`}
                  popular={false}
                  image="/images/service_dummy.png"
                  onSelect={onSelectService}
                />
              ))}
            </div>
          )}
        </div>

        {/* Bottom Navigation */}
        <BottomNav activeTab="services" onTabChange={(tab) => onNavigate(tab)} />
      </div>
    </MobileShell>
  );
}
