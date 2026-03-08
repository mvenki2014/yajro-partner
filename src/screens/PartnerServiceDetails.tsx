import * as React from "react";
import { useNavigate } from "react-router-dom";
import { useSetShell } from "@/context/ShellContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { partnerServices } from "@/data/partner-mock";
import { StatusToggle } from "@/modules/dashboard/StatusToggle";
import {
  HiOutlineClock,
  HiOutlineDocumentText,
  HiOutlineClipboardDocumentList,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineSquares2X2,
  HiOutlineCheckCircle,
  HiOutlinePauseCircle,
} from "react-icons/hi2";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Package, IndianRupee } from "lucide-react";

const PACKAGE_CONFIGS = {
  Basic: {
    container: "bg-[#F8EFE6] border-[#E2C7AF] shadow-md shadow-orange-200/40",
    title: "text-[#9A3412]",
    glow: "bg-[#E7B98A]",
    iconBg: "bg-orange-100/50",
    iconColor: "text-orange-600",
    badge: "bg-orange-100/80 text-[#9A3412]"
  },
  Standard: {
    container: "bg-[#EEF6F0] border-[#BFE3CC] shadow-md shadow-green-200/40",
    title: "text-[#166534]",
    glow: "bg-[#86D19E]",
    iconBg: "bg-green-100/50",
    iconColor: "text-green-600",
    badge: "bg-green-100/80 text-[#166534]"
  },
  Premium: {
    container: "bg-[#F7ECEF] border-[#E3B8C2] shadow-md shadow-rose-200/40",
    title: "text-[#9F1239]",
    glow: "bg-[#F2A7B5]",
    iconBg: "bg-rose-100/50",
    iconColor: "text-rose-600",
    badge: "bg-rose-100/80 text-[#9F1239]"
  }
} as const;

