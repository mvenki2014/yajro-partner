import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { Badge } from "@/components/ui/Badge";
import { ChevronDown, IndianRupee, Package } from "lucide-react";
import { PACKAGE_CONFIGS } from "@/config/appConfig";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";

interface Step2Props {
  formData: Omit<PartnerService, "id">;
  errors: Record<string, string>;
  updateField: (field: keyof Omit<PartnerService, "id">, value: any) => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const COMMON_INPUT_CLASSES = "bg-white/60 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FF9933]/50 transition-all shadow-sm rounded-xl";

export const Step2Packages: React.FC<Step2Props> = ({
  formData,
  errors,
  updateField,
  setErrors,
}) => {
  const hoursList = Array.from({ length: 13 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];
  const adminImage = "/images/dummy-pooja-service.png";

  const getDurationParts = (duration: string) => {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    const hours = match ? parseInt(match[1]) : 0;
    const minutes = match ? parseInt(match[2]) : 0;
    return { hours, minutes };
  };

  const clearFieldError = (field: string) => {
    if (!errors[field]) {
      return;
    }
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const updateDuration = (hours: number, minutes: number) => {
    updateField("duration", `${hours}h ${minutes}m`);
    clearFieldError("duration");
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-white to-[#FFF9F2] p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-slate-100 ring-1 ring-orange-100">
            <img
              src={adminImage}
              alt={formData.name || "Service"}
              className="h-full w-full object-cover"
              onError={(event) => {
                (event.target as HTMLImageElement).src = "/images/dummy-pooja-service.png";
              }}
            />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <p className="text-sm font-bold text-slate-900">{formData.name || "Selected Service"}</p>
              <Badge className="rounded-lg border-none bg-orange-100 text-[#B35300] text-[9px] shadow-none">
                {formData.category || "Service"}
              </Badge>
            </div>
            <p className="mt-1 text-[11px] leading-5 text-slate-600">{formData.description || "Add your partner service details below."}</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Min/Starting Price</Label>
        <Input
          icon={<IndianRupee className="w-3.5 h-3.5 text-slate-400" />}
          placeholder="Enter your price"
          type="number"
          value={formData.basePrice || ""}
          onChange={(e) => {
            updateField("basePrice", e.target.value === "" ? 0 : Number(e.target.value));
            clearFieldError("basePrice");
          }}
          className={cn(
            COMMON_INPUT_CLASSES,
            "h-11 text-sm font-bold tabular-nums",
            errors.basePrice && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
          )}
        />
        {errors.basePrice && <p className="text-[10px] text-red-500 ml-1">{errors.basePrice}</p>}
        {!errors.basePrice && (formData.adminPackages?.length || 0) > 0 && (
          <p className="text-[10px] text-slate-400 ml-1">
            Must be less than or equal to the admin basic price.
          </p>
        )}
      </div>

      {(formData.adminPackages?.length || 0) > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between px-1">
            <Label className="text-xs uppercase text-slate-500">Admin Package Prices</Label>
            <span className="text-[10px] font-bold text-slate-400">Read only</span>
          </div>
          <div className="space-y-2">
            {formData.adminPackages?.map((pkg) => (
              <div
                key={`${pkg.name}-${pkg.price}`}
                className={cn(
                  "rounded-2xl border px-3 py-3 shadow-sm",
                  PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS]?.container ?? "border-slate-200 bg-white"
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 items-start gap-2">
                    <div
                      className={cn(
                        "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl",
                        PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS]?.iconBg ?? "bg-orange-50",
                        PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS]?.iconColor ?? "text-[#FF9933]"
                      )}
                    >
                      <Package className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p
                        className={cn(
                          "text-sm font-bold",
                          PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS]?.title ?? "text-slate-900"
                        )}
                      >
                        {pkg.name}
                      </p>
                      <p className="mt-0.5 text-[11px] leading-5 text-slate-500">{pkg.description}</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      "rounded-xl px-2.5 py-1 text-xs font-bold",
                      PACKAGE_CONFIGS[pkg.name as keyof typeof PACKAGE_CONFIGS]?.price ?? "bg-orange-50 text-[#B35300]"
                    )}
                  >
                    ₹{pkg.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Your Service Duration</Label>
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <select
              value={getDurationParts(formData.duration).hours}
              onChange={(e) => updateDuration(parseInt(e.target.value), getDurationParts(formData.duration).minutes)}
              className={cn(
                "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
                errors.duration && "border-red-500"
              )}
            >
              {hoursList.map((h) => (
                <option key={h} value={h}>
                  {h} Hr{h !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
          <div className="flex-1 relative">
            <select
              value={getDurationParts(formData.duration).minutes}
              onChange={(e) => updateDuration(getDurationParts(formData.duration).hours, parseInt(e.target.value))}
              className={cn(
                "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
                errors.duration && "border-red-500"
              )}
            >
              {minutesList.map((m) => (
                <option key={m} value={m}>
                  {m} Min{m !== 1 ? "s" : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </div>
        {errors.duration && <p className="text-[10px] text-red-500 ml-1">{errors.duration}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Visit Type</Label>
        <div className="grid grid-cols-3 gap-2">
          {(["Home Visit", "Temple Visit", "Both"] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                updateField("visitType", type);
                clearFieldError("visitType");
              }}
              className={cn(
                "py-2 px-1 text-[10px] font-bold rounded-xl border transition-all",
                formData.visitType === type
                  ? "bg-orange-100 border-[#FF9933] text-[#B35300]"
                  : "bg-slate-50 border-slate-200 text-slate-500"
              )}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900">Custom Price Option</p>
            <p className="text-[10px] text-slate-500">Allow customers to request a custom quote above your starting price</p>
          </div>
          <Switch
            checked={formData.customPrice}
            onCheckedChange={(val) => updateField("customPrice", val)}
          />
        </div>
      </div>
    </div>
  );
};
