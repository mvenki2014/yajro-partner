import * as React from "react";
import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { Button } from "@/components/ui/Button";
import { type PartnerService } from "@/data/partner-mock";
import { ServiceCard } from "@/modules/services/ServiceCard";
import { ServiceFilters } from "@/modules/services/ServiceFilters";
import { DeleteServiceConfirmDialog } from "@/modules/services/DeleteServiceConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { usePoojaServices, POOJA_SERVICES_QUERY_KEY } from "@/hooks/usePoojaServices";
import { poojaServicesApi } from "@/lib/api";
import { Plus } from "lucide-react";
import { HiChevronLeft } from "react-icons/hi";
import { useNavigate } from "react-router-dom";

export function Services({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const [serviceToDelete, setServiceToDelete] = React.useState<PartnerService | null>(null);
  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [isScrolled, setIsScrolled] = React.useState(false);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { services, isLoading } = usePoojaServices();

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
          <div className="text-xs text-slate-500 truncate">Manage your opted offerings</div>
        </div>
        <Button
          size="sm"
          className="rounded-full px-4 shadow-md shadow-orange-200"
          onClick={() => navigate("/services/form")}
        >
          <Plus className="w-4 h-4 mr-1 font-bold" />
          Opt Service
        </Button>
      </div>
    ),
    bottomNav: <BottomNav activeTab="services" onTabChange={onNavigate} />,
  });

  const openDetails = (service: PartnerService) => navigate(`/services/${service.id}`);

  const toggleMutation = useMutation({
    mutationFn: async ({ id, enabled }: { id: string; enabled: boolean }) => {
      if (enabled && !user?.isKycVerified) {
        throw new Error("Complete KYC before activating a service");
      }
      return poojaServicesApi.updateStatus(id, { enabled });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: POOJA_SERVICES_QUERY_KEY });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service status");
    },
  });

  const toggleService = (id: string, enabled: boolean) => {
    const currentService = services.find((item) => item.id === id);
    if (!currentService) {
      return;
    }

    if (enabled && !user?.isKycVerified) {
      toast.error("Complete KYC before activating a service");
      return;
    }

    toggleMutation.mutate({ id, enabled });
  };

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
            <h2 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em]">Your Offerings</h2>
            <div className="h-5 px-2 flex items-center justify-center bg-orange-50 text-[#FF9933] border border-orange-100 rounded-lg text-[10px] font-black tracking-tight">
              {filteredServices.length}
            </div>
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

        <div className="grid gap-2 pb-12">
          {isLoading && (
            <div className="rounded-3xl border border-slate-200 bg-white px-4 py-8 text-center text-sm font-semibold text-slate-500">
              Loading services...
            </div>
          )}

          {filteredServices.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onToggle={toggleService}
              onEdit={(serviceToEdit) => navigate(`/services/form/${serviceToEdit.id}`)}
              onDelete={(id) => {
                const selected = services.find((item) => item.id === id) || null;
                setServiceToDelete(selected);
              }}
              onOpenDetails={openDetails}
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
                    ? "Choose services from the admin catalog and add your partner details." 
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
                    onClick={() => navigate("/services/form")}
                  >
                    Opt First Service
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <DeleteServiceConfirmDialog
        open={Boolean(serviceToDelete)}
        onOpenChange={(open) => {
          if (!open) {
            setServiceToDelete(null);
          }
        }}
        serviceName={serviceToDelete?.name}
        onConfirm={() => {
          if (serviceToDelete) {
            toast.error("Delete service API is not available yet");
            setServiceToDelete(null);
          }
        }}
      />
    </div>
  );
}
