import * as React from "react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Switch } from "@/components/ui/Switch";
import { PartnerService } from "@/data/partner-mock";
import { HiOutlineClock, HiOutlineMapPin, HiOutlineCurrencyRupee, HiOutlinePencilSquare, HiOutlineTrash } from "react-icons/hi2";

interface PartnerServiceCardProps {
  service: PartnerService;
  onToggle: (id: string, enabled: boolean) => void;
  onEdit: (service: PartnerService) => void;
  onDelete: (id: string) => void;
}

export function PartnerServiceCard({ service, onToggle, onEdit, onDelete }: PartnerServiceCardProps) {
  return (
    <Card className="mb-4 relative overflow-hidden p-3.5 pt-3 bg-gradient-to-br from-white to-[#FFF9F2] border-slate-200/60 shadow-md shadow-slate-300/30 rounded-2xl hover:shadow-lg transition-shadow">
      <div className="pointer-events-none absolute -right-10 -bottom-10 h-44 w-44 rounded-full bg-[#FF9933]/5 blur-2xl" />
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
              <Badge variant={service.enabled ? "default" : "neutral"} className="text-[9px] px-1.5 py-0">
                {service.enabled ? "Active" : "Inactive"}
              </Badge>
            </div>
            <p className="text-xs font-medium text-[#B35300] bg-orange-50 w-fit px-2 py-0.5 rounded-md">
              {service.category}
            </p>
          </div>
          <Switch
            checked={service.enabled}
            onCheckedChange={(value) => onToggle(service.id, value)}
          />
        </div>

        <p className="text-sm text-slate-600 line-clamp-2 mb-4 leading-relaxed">
          {service.description}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center text-[13px] text-slate-600 font-medium">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
              <HiOutlineClock className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span>{service.duration}</span>
          </div>
          <div className="flex items-center text-[13px] text-slate-600 font-medium">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
              <HiOutlineMapPin className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span className="line-clamp-1">{service.visitType}</span>
          </div>
          <div className="flex items-center text-[13px] text-slate-600 font-medium col-span-2">
            <div className="h-6.5 w-6.5 rounded-lg bg-orange-50 flex items-center justify-center mr-2.5 shadow-sm">
              <HiOutlineCurrencyRupee className="h-3.5 w-3.5 text-orange-500" />
            </div>
            <span>
              {service.packages && service.packages.length > 0 
                ? `Starts from ₹${Math.min(...service.packages.map(p => p.price))}`
                : `₹${service.basePrice}`}
            </span>
          </div>
        </div>

        {service.packages && service.packages.length > 0 && (
          <div className="mb-4 space-y-2">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Available Packages</p>
            <div className="grid grid-cols-3 gap-2">
              {service.packages.map((pkg) => {
                const bgColors = {
                  Basic: "bg-[#F8EFE6] border-[#E2C7AF] shadow-sm shadow-orange-200/40",
                  Standard: "bg-[#EEF6F0] border-[#BFE3CC] shadow-sm shadow-green-200/40",
                  Premium: "bg-[#F7ECEF] border-[#E3B8C2] shadow-sm shadow-rose-200/40",
                };
                const textColors = {
                  Basic: { title: "text-[#9A3412]", price: "text-slate-700" },
                  Standard: { title: "text-[#166534]", price: "text-slate-700" },
                  Premium: { title: "text-[#9F1239]", price: "text-slate-700" },
                };
                const colorClass = bgColors[pkg.name as keyof typeof bgColors] || "bg-slate-50 border-slate-100";
                const textColor = textColors[pkg.name as keyof typeof textColors] || { title: "text-slate-400", price: "text-slate-700" };

                return (
                  <div key={pkg.name} className={`${colorClass} rounded-xl p-2.5 border relative overflow-hidden transition-all hover:scale-[1.02]`}>
                     <div className={`pointer-events-none absolute -right-3 -bottom-3 h-14 w-14 rounded-full opacity-30 blur-xl ${
                       pkg.name === 'Basic' ? 'bg-[#E7B98A]' : 
                       pkg.name === 'Standard' ? 'bg-[#86D19E]' : 
                       pkg.name === 'Premium' ? 'bg-[#F2A7B5]' : 'bg-slate-400'
                     }`} />
                    <div className="relative z-10">
                      <p className={`text-[10px] font-extrabold uppercase tracking-wider mb-0.5 ${textColor.title}`}>{pkg.name}</p>
                      <p className={`text-sm font-bold tracking-tight text-slate-900`}>₹{pkg.price}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <div className="flex gap-1.5">
            {service.customPrice && (
              <Badge variant="gold" className="rounded-lg">Custom Price</Badge>
            )}
            {service.requiredItems.length > 0 && (
              <Badge variant="outline" className="rounded-lg">
                {service.requiredItems.length} Items
              </Badge>
            )}
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary" 
              size="icon-sm" 
              className="rounded-full"
              onClick={() => onEdit(service)}
            >
              <HiOutlinePencilSquare className="w-3.5 h-3.5 text-slate-600" />
            </Button>
            <Button 
              variant="secondary" 
              size="icon-sm" 
              className="rounded-full hover:bg-red-50 hover:ring-red-100"
              onClick={() => onDelete(service.id)}
            >
              <HiOutlineTrash className="w-3.5 h-3.5 text-red-500" />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
}
