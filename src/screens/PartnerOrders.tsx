import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSetShell } from "@/context/ShellContext";
import { BottomNav } from "@/components/layout/BottomNav";
import { PageHeader } from "@/components/layout/PageHeader";
import { partnerBookings, type PartnerBookingStatus, ORDER_STATUS } from "@/data/partner-mock";
import { OrderCard } from "@/modules/orders/OrderCard";
import { 
  Search, 
  Package,
} from "lucide-react";

type FilterStatus = "All" | "Pending" | "Ongoing" | "Completed";

export function PartnerOrders({ onNavigate }: { onNavigate: (tab: any) => void }) {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = React.useState<FilterStatus>("All");
  const [searchQuery, setSearchQuery] = React.useState("");
  const [orders, setOrders] = React.useState(partnerBookings);
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

  useSetShell({
    title: <PageHeader title="My Orders" onBack={() => onNavigate("dashboard")} />,
    bottomNav: <BottomNav activeTab="orders" onTabChange={onNavigate} />,
  });

  const filteredOrders = React.useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = 
        order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.serviceType.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (activeFilter === "All") return matchesSearch;
      if (activeFilter === "Pending") return matchesSearch && order.status === ORDER_STATUS.PENDING;
      if (activeFilter === "Ongoing") return matchesSearch && (order.status === ORDER_STATUS.ACCEPTED || order.status === ORDER_STATUS.IN_PROGRESS);
      if (activeFilter === "Completed") return matchesSearch && order.status === ORDER_STATUS.COMPLETED;
      
      return matchesSearch;
    });
  }, [orders, searchQuery, activeFilter]);

  const updateStatus = React.useCallback((id: string, status: PartnerBookingStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)));
  }, []);

  const filterTabs: FilterStatus[] = ["All", "Pending", "Ongoing", "Completed"];

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] -mx-4">
      {/* Search and Filters - Sticky Header */}
      <div className={`z-30 pb-3 transition-all duration-300 px-4 bg-transparent sticky top-0 ${
        isScrolled ? "shadow-[0_4px_12px_rgba(0,0,0,0.06)] border-b border-b-slate-200/50 bg-slate-50/80 backdrop-blur-md" : ""
      }`}>
        <div className="space-y-3 pt-2">
          <div className="relative group">
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search orders, customers..."
              className="w-full rounded-2xl bg-white px-4 py-3 pr-12 text-sm ring-1 ring-slate-200 shadow-sm outline-none focus:ring-2 focus:ring-[#FF9933]/45 transition-all group-hover:ring-slate-300"
            />
            <div className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#FF9933] transition-colors">
              <Search className="h-5 w-5" />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
            <div className="flex gap-2 min-w-max py-0.5">
              {filterTabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveFilter(tab)}
                  className={`px-3.5 py-1.5 rounded-xl text-[12px] font-semibold transition-all duration-300 active:scale-95 whitespace-nowrap ${
                    activeFilter === tab 
                      ? "bg-[#FF9933] text-white shadow-lg shadow-orange-200/50" 
                      : "bg-white text-slate-600 border border-slate-200/60 shadow-sm hover:border-orange-200 hover:text-orange-500"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Orders List - Scrollable Area */}
      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-y-auto px-4 scroll-smooth"
      >
        <div className="space-y-4 pt-2 pb-24">
          {filteredOrders.length > 0 ? (
            filteredOrders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onClick={() => navigate(`/orders/${order.id}`)}
                onUpdateStatus={updateStatus}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl border border-slate-100">
              <Package className="h-12 w-12 text-slate-200 mb-4" />
              <h3 className="text-lg font-semibold text-slate-900">No orders found</h3>
              <p className="text-sm text-slate-500 mt-1">Try adjusting your filters or search query.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
