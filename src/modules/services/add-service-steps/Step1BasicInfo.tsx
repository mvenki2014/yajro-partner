import * as React from "react";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/Label";
import { Switch } from "@/components/ui/Switch";
import { ChevronDown, ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PartnerService } from "@/data/partner-mock";

interface Step1Props {
  formData: Omit<PartnerService, "id">;
  errors: Record<string, string>;
  updateField: (field: keyof Omit<PartnerService, "id">, value: any) => void;
  setErrors: React.Dispatch<React.SetStateAction<Record<string, string>>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({
  formData,
  errors,
  updateField,
  setErrors,
  fileInputRef,
}) => {
  const categories = ["Pooja", "Homam", "Ceremony", "Astrology", "Other"];
  const hoursList = Array.from({ length: 13 }, (_, i) => i);
  const minutesList = [0, 15, 30, 45];

  const getDurationParts = (duration: string) => {
    const match = duration.match(/(\d+)h\s*(\d+)m/);
    const hours = match ? parseInt(match[1]) : 0;
    const minutes = match ? parseInt(match[2]) : 0;
    return { hours, minutes };
  };

  const handleHourChange = (h: number) => {
    const { minutes } = getDurationParts(formData.duration);
    const durationStr = `${h}h ${minutes}m`;
    updateField("duration", durationStr);
    if (errors.duration) setErrors(prev => {
      const next = { ...prev };
      delete next.duration;
      return next;
    });
  };

  const handleMinuteChange = (m: number) => {
    const { hours } = getDurationParts(formData.duration);
    const durationStr = `${hours}h ${m}m`;
    updateField("duration", durationStr);
    if (errors.duration) setErrors(prev => {
      const next = { ...prev };
      delete next.duration;
      return next;
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateField("image", reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
      <div className="flex flex-col items-center justify-center mb-6">
        <Label className="text-xs uppercase text-slate-500 mb-2 w-full text-left ml-1">Service Icon</Label>
        <div className="relative group">
          <div className="w-24 h-24 rounded-2xl bg-slate-50 border-2 border-dashed border-slate-200 flex items-center justify-center overflow-hidden transition-all group-hover:border-[#FF9933]/50">
            {formData.image ? (
              <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
            ) : (
              <ImagePlus className="w-8 h-8 text-slate-300 group-hover:text-[#FF9933]/50" />
            )}
          </div>
          <input 
            ref={fileInputRef}
            type="file" 
            accept="image/*" 
            onChange={handleImageChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
          {formData.image && (
            <button 
              onClick={() => {
                updateField("image", undefined);
                if (fileInputRef.current) {
                  fileInputRef.current.value = "";
                }
              }}
              className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>
        <p className="text-[10px] text-slate-400 mt-2">Tap to upload service image</p>
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Service Name</Label>
        <Input 
          placeholder="e.g. Satyanarayana Pooja" 
          value={formData.name} 
          onChange={(e) => {
            updateField("name", e.target.value);
            if (errors.name) setErrors(prev => {
              const next = { ...prev };
              delete next.name;
              return next;
            });
          }}
          className={cn(
            "bg-white border-slate-200 focus:border-[#FF9933] transition-all shadow-sm",
            errors.name && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
          )}
        />
        {errors.name && <p className="text-[10px] text-red-500 ml-1">{errors.name}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Category</Label>
        <div className="relative">
          <select
            value={formData.category}
            onChange={(e) => {
              updateField("category", e.target.value);
              if (errors.category) setErrors(prev => {
                const next = { ...prev };
                delete next.category;
                return next;
              });
            }}
            className={cn(
              "flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-[#FF9933]/45 focus:border-[#FF9933]/50 transition-all text-slate-900 shadow-sm",
              errors.category && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
            )}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
        </div>
        {errors.category && <p className="text-[10px] text-red-500 ml-1">{errors.category}</p>}
      </div>

      <div className="space-y-2">
        <Label className="text-xs uppercase text-slate-500 ml-1">Description</Label>
        <Textarea 
          placeholder="Describe the service details..." 
          rows={3}
          value={formData.description} 
          onChange={(e) => {
            updateField("description", e.target.value);
            if (errors.description) setErrors(prev => {
              const next = { ...prev };
              delete next.description;
              return next;
            });
          }}
          className={cn(
            "bg-white border-slate-200 focus:border-[#FF9933] transition-all resize-none shadow-sm",
            errors.description && "border-red-500 focus:ring-red-500/20 focus:border-red-500"
          )}
        />
        {errors.description && <p className="text-[10px] text-red-500 ml-1">{errors.description}</p>}
      </div>

      <div className="grid grid-cols-1 gap-4 pt-2">
        <div className="space-y-2">
          <Label className="text-xs uppercase text-slate-500 ml-1 text-xs">Estimated Duration</Label>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <select
                value={getDurationParts(formData.duration).hours}
                onChange={(e) => handleHourChange(parseInt(e.target.value))}
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
                onChange={(e) => handleMinuteChange(parseInt(e.target.value))}
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
          <Label className="text-xs uppercase text-slate-500 ml-1 text-xs">Visit Type</Label>
          <div className="grid grid-cols-3 gap-2">
            {["Home Visit", "Temple Visit", "Both"].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => updateField("visitType", type)}
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
      </div>

      <div className="pt-2">
        <div className="flex items-center justify-between p-3 rounded-2xl bg-orange-50/50 border border-orange-100 shadow-sm">
          <div className="space-y-0.5">
            <p className="text-xs font-bold text-slate-900">Custom Price Option</p>
            <p className="text-[10px] text-slate-500">Allow customers to request quotes</p>
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
