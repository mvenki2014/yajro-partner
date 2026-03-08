import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { PartnerService } from "@/data/partner-mock";
import { HiOutlinePencilSquare, HiOutlineTrash, HiOutlineCurrencyRupee, HiOutlineClock, HiOutlineMapPin } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface PartnerServiceCardProps {
  service: PartnerService;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (service: PartnerService) => void;
  onDelete: (id: string) => void;
  onOpenDetails: (service: PartnerService) => void;
}

export function PartnerServiceCard({
  service,
  onToggle,
  onEdit,
  onDelete,
  onOpenDetails,
}: PartnerServiceCardProps) {
  const serviceImage = service.image || "/images/dummy-pooja-service.png";
  const minPrice = service.packages?.length ? Math.min(...service.packages.map((pkg) => pkg.price)) : service.basePrice;

  return (
    <Card
      className="mb-1 relative overflow-hidden p-3.5 bg-gradient-to-br from-white to-[#FFF9F2] border-slate-200/60 shadow-md shadow-slate-300/20 rounded-2xl hover:shadow-lg transition-all cursor-pointer group"
      onClick={() => onOpenDetails(service)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onOpenDetails(service);
        }
      }}
    >
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-[#FF9933]/5 blur-2xl group-hover:bg-[#FF9933]/10 transition-colors" />
      <div className="relative z-10">
        <div className="flex items-start gap-3.5">
          <div className="w-16 h-16 rounded-xl overflow-hidden shadow-sm flex-shrink-0 bg-white group-hover:shadow-md transition-shadow">
            <img
              src={serviceImage}
              alt={service.name}
              className="w-full h-full object-cover p-1 transition-transform group-hover:scale-105 duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/images/dummy-pooja-service.png";
              }}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <h3 className="text-base font-bold text-slate-900 truncate tracking-tight">{service.name}</h3>
              </div>
              <div onClick={(e) => e.stopPropagation()} className="flex items-center scale-90 origin-right">
                <button 
                  onClick={() => onToggle(service.id, !service.enabled)}
                  className={cn(
                    "flex min-w-[84px] items-center justify-center gap-2 rounded-full border px-3 py-1.5 transition-all duration-300 active:scale-95",
                    service.enabled 
                      ? "bg-emerald-50 text-emerald-600 border-emerald-200 shadow-sm" 
                      : "bg-red-100 text-red-600 border-red-200 shadow-inner opacity-90"
                  )}
                >
                  <div className="relative flex h-1.5 w-1.5">
                    {service.enabled && (
                      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
                    )}
                    <div className={cn(
                      "relative h-1.5 w-1.5 rounded-full transition-colors duration-500",
                      service.enabled ? "bg-emerald-500" : "bg-red-600"
                    )} />
                  </div>
                  <span className="text-[9px] font-black uppercase tracking-widest">
                    {service.enabled ? "Active" : "Paused"}
                  </span>
                </button>
              </div>
            </div>
            
            <div className="mt-1 flex items-center gap-2">
              <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
                {service.category}
              </p>
              {!service.enabled && (
                <Badge variant="neutral" className="text-[8px] px-1.5 py-0 rounded-md">Disabled</Badge>
              )}
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2">
              <div className="rounded-xl bg-white/60 p-2 ring-1 ring-slate-100/50 shadow-sm">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="h-4 w-4 rounded-md bg-orange-50 flex items-center justify-center">
                    <HiOutlineCurrencyRupee className="h-2.5 w-2.5 text-orange-500" />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Price</p>
                </div>
                <p className="text-[11px] font-extrabold text-slate-800">₹{minPrice.toLocaleString("en-IN")}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-2 ring-1 ring-slate-100/50 shadow-sm">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="h-4 w-4 rounded-md bg-orange-50 flex items-center justify-center">
                    <HiOutlineClock className="h-2.5 w-2.5 text-orange-500" />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Time</p>
                </div>
                <p className="text-[11px] font-extrabold text-slate-800 truncate">{service.duration}</p>
              </div>
              <div className="rounded-xl bg-white/60 p-2 ring-1 ring-slate-100/50 shadow-sm">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="h-4 w-4 rounded-md bg-orange-50 flex items-center justify-center">
                    <HiOutlineMapPin className="h-2.5 w-2.5 text-orange-500" />
                  </div>
                  <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Type</p>
                </div>
                <p className="text-[11px] font-extrabold text-slate-800 truncate">{service.visitType}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100/60">
          <div className="flex items-center gap-1.5">
            {service.customPrice && (
              <Badge variant="gold" className="text-[9px] px-2 py-0.5 rounded-lg shadow-sm">Premium</Badge>
            )}
            {service.requiredItems.length > 0 && (
              <Badge variant="secondary" className="text-[9px] px-2 py-0.5 rounded-lg shadow-sm border-none">
                {service.requiredItems.length} Essentials
              </Badge>
            )}
          </div>
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full h-8 w-8 text-[#FF9933] border-orange-100 bg-white shadow-sm hover:bg-orange-50"
              onClick={() => onEdit(service)}
            >
              <HiOutlinePencilSquare className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon-sm"
              className="rounded-full h-8 w-8 text-red-500 border-red-500/10 bg-white shadow-sm hover:bg-red-50 hover:border-red-500/20"
              onClick={() => onDelete(service.id)}
            >
              <HiOutlineTrash className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
