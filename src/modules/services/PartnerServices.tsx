import * as React from "react";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { partnerServices, type PartnerService } from "@/data/partner-mock";
import { AddServiceStepForm } from "./AddServiceStepForm";
import { PartnerServiceCard } from "./PartnerServiceCard";
import { ServiceFilters } from "./ServiceFilters";
import { Plus } from "lucide-react";
import { HiChevronLeft } from "react-icons/hi";

export function PartnerServices({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [services, setServices] = React.useState(partnerServices);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [editingService, setEditingService] = React.useState<PartnerService | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      setIsScrolled(container.scrollTop > 10);
    };
    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = React.useMemo(() => {
    const cats = new Set(services.map((s) => s.category));
    return ["All", ...Array.from(cats)];
  }, [services]);

  const filteredServices = React.useMemo(() => {
    let list = services;
    if (selectedCategory !== "All") {
      list = list.filter((s) => s.category === selectedCategory);
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter(
        (s) =>
          s.name.toLowerCase().includes(query) ||
          s.description.toLowerCase().includes(query)
      );
    }
    
    return list;
  }, [services, selectedCategory, searchQuery]);

  useSetShell({
    title: (
      <div className="flex w-full items-center gap-2">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          className="rounded-xl p-2 hover:bg-slate-900/5 transition-colors"
          aria-label="Back"
        >
          <HiChevronLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="truncate font-semibold text-slate-900">My Services</div>
          <div className="text-xs text-slate-500 truncate">Manage your offerings</div>
        </div>
        <Button 
          size="sm" 
          className="rounded-full px-4 shadow-md shadow-orange-200"
          onClick={() => setShowAddForm(true)}
        >
          <Plus className="w-4 h-4 mr-1" />
          Add New
        </Button>
      </div>
    ),
    bottomNav: showAddForm ? null : <BottomNav activeTab="services" onTabChange={onNavigate} />,
  });

  const handleSave = (payload: Omit<PartnerService, "id"> & { id?: string }) => {
    if (payload.id) {
      setServices((prev) => prev.map((item) => (item.id === payload.id ? (payload as PartnerService) : item)));
    } else {
      setServices((prev) => [{ ...payload, id: `svc-${Date.now()}` } as PartnerService, ...prev]);
    }
    setShowAddForm(false);
    setEditingService(null);
  };

  const startEdit = (service: PartnerService) => {
    setEditingService(service);
    setShowAddForm(true);
  };

  const toggleService = (id: string, enabled: boolean) => {
    setServices((prev) => prev.map((item) => (item.id === id ? { ...item, enabled } : item)));
  };

  const deleteService = (id: string) => {
    setServices((prev) => prev.filter((item) => item.id !== id));
  };

  if (showAddForm) {
    return (
      <AddServiceStepForm
        initialData={editingService}
        onBack={() => {
          setShowAddForm(false);
          setEditingService(null);
        }}
        onSave={handleSave}
      />
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-4">
      {/* Sticky Header Section */}
      <ServiceFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        isScrolled={isScrolled}
      />

      {/* Main Content Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 scroll-smooth"
      >
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Your Offerings</h2>
            <Badge variant="default" className="bg-[#FF9933]/10 text-[#B35300] border-none px-2 rounded-lg font-bold">
              {filteredServices.length}
            </Badge>
          </div>
          {filteredServices.length < services.length && (
            <button 
              onClick={() => {
                setSelectedCategory("All");
                setSearchQuery("");
              }}
              className="text-[11px] font-bold text-slate-400 hover:text-[#FF9933] transition-colors uppercase tracking-tight"
            >
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid gap-1 pb-24">
          {filteredServices.map((service) => (
            <PartnerServiceCard
              key={service.id}
              service={service}
              onToggle={toggleService}
              onEdit={startEdit}
              onDelete={deleteService}
            />
          ))}

          {filteredServices.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 px-6 text-center bg-white rounded-3xl border border-dashed border-slate-200 mt-2">
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4 text-[#FF9933] animate-pulse">
                <Plus className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">No services found</h3>
              <p className="text-sm text-slate-500 mt-1.5 max-w-[240px] leading-relaxed">
                {searchQuery.trim() 
                  ? `We couldn't find any services matching "${searchQuery}".`
                  : selectedCategory === "All" 
                    ? "Start adding the services you want to offer to your customers." 
                    : `No services found in the "${selectedCategory}" category.`}
              </p>
              
              <div className="flex flex-col gap-3 mt-6 w-full max-w-[200px]">
                {(selectedCategory !== "All" || searchQuery.trim()) ? (
                  <Button 
                    variant="outline"
                    className="rounded-2xl border-slate-200 font-bold"
                    onClick={() => {
                      setSelectedCategory("All");
                      setSearchQuery("");
                    }}
                  >
                    Clear Search & Filters
                  </Button>
                ) : (
                  <Button 
                    className="rounded-2xl font-bold bg-[#FF9933] hover:bg-[#E68A2E] shadow-lg shadow-orange-100"
                    onClick={() => setShowAddForm(true)}
                  >
                    Add First Service
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
