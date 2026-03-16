import * as React from "react";
import { Label } from "@/components/ui/Label";
import appData from "@/data/app-data.json";
import { Badge } from "@/components/ui/Badge";
import { Clock3, IndianRupee, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";

interface Step1Props {
  formData: Omit<PartnerService, "id">;
  errors: Record<string, string>;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  onSelectCatalogService: (catalogServiceId: string) => void;
  isEditMode?: boolean;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  errors,
  setErrors,
  onSelectCatalogService,
  isEditMode = false,
}) => {
  const catalogServices = appData.services.map((service) => ({
    id: service.id,
    title: service.title,
    subtitle: service.subtitle,
    significance: service.significance,
    durationLabel: `${Math.floor(service.durationMins / 60)}h ${service.durationMins % 60}m`,
    baseFromPrice: service.baseFromPrice,
    category: appData.categories.find((item) => item.id === service.categoryId)?.name || "Pooja",
  }));

  const selectedCatalogService = catalogServices.find((service) => service.id === formData.catalogServiceId);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="space-y-2">
        <div className="flex items-center justify-between px-1">
          <Label className="text-xs uppercase text-slate-500">Select Service</Label>
          <span className="text-[10px] font-bold text-slate-400">
            {isEditMode ? "Catalog locked" : `${catalogServices.length} available`}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {catalogServices.map((service) => {
            const isSelected = formData.catalogServiceId === service.id;
            return (
              <button
                key={service.id}
                type="button"
                disabled={isEditMode}
                onClick={() => {
                  onSelectCatalogService(service.id);
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.name;
                    delete next.category;
                    delete next.description;
                    return next;
                  });
                }}
                className={cn(
                  "rounded-2xl border p-3 text-left transition-all shadow-sm",
                  isSelected
                    ? "border-[#FF9933] bg-orange-50 shadow-orange-100"
                    : "border-slate-200 bg-white hover:border-orange-200",
                  isEditMode && "cursor-not-allowed opacity-80"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate text-[12px] font-bold text-slate-900">{service.title}</p>
                    <p className="mt-1 line-clamp-2 text-[10px] leading-4 text-slate-500">{service.subtitle}</p>
                  </div>
                  {isSelected && (
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#FF9933] text-white">
                      <Sparkles className="h-3 w-3" />
                    </div>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                  <span>{service.category}</span>
                </div>
              </button>
            );
          })}
        </div>
        {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
      </div>

      {selectedCatalogService && (
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-[#FFF9F2] p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-orange-50 text-[#FF9933]">
              <Sparkles className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-900">{selectedCatalogService.title}</p>
                <Badge className="rounded-lg border-none bg-orange-100 text-[#B35300] text-[9px] shadow-none">
                  {selectedCatalogService.category}
                </Badge>
              </div>
              <p className="mt-1 text-[11px] leading-5 text-slate-600">{selectedCatalogService.significance}</p>
              <div className="mt-3 grid grid-cols-2 gap-2">
                <div className="rounded-xl bg-white/80 p-2 ring-1 ring-orange-100">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <Clock3 className="h-3 w-3 text-[#FF9933]" />
                    Duration
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-900">{selectedCatalogService.durationLabel}</p>
                </div>
                <div className="rounded-xl bg-white/80 p-2 ring-1 ring-orange-100">
                  <div className="flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider text-slate-400">
                    <IndianRupee className="h-3 w-3 text-[#FF9933]" />
                    Base Suggestion
                  </div>
                  <p className="mt-1 text-xs font-bold text-slate-900">₹{selectedCatalogService.baseFromPrice}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