const FADE_UP_VARIANTS = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function PartnerServiceDetails({
  serviceId,
}: {
  serviceId?: string;
}) {
  const navigate = useNavigate();
  const service = React.useMemo(
    () => partnerServices.find((item) => item.id === serviceId),
    [serviceId]
  );
  const [enabled, setEnabled] = React.useState(service?.enabled ?? false);

  React.useEffect(() => {
    if (!service) {
      navigate("/services", { replace: true });
    } else {
      setEnabled(service.enabled);
    }
  }, [service, navigate]);

  useSetShell({
    title: (
      <PageHeader
        title="Service Details"
        onBack={() => navigate("/services")}
        showPremium={false}
        rightElement={
          <StatusToggle
            isOnline={enabled}
            onToggle={() => setEnabled((prev) => !prev)}
            activeLabel="ACTIVE"
            inactiveLabel="PAUSED"
            activeLabelClassName="text-emerald-600"
            inactiveLabelClassName="text-red-600"
            inactiveIconClassName="text-red-500 shadow-inner"
            inactiveDotClassName="bg-red-500"
            activeIcon={HiOutlineCheckCircle}
            inactiveIcon={HiOutlinePauseCircle}
          />
        }
      />
    ),
    bottomNav: null,
  });

  if (!service) {
    return null;
  }

  const minPrice = service.packages?.length
    ? Math.min(...service.packages.map((pkg) => pkg.price))
    : service.basePrice;
  const serviceImage = service.image || "/images/dummy-pooja-service.png";

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      className="space-y-3 pb-18"
    >
      {/* Hero Header Card */}
      <motion.div variants={FADE_UP_VARIANTS} transition={{ duration: 0.5 }}>
        <Card className="relative overflow-hidden rounded-2xl border-slate-200/60 bg-gradient-to-br from-white to-[#FFF9F2] p-4 shadow-xl shadow-orange-100/30">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FF9933]/10 blur-3xl" />
          <div className="pointer-events-none absolute -left-10 -bottom-10 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />
          
          <div className="relative z-10">
            <div className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15 }}
                className="mb-3 h-16 w-16 overflow-hidden rounded-2xl border-[3px] border-white bg-white shadow-md ring-1 ring-orange-100"
              >
                <img
                  src={serviceImage}
                  alt={service.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/images/dummy-pooja-service.png";
                  }}
                />
              </motion.div>
              
              <div className="flex flex-col items-center gap-0.5 mb-2">
                <div className="flex items-center gap-1.5">
                  <h1 className="text-lg font-bold text-slate-900">{service.name}</h1>
                  {enabled && <HiOutlineCheckCircle className="h-4 w-4 text-emerald-500" />}
                </div>
                <div className="flex items-center gap-1.5">
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {service.category}
                  </p>
                  <div className="h-1 w-1 rounded-full bg-slate-300" />
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">
                    {service.visitType}
                  </p>
                </div>
              </div>
  
              <div className="flex items-center justify-center w-full gap-6 pt-3 mt-1 border-t border-slate-100/80">
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    <IndianRupee className="h-2 w-2" />
                    <span>Starts From</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-900">₹{minPrice.toLocaleString("en-IN")}</p>
                </div>
                <div className="h-6 w-[1px] bg-slate-100" />
                <div className="flex flex-col items-center">
                  <div className="flex items-center gap-1 text-[8px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">
                    <HiOutlineClock className="h-2 w-2" />
                    <span>Duration</span>
                  </div>
                  <p className="text-[13px] font-bold text-slate-900">{service.duration}</p>
                </div>
              </div>
            </div>
            
          </div>
        </Card>
      </motion.div>

      {/* Info Sections */}
      <div className="grid grid-cols-1 gap-4">
        {/* Description Section */}
        <motion.div variants={FADE_UP_VARIANTS} transition={{ delay: 0.1 }}>
          <Card className="rounded-2xl border-none p-3 shadow-lg shadow-slate-200/40 bg-gradient-to-br from-white to-[#FFF9F2] overflow-hidden relative border-l-4 border-l-orange-500/60">
            <div className="mb-3 flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center shadow-inner">
                <HiOutlineDocumentText className="h-3.5 w-3.5 text-orange-600" />
              </div>
              <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">About this Service</h2>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-600 font-bold opacity-90 pl-1">{service.description}</p>
          </Card>
        </motion.div>
  
        {/* Packages Section */}
        {service.packages && service.packages.length > 0 && (
          <motion.div variants={FADE_UP_VARIANTS} transition={{ delay: 0.2 }} className="space-y-3">
            <div className="flex items-center justify-between px-1">
               <div className="flex items-center gap-2">
                 <div className="h-7 w-7 rounded-lg bg-indigo-50 flex items-center justify-center">
                   <HiOutlineSquares2X2 className="h-3.5 w-3.5 text-indigo-600" />
                 </div>
                 <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Available Packages</h2>
               </div>
               <Badge className="bg-indigo-50 text-indigo-700 border-none ring-0 font-bold rounded-lg px-2 py-0.5 text-[9px]">
                 {service.packages.length} Tiers
               </Badge>
            </div>
            <div className="space-y-2">
              {service.packages.map((pkg, idx) => {
                const config = PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS] || PACKAGE_CONFIGS.Basic;
                return (
                  <motion.div
                    key={pkg.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                  >
                    <Card className={cn(
                      "group overflow-hidden rounded-xl ring-0 border-1 p-2.5 transition-all relative",
                      config.container
                    )}>
                      <div className={cn("absolute -right-6 -top-6 h-16 w-16 rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity", config.glow)} />
                      
                      <div className="flex items-center justify-between mb-1.5 relative z-10">
                        <div className="flex items-center gap-1.5">
                          <div className={cn("h-6 w-6 rounded-lg flex items-center justify-center shadow-md transition-transform group-hover:scale-110", config.iconBg)}>
                            <Package className={cn("h-3 w-3", config.iconColor)} />
                          </div>
                          <p className={cn("text-[13px] font-bold", config.title)}>{pkg.name}</p>
                        </div>
                        <div className={cn("font-semibold text-sm px-2 py-0.5 rounded-lg shadow-md", config.badge)}>
                          ₹{pkg.price.toLocaleString("en-IN")}
                        </div>
                      </div>
                      <div className="relative z-10 pl-8">
                        <p className={cn("text-[11px] font-bold leading-relaxed opacity-90", config.title)}>
                          {pkg.description}
                        </p>
                      </div>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
  
        {/* Items Section */}
        <motion.div variants={FADE_UP_VARIANTS} transition={{ delay: 0.3 }}>
          <Card className="rounded-2xl border-none p-3 shadow-lg shadow-slate-200/40 bg-gradient-to-br from-white to-[#FFF9F2] overflow-hidden relative border-l-4 border-l-emerald-500/60">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-lg bg-orange-50 flex items-center justify-center shadow-inner">
                  <HiOutlineClipboardDocumentList className="h-3.5 w-3.5 text-orange-600" />
                </div>
                <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Essential Items</h2>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 pl-1">
              {service.requiredItems.length > 0 ? (
                service.requiredItems.map((item, i) => (
                  <motion.div
                    key={item}
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.4 + (i * 0.05) }}
                  >
                    <Badge className="rounded-lg px-2.5 py-1 font-bold bg-[#FF9933]/10 text-[#B35300] text-[10px] shadow-sm border-[#FF9933]/20">
                      {item}
                    </Badge>
                  </motion.div>
                ))
              ) : (
                <div className="w-full py-6 text-center rounded-xl bg-slate-50 border-2 border-dashed border-slate-200">
                   <p className="text-[11px] font-bold text-slate-400">No special items required for this service</p>
                </div>
              )}
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Action Footer */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-white/80 backdrop-blur-md border-t border-slate-100 shadow-[0_-10px_30px_rgba(0,0,0,0.05)]">
        <div className="flex gap-3 max-w-lg mx-auto">
          <Button
            variant="secondary"
            className="h-12 flex-1 rounded-xl border-1 border-red-90 text-red-500 hover:bg-red-50 hover:text-red-600 hover:border-red-100 font-bold transition-all active:scale-[0.98]"
            onClick={() => {
              const index = partnerServices.findIndex((item) => item.id === service.id);
              if (index !== -1) {
                partnerServices.splice(index, 1);
              }
              navigate("/services");
            }}
          >
            <HiOutlineTrash className="h-5 w-5" />
            Delete
          </Button>
          <Button
            variant="default"
            className="h-12 flex-[2] rounded-xl font-bold text-sm shadow-lg shadow-orange-200 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 border-none transition-all active:scale-[0.98]"
            onClick={() => navigate(`/services/form/${service.id}`)}
          >
            <HiOutlinePencilSquare className="h-4 w-4 mr-2" />
            Edit Service
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
