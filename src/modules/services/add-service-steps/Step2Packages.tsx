import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { Package, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";

interface Step2Props {
  formData: Omit<PartnerService, "id">;
  errors: Record<string, string>;
  updateField: (field: keyof Omit<PartnerService, "id">, value: any) => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
}

const PACKAGE_CONFIGS = {
  Basic: {
    container: "bg-[#F8EFE6] border-[#E2C7AF] shadow-sm shadow-orange-200/40",
    title: "text-[#9A3412]",
    glow: "bg-[#E7B98A]",
  },
  Standard: {
    container: "bg-[#EEF6F0] border-[#BFE3CC] shadow-sm shadow-green-200/40 ring-1 ring-green-300/60",
    title: "text-[#166534]",
    glow: "bg-[#86D19E]",
  },
  Premium: {
    container: "bg-[#F7ECEF] border-[#E3B8C2] shadow-sm shadow-rose-200/40",
    title: "text-[#9F1239]",
    glow: "bg-[#F2A7B5]",
  }
} as const;

const COMMON_INPUT_CLASSES = "bg-white/60 border-slate-200 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#FF9933]/50 transition-all shadow-sm rounded-xl";

interface PackageItemProps {
  name: "Basic" | "Standard" | "Premium";
  idx: number;
  pkg: { price: number; description: string };
  errors: Record<string, string>;
  onUpdate: (idx: number, field: "price" | "description", val: any) => void;
}

const PackageItem: React.FC<PackageItemProps> = React.memo(({ name, idx, pkg, errors, onUpdate }) => {
  const config = PACKAGE_CONFIGS[name];
  const priceError = errors[`packages_${idx}_price`];
  const descError = errors[`packages_${idx}_description`];

  return (
    <div className={cn("p-3 mb-3 rounded-xl border relative overflow-hidden transition-all duration-300 hover:scale-[1.01]", config.container)}>
      <div className={cn("pointer-events-none absolute -right-6 -bottom-6 h-24 w-24 rounded-full opacity-30 blur-2xl", config.glow)} />

      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between mb-0.5">
          <div className="flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full animate-pulse", config.glow)} />
            <h4 className={cn("font-bold text-sm", config.title)}>{name} Package</h4>
          </div>
          <Package className="w-4 h-4 text-slate-400/50" />
        </div>

        <div className="space-y-1.5 mb-2.5">
          <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Price (INR)</Label>
          <Input
            icon={<IndianRupee className="w-3.5 h-3.5 text-slate-400" />}
            placeholder="0.00"
            type="number"
            value={pkg.price || ""}
            onChange={(e) => onUpdate(idx, "price", e.target.value === "" ? 0 : Number(e.target.value))}
            className={cn(
              COMMON_INPUT_CLASSES,
              "h-10 text-sm font-bold tabular-nums",
              priceError && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
            )}
          />
          {priceError && <p className="text-[10px] text-red-500 ml-1 font-bold">{priceError}</p>}
        </div>

        <div className="space-y-1.5">
          <Label className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Short Description</Label>
          <Textarea
            placeholder={`What's included in ${name.toLowerCase()}?`}
            rows={2}
            value={pkg.description}
            onChange={(e) => onUpdate(idx, "description", e.target.value)}
            className={cn(
              COMMON_INPUT_CLASSES,
              "min-h-16 text-[13px] resize-none",
              descError && "border-red-400 focus:ring-red-400/20 focus:border-red-400"
            )}
          />
        </div>
        {descError && <p className="text-[10px] text-red-500 ml-1 font-bold">{descError}</p>}
      </div>
    </div>
  );
});

export const Step2Packages: React.FC<Step2Props> = ({
                                                      formData,
                                                      errors,
                                                      updateField,
                                                      setErrors,
                                                    }) => {
  const updatePackageField = React.useCallback((idx: number, field: "price" | "description", val: any) => {
    const newPacks = [...(formData.packages || [])];
    const pkg = newPacks[idx] || { name: ["Basic", "Standard", "Premium"][idx] as any, price: 0, description: "" };
    newPacks[idx] = { ...pkg, [field]: val };
    updateField("packages", newPacks);

    const errorKey = `packages_${idx}_${field}`;
    if (errors[errorKey] && (field === "price" ? val > 0 : val.trim())) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[errorKey];
        return next;
      });
    }
  }, [formData.packages, errors, updateField, setErrors]);

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      {(["Basic", "Standard", "Premium"] as const).map((name, idx) => (
        <PackageItem
          key={name}
          name={name}
          idx={idx}
          pkg={formData.packages?.[idx] || { price: 0, description: "" }}
          errors={errors}
          onUpdate={updatePackageField}
        />
      ))}
    </div>
  );
};
